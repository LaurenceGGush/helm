import equal from "fast-deep-equal"
import { useAtom } from "jotai"
import { selectAtom, useAtomValue } from "jotai/utils"

import { statusAtom } from "../store"
import type { PrinterStatus } from "../store/types"

const usePrinterStatus = () => useAtom(statusAtom)[0]
export default usePrinterStatus

const selectPrintingState = (status: PrinterStatus) => {
	const state = status?.print_stats?.state

	return {
		printing: state === "printing",
		paused: state === "paused",
		printingOrPaused: state === "printing" || state === "paused",
	}
}
const printingOrPausedAtom = selectAtom(statusAtom, selectPrintingState, equal)
export const usePrintingOrPaused = () => useAtomValue(printingOrPausedAtom)

const selectSpeedsAndFeeds = (status: PrinterStatus) => ({
	speed_factor: status?.gcode_move?.speed_factor,
	extrude_factor: status?.gcode_move?.extrude_factor,
	fan_speed: status?.fan?.speed || 0,
})
const speedAndFeedsAtom = selectAtom(statusAtom, selectSpeedsAndFeeds, equal)
export const useSpeedsAndFeeds = () => useAtomValue(speedAndFeedsAtom)

const selectActiveExtruder = (status: PrinterStatus) =>
	parseInt(status?.toolhead?.extruder?.replace("extruder", "") || "0", 10)
const activeExtruderAtom = selectAtom(statusAtom, selectActiveExtruder)
export const useActiveExtruder = () => useAtomValue(activeExtruderAtom)

const selectCanExtrude = (status: PrinterStatus) => {
	const activeExtruder = status?.toolhead?.extruder
	if (!activeExtruder) return false

	return status[activeExtruder]?.can_extrude
}
const canExtrudeAtom = selectAtom(statusAtom, selectCanExtrude)
export const useCanExtrude = () => useAtomValue(canExtrudeAtom)

const selectSelectedTool = (status: PrinterStatus) => {
	const tool = status.dock?.tool_number
	return tool ? parseInt(tool, 10) - 1 : undefined
}
const selectedToolAtom = selectAtom(statusAtom, selectSelectedTool)
export const useSelectedTool = () => useAtomValue(selectedToolAtom)

const selectPrintFilename = (status: PrinterStatus) =>
	status?.print_stats?.filename
const filenameAtom = selectAtom(statusAtom, selectPrintFilename)
export const useFilename = () => useAtomValue(filenameAtom)

const selectHomingOrigin = (status: PrinterStatus) =>
	status?.gcode_move?.homing_origin || [0, 0, 0, 0]
const gcodeOffsetsAtom = selectAtom(statusAtom, selectHomingOrigin)
export const useGcodeOffsets = () => useAtomValue(gcodeOffsetsAtom)

const selectHomed = (status: PrinterStatus) => {
	const homed = status?.toolhead?.homed_axes?.split("")

	return {
		x: homed?.includes("x"),
		y: homed?.includes("y"),
		z: homed?.includes("z"),
	}
}
const homedAtom = selectAtom(statusAtom, selectHomed, equal)
export const useHomed = () => useAtomValue(homedAtom)

const selectAvailableMacros = (status: PrinterStatus) => {
	const macros = Object.fromEntries(
		Object.keys(status)
			.map((key) => {
				const splitkey = key.split(" ")

				if (splitkey[0] === "gcode_macro") {
					return splitkey[1]
				}

				return ""
			})
			.filter((f) => f)
			.map((macro) => [macro.toLowerCase(), true]),
	)

	// logger.log("m", macros)

	return macros
}
const availableMacrosAtom = selectAtom(statusAtom, selectAvailableMacros, equal)
export const useAvailableMacros = () => useAtomValue(availableMacrosAtom)

const selectEndstops = (status: PrinterStatus) => {
	const endstops = Object.keys(status.query_endstops?.last_query || {})
		.map((key) => {
			const splitkey = key.split(" ")

			if (splitkey[0] === "manual_stepper") {
				return splitkey[1]
			}

			return key
		})
		.sort((a, b) => a.localeCompare(b))
		.map((endstop) => endstop.toLowerCase())

	return endstops
}
const endstopsAtom = selectAtom(statusAtom, selectEndstops, equal)
export const useEndstops = () => useAtomValue(endstopsAtom)
