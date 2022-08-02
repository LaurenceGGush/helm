/* eslint-disable @typescript-eslint/no-explicit-any */
import { nanoid } from "nanoid"

import { RequestError } from "../errors"
import deferred from "../utilities/deferred"
import { logger } from "../utilities/logger"

let socket: WebSocket

const requests = new Map()
const subscriptions = new Map()

async function connection(url: string) {
	if (socket instanceof WebSocket && socket.readyState === WebSocket.OPEN) {
		return { request, subscribe, unsubscribe }
	}

	await connect(url)

	return { request, subscribe, unsubscribe }
}

async function connect(url: string) {
	const { promise, resolve } = deferred()
	socket = new WebSocket(url)

	socket.onopen = (event) => {
		logger.info("socket opened", event)

		if (subscriptions.has("socketOpened")) {
			subscriptions.get("socketOpened")()
		}

		resolve()
	}

	socket.onclose = (event) => {
		logger.info(`socket closed: ${event.reason}`, `reconnecting in 1s`)

		if (subscriptions.has("socketClosed")) {
			subscriptions.get("socketClosed")()
		}

		setTimeout(async () => {
			resolve(await connect(url))
		}, 1000)
	}

	socket.onerror = (error) => {
		logger.error("socket error: ", error)
		socket.close()
	}

	socket.onmessage = handleMessage

	return promise
}

async function request(
	method: string,
	params?: object,
	action = "",
): Promise<any> {
	if (socket.readyState !== WebSocket.OPEN) {
		return Promise.reject(new Error("socket not open"))
	}

	const { promise, resolve, reject } = deferred()

	const id = nanoid()

	requests.set(id, {
		method,
		action,
		params,
		resolve,
		reject,
	})

	socket.send(createMessage(method, params, id))

	return promise
}

function subscribe(method: string, callback: CallableFunction) {
	logger.info("sub", method)
	subscriptions.set(method, callback)
}

function unsubscribe(method: string) {
	logger.info("unsub", method)
	subscriptions.delete(method)
}

function handleMessage(message: MessageEvent) {
	const data = JSON.parse(message.data)

	// If the message has no ID look for a generic handler in subscriptions
	if (!Object.prototype.hasOwnProperty.call(data, "id")) {
		if (subscriptions.has(data.method)) {
			subscriptions.get(data.method)(data.params)
		}

		return
	}

	if (requests.has(data.id)) {
		const request = requests.get(data.id)
		requests.delete(data.id)

		logger.log("re", request)

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

			if (data.error.code > 400) {
				logger.error("Request Error data:", errorData)
				request.reject(new Error(data.error.message))
			}

			request.reject(new RequestError(data.error.message, errorData))
		} else {
			const result = data.result === "ok" ? true : data.result

			request.resolve(result)
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

export default connection
