/* eslint-disable @typescript-eslint/no-explicit-any */
import { atom } from "jotai"

import moonraker from "../moonraker"
import { Moonraker } from "../moonraker/moonraker"
import backoff from "../utilities/backoff"
import { logger } from "../utilities/logger"
import { PrinterInfo } from "./types"

export const idAtom = atom("")
export const printerAtom = atom(async (get) => {
	const id = get(idAtom)
	return moonraker(id)
})

const serverAtom = atom((get) => {
	const printer = get(printerAtom)

	return isConnected(printer)
})

const infoInitialAtom = atom(async (get) => {
	const printer = get(printerAtom)
	await get(serverAtom)

	const info = await getInfo(printer)
	return info
})

const infoDataAtom = atom<PrinterInfo>({})
export const infoAtom = atom(
	(get) => {
		const initialInfo = get(infoInitialAtom)
		const info = get(infoDataAtom)

		return Object.prototype.hasOwnProperty.call(info, "hostname")
			? info
			: initialInfo
	},
	async (_get, set, update: PrinterInfo) => {
		if (update) {
			set(infoDataAtom, update)
		}
	},
)

export const refreshInfoAtom = atom(null, async (get, set) => {
	const printer = get(printerAtom)

	set(infoDataAtom, await getInfo(printer))
})

export const objectsAtom = atom(async (get) => {
	const printer = get(printerAtom)
	await get(serverAtom)

	return printer.objectList()
})

export const fluiddAtom = atom(async (get) => {
	const printer = get(printerAtom)
	await get(serverAtom)

	return printer.fluidd()
})

export const gcodeHistoryServerDataAtom = atom(async (get) => {
	const printer = get(printerAtom)
	await get(serverAtom)

	return printer.gcodeHistory()
})

const isConnected = (printer: Moonraker) => {
	const serverInfo = async () => {
		const info = await printer.serverInfo()

		logger.info("server", info)

		if (!info?.klippy_connected) {
			throw new Error("Klippy not connected")
		}

		return info
	}

	return backoff(serverInfo, 3)
}
const getInfo = (printer: Moonraker) => backoff(printer.info, 4)
