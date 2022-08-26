/* eslint-disable @typescript-eslint/no-explicit-any */
import merge from "deepmerge"
import { atom } from "jotai"
import { atomWithReducer, atomWithStorage, RESET } from "jotai/utils"

import { homingMacrosAtom } from "../hooks/useMacros"
import { httpUrl } from "../settings"
import { fluiddAtom, gcodeHistoryServerDataAtom, printerAtom } from "."
import {
	Adjuster,
	AdjusterAction,
	GcodeHistoryItem,
	HomeIs,
	PrinterStatus,
	ServerSettings,
} from "./types"

export const statusObjects = {
	gcode_move: [
		"gcode_position",
		"homing_origin",
		"speed_factor",
		"extrude_factor",
	],
	toolhead: ["extruder", "homed_axes"],
	extruder: null,
	extruder1: null,
	extruder2: null,
	extruder3: null,
	heater_bed: null,
	heaters: ["available_heaters"],
	fan: ["speed"],
	virtual_sdcard: ["is_active", "progress"],
	print_stats: ["print_duration", "filename", "state"],
	display_status: ["progress"],
	idle_timeout: null,
	webhooks: null,
	query_endstops: null,
	"gcode_macro DOCK_INIT": ["tool_number"],
}

const statusDataAtom = atom<PrinterStatus>({})
export const statusAtom = atom(
	(get) => get(statusDataAtom),
	(_get, set, update: Partial<PrinterStatus> | typeof RESET) => {
		// logger.info("update", update)

		if (!update) return

		if (update == RESET) {
			set(statusDataAtom, {})
			return
		}

		if (update["gcode_macro DOCK_INIT"]) {
			update.dock = update["gcode_macro DOCK_INIT"]
			delete update["gcode_macro DOCK_INIT"]
		}

		set(
			statusDataAtom,
			(status) =>
				merge.all([status, update], {
					arrayMerge: (_, sourceArray) => sourceArray,
				}) as PrinterStatus,
		)
	},
)

export const initialiseStatusAtom = atom(
	(get) => {
		get(printerAtom)
		const status = get(statusAtom)

		return !!status?.dock
	},
	async (get, set) => {
		const printer = get(printerAtom)
		const status = get(statusDataAtom)

		if (status.dock) return

		const newStatus = await printer.status(statusObjects)

		set(statusDataAtom, newStatus)
	},
)

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
	(get) => {
		const serverResponses = get(gcodeHistoryServerDataAtom) || []
		const responses = get(gcodeHistoryDataAtom)

		return [...serverResponses, ...responses]
	},
	(_get, set, update: GcodeHistoryItem) => {
		set(gcodeHistoryDataAtom, (responses: GcodeHistoryItem[]) => [
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

export const homeIsDataAtom = atomWithStorage<HomeIs>("homeIs", "G28")
export const homeIsAtom = atom(
	(get) => {
		const homingMacros = get(homingMacrosAtom)
		const storedHome = get(homeIsDataAtom)

		if (homingMacros.includes(storedHome)) {
			return storedHome
		}

		return "G28"
	},
	(_, set, update: HomeIs) => set(homeIsDataAtom, update),
)

export const usableMacrosAtom = atomWithStorage<string[]>("macros", [])
