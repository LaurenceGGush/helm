import WS from "jest-websocket-mock"
import { afterEach, beforeEach, expect, test } from "vitest"

import Connection from "./connection"

const wsUrl = "ws://localhost/websocket"

let ws: WS
let client: ReturnType<typeof Connection>

beforeEach(() => {
	ws = new WS(wsUrl, { jsonProtocol: true })
	client = Connection(wsUrl)
})
afterEach(() => {
	ws.close({ code: 1001, reason: "test end", wasClean: true })
	client.close()
	WS.clean()
})

test("connects and calls", async () => {
	await expect(client.open()).resolves.toBeUndefined()

	client.call("test")

	await expect(ws.nextMessage).resolves.toMatchObject({ method: "test" })
})

test("call throws when no connection", async () => {
	ws.close()

	await expect(client.open()).rejects.toThrow("Socket Error")
})

test("reconnects", async () => {
	let closed = false
	ws.on("connection", (socket) => {
		if (!closed) {
			closed = true
			socket.close({
				code: 1012,
				reason: "Server restart",
				wasClean: true,
			})
		}
	})

	await client.open()

	await expect(client.closed()).resolves.toBeUndefined()

	await expect(client.opened()).resolves.toBeUndefined()
})
