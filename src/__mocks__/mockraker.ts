/* eslint-disable @typescript-eslint/no-explicit-any */

import merge from "deepmerge"
import { Client, Server } from "mock-socket"

import methods, { MoonrakerResponses } from "../moonraker/methods"
import { GcodeHistoryItem } from "../store/types"
import { zTiltOutput } from "../storybook/mockdata"
import { logger } from "../utilities/logger"

type ReverseMap<T extends Record<keyof T, keyof any>> = {
	[P in T[keyof T]]: {
		[K in keyof T]: T[K] extends P ? K : never
	}[keyof T]
}

const methodsLookup = Object.fromEntries(
	Object.entries(methods).map(([key, value]) => [value, key]),
) as ReverseMap<typeof methods>

function Mockraker(respond: MoonrakerResponses, id = "test") {
	// logger.info("Mockraker", id)
	let responses = respond
	let client: Client
	const ws = new Server("ws://localhost/websocket/" + id)

	ws.on("connection", (socket) => {
		client = socket

		socket.on("message", (message) => {
			console.log("m", id, message)
			if (typeof message !== "string") return

			sendResponses(message, responses, socket)

			sendUpdates(message, responses, socket)
		})
	})

	const updateResponses = (update: MoonrakerResponses) => {
		responses = merge.all([responses, update], {
			arrayMerge: (_, sourceArray) => sourceArray,
		})

		if (update.object_status?.status) {
			client.send(
				JSON.stringify({
					method: "notify_status_update",
					params: [update.object_status.status],
				}),
			)
		}
	}

	return {
		ws,
		updateResponses,
	}
}

function sendResponses(
	message: string,
	responses: MoonrakerResponses,
	socket: Client,
) {
	try {
		const data = JSON.parse(message) as {
			id: string
			method: keyof typeof methodsLookup
			params: any
		}
		const namespace = data.params?.namespace

		const lookup = methodsLookup[data.method]
		let response = responses[lookup]

		if (response && response[namespace]) {
			response = response[namespace]
		}

		if (response) {
			socket.send(
				JSON.stringify({
					id: data.id,
					result: response,
				}),
			)
		}
	} catch (error) {
		logger.error(error)
	}

	return false
}

function sendUpdates(
	message: string,
	responses: MoonrakerResponses,
	socket: Client,
) {
	const data = JSON.parse(message) as {
		id: string
		method: keyof typeof methodsLookup
		params: { script: string }
	}

	if (data.method === "printer.query_endstops.status") {
		socket.send(
			JSON.stringify({
				method: "notify_status_update",
				params: [
					{
						query_endstops: {
							last_query: responses.query_endstops,
						},
					},
				],
			}),
		)

		return
	}

	if (data.method === "printer.gcode.script") {
		if (data.params.script === "INIT") {
			outputZTilt(structuredClone(zTiltOutput), socket)

			return
		}

		const tool = data.params.script.match(/^T([0-9]*)/)
		if (tool) {
			socket.send(
				JSON.stringify({
					method: "notify_status_update",
					params: [
						{
							toolhead: {
								extruder: tool[1]
									? `extruder${tool[1]}`
									: "extruder",
							},
							dock: {
								tool_number: parseInt(tool[1], 10) + 1,
							},
						},
					],
				}),
			)

			return
		}

		const extruder = data.params.script.match(
			/^activate_extruder extruder=(.*)/,
		)
		if (extruder) {
			socket.send(
				JSON.stringify({
					method: "notify_status_update",
					params: [
						{
							toolhead: {
								extruder: extruder[1],
							},
						},
					],
				}),
			)

			return
		}
	}
}

function outputZTilt(outputs: GcodeHistoryItem[], socket: Client) {
	const output = outputs.shift()
	if (output) {
		socket.send(
			JSON.stringify({
				method: "notify_gcode_response",
				params: [output.message],
			}),
		)

		setTimeout(() => {
			outputZTilt(outputs, socket)
		}, 500)
	}
}

export default Mockraker
