/* eslint-disable @typescript-eslint/no-explicit-any */
import { nanoid } from "nanoid"
import Sockette from "sockette"

import { RequestError } from "../errors"
import deferred from "../utilities/deferred"
import { logger } from "../utilities/logger"
import methods from "./methods"

type Subscription =
	| "socketOpened"
	| "socketClosed"
	| "socketOpening"
	| keyof Pick<
			typeof methods,
			| "notify_filelist_changed"
			| "notify_gcode_response"
			| "notify_klippy_disconnected"
			| "notify_klippy_ready"
			| "notify_status_update"
	  >

function Connection(wsUrl: string) {
	let sockette: Sockette
	let opening: ReturnType<typeof deferred<void>> | undefined,
		closing: ReturnType<typeof deferred<void>> | undefined
	const requests = new Map()
	const subscriptions: Map<Subscription, any> = new Map()

	return {
		call,
		subscribe,
		unsubscribe,
		open,
		close: () => sockette.close(),
		opened,
		closed,
	}

	async function opened() {
		if (!opening) {
			opening = deferred()
		}

		return opening.promise
	}
	async function closed() {
		if (!closing) {
			closing = deferred()
		}

		return closing.promise
	}
	async function open() {
		if (sockette) {
			sockette.open()
		}

		if (!opening) {
			opening = deferred()
		}

		sockette = new Sockette(wsUrl, {
			timeout: process.env.NODE_ENV === "test" ? 0 : 250,

			onopen: () => {
				logger.info("Socket opened")

				if (subscriptions.has("socketOpened")) {
					subscriptions.get("socketOpened")()
				}

				opening?.resolve()
				opening = undefined
			},
			onclose: async (event) => {
				// test cleanup
				if (event.reason === "test end") {
					logger.log(event.reason)
					return
				}

				logger.info(
					"Socket closed",
					event.code,
					event.wasClean,
					event.reason,
				)

				if (subscriptions.has("socketClosed")) {
					subscriptions.get("socketClosed")(event.reason)
				}

				opening?.reject("Socket Error")
				closing?.resolve()
			},
			// onerror: () => logger.error("Socket Error"),
			onmessage: handleMessage,
			onreconnect: (event) => {
				const reason = (event as CloseEvent)?.reason
				logger.log("Reconnecting...", reason)

				if (subscriptions.has("socketOpening")) {
					subscriptions.get("socketOpening")(reason)
				}
			},
			onmaximum: (e) => logger.log("Stop Attempting!", e?.reason),
		})

		return opening.promise
	}

	async function call(
		method: string,
		params?: object,
		action = "",
	): Promise<any> {
		const { promise, resolve, reject } = deferred()

		const id = nanoid()

		sockette.send(createMessage(method, params, id))

		requests.set(id, {
			method,
			action,
			params,
			resolve,
			reject,
		})

		return promise
	}

	function subscribe(method: Subscription, callback: CallableFunction) {
		logger.info("sub", method)
		subscriptions.set(method, callback)

		return () => unsubscribe(method)
	}

	function unsubscribe(method: Subscription) {
		logger.info("unsub", method)
		subscriptions.delete(method)
	}

	function handleMessage(message: MessageEvent) {
		const data = JSON.parse(message.data)

		// If the message has no ID look for a generic handler in subscriptions
		if (!data.id) {
			logger.log("d", data)

			if (subscriptions.has(data.method)) {
				subscriptions.get(data.method)(data.params)
			}

			return
		}

		if (requests.has(data.id)) {
			const request = requests.get(data.id)
			requests.delete(data.id)

			logger.log("d", data)

			if (data.error) {
				const errorData = {
					id: data.id,
					method: request.method,
					action: request.action,
					data: {
						requestParams: request.params,
						error: data.error,
					},
				}

				logger.error("Request Error data:", errorData)
				request.reject(new RequestError(data.error.message, errorData))
			} else {
				const result = data.result === "ok" ? true : data.result

				request.resolve(result)
			}
		}
	}
}

function createMessage(method: string, params?: object, id?: string) {
	return JSON.stringify({
		jsonrpc: "2.0",
		method,
		params,
		id,
	})
}

export default Connection
