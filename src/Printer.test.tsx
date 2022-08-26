// @vitest-environment jsdom

import { ChakraProvider } from "@chakra-ui/react"
import {
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react"
import { Provider } from "jotai"
import { Server } from "mock-socket"
import { afterEach, beforeEach, expect, test } from "vitest"

import Mockraker from "./__mocks__/mockraker"
import Printer from "./Printer"
import {
	baseData,
	baseEndstops,
	gcodeStore,
	version,
} from "./storybook/mockdata"

let ws: { ws: Server }
beforeEach(() => {
	ws = Mockraker(baseData)
})
afterEach(() => {
	ws.ws.close({ code: 1001, reason: "test end", wasClean: true })
	cleanup()
})

test("renders", async () => {
	render(
		<Provider>
			<ChakraProvider>
				<Printer />
			</ChakraProvider>
		</Provider>,
	)

	expect(await screen.findByText("Loading..."))

	expect(await screen.findByText(version))
})

test("display gcode history", async () => {
	render(
		<Provider>
			<ChakraProvider>
				<Printer />
			</ChakraProvider>
		</Provider>,
	)

	expect(await screen.findByText(version))

	fireEvent.click(screen.getByLabelText("Output"))

	await waitFor(() =>
		expect(screen.getByText(gcodeStore[1].message)).toBeVisible(),
	)
})

test("queries endstops", async () => {
	render(
		<Provider>
			<ChakraProvider>
				<Printer />
			</ChakraProvider>
		</Provider>,
	)

	expect(await screen.findByText(version))

	fireEvent.click(screen.getByLabelText("Klippy"))

	await waitFor(() => expect(screen.getByText(version)).toBeVisible())

	fireEvent.click(screen.getByText("Query Endstops"))

	await waitFor(() =>
		expect(screen.getAllByText(baseEndstops.x)[0]).toBeVisible(),
	)
})

test("LEDs button", async () => {
	render(
		<Provider>
			<ChakraProvider>
				<Printer />
			</ChakraProvider>
		</Provider>,
	)

	await waitFor(() =>
		expect(screen.getByLabelText("Toggle LEDs")).toBeVisible(),
	)
})
