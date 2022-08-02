/* eslint-disable @typescript-eslint/no-explicit-any */
import merge from "deepmerge"
import { atom } from "jotai"
import { atomWithReducer, RESET } from "jotai/utils"

import { Moonraker } from "../moonraker/moonraker"
import { httpUrl } from "../settings"
import {
	Adjuster,
	AdjusterAction,
	GcodeHistoryItem,
	PrinterInfo,
	PrinterStatus,
	ServerSettings,
} from "./types"

const statusReducer = (
	status: PrinterStatus,
	newStatus: Partial<PrinterStatus> | typeof RESET,
) => {
	// logger.info("update", newStatus)
	if (!newStatus) return status

	if (newStatus === RESET) {
		return {}
	}

	if (newStatus["gcode_macro DOCK_INIT"]) {
		newStatus.dock = newStatus["gcode_macro DOCK_INIT"]
		delete newStatus["gcode_macro DOCK_INIT"]
	}

	return merge.all([status, newStatus], {
		arrayMerge: (_, sourceArray) => sourceArray,
	}) as PrinterStatus
}

export const printerAtom = atom<Moonraker | undefined>(undefined)
export const infoAtom = atom<PrinterInfo>({})
export const statusAtom = atomWithReducer({}, statusReducer)

export const fluiddAtom = atom<any>({})

export const serverSettingsAtom = atom<ServerSettings>((get) => {
	const fluidd = get(fluiddAtom)
	const name = fluidd?.uiSettings?.general?.instanceName
	const camera = getCameraFromFluidd(fluidd)

	return { name, camera }
})

const getCameraFromFluidd = (fluidd: any): any | undefined => {
	const fluiddCamera = fluidd?.cameras?.cameras[0]

	if (!fluiddCamera || !fluiddCamera.enabled) {
		return
	}

	const streamUrl = new URL(fluiddCamera.url, httpUrl)
	const camera = { ...fluiddCamera, streamUrl }

	if (streamUrl.searchParams.has("action")) {
		const adaptiveUrl = new URL(streamUrl)
		adaptiveUrl.searchParams.set("action", "snapshot")
		camera.adaptiveUrl = adaptiveUrl
	}

	return camera
}

const recentDataAtom = atom({})
export const recentAtom = atom(
	(get) => get(recentDataAtom),
	(_get, set, update: any) => {
		set(recentDataAtom, (recent) => ({
			...recent,
			...update,
		}))
	},
)

const gcodeHistoryDataAtom = atom<GcodeHistoryItem[]>([])
export const gcodeResponsesAtom = atom(
	(get) => get(gcodeHistoryDataAtom),
	(_get, set, update: GcodeHistoryItem) => {
		set(gcodeHistoryDataAtom, (responses) => [
			...responses,
			...processGcodeHistory([update]),
		])
	},
)
export const gcodeHistoryAtom = atom(
	null,
	(_get, set, update: GcodeHistoryItem[]) => {
		set(gcodeHistoryDataAtom, processGcodeHistory(update))
	},
)

const processGcodeHistory = (items: GcodeHistoryItem[]) =>
	items.map((item) => {
		const type = item.message.slice(0, 2) === "!!" ? "error" : item.type
		return { ...item, type }
	})

const adjusterReducer = (
	current: Adjuster | undefined,
	action: AdjusterAction,
): Adjuster | undefined => {
	if (action === "close") {
		return undefined
	}

	return current || action
}
export const adjusterAtom = atomWithReducer<
	Adjuster | undefined,
	AdjusterAction
>(undefined, adjusterReducer)
