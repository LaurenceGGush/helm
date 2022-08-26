import { useMemo } from "react"

import { selectAtom, useAtomValue } from "jotai/utils"

import { statusAtom } from "../store"
import { PrinterStatus } from "../store/types"
import useFileMeta from "./useFileMeta"
import { useFilename, usePrintingOrPaused } from "./usePrinterStatus"

const selectHeight = (status: PrinterStatus) =>
	status?.gcode_move?.gcode_position[2] || 0
const heightAtom = selectAtom(statusAtom, selectHeight)
const selectDuration = (status: PrinterStatus) =>
	status?.print_stats?.print_duration || 0
const durationAtom = selectAtom(statusAtom, selectDuration)
const selectProgress = (status: PrinterStatus) => {
	let progress = status?.virtual_sdcard?.progress || 0
	progress = Math.round(progress * 1000) / 1000

	return progress
}
const printStatsAtom = selectAtom(statusAtom, selectProgress)
const usePrintStats = () => {
	const printingOrPaused = usePrintingOrPaused()

	const print_height = useAtomValue(heightAtom)
	const print_duration = useAtomValue(durationAtom)
	const progress = useAtomValue(printStatsAtom)
	const filename = useFilename()

	const friendlyName = useMemo(
		() => filename?.replace(/\.gcode$/, ""),
		[filename],
	)

	const {
		object_height = 0,
		first_layer_height = 0,
		layer_height = 0,
		first_layer_bed_temp = 0,
		first_layer_extr_temp = 0,
		thumbnails,
	} = useFileMeta(filename)

	const thumb = thumbnails && thumbnails[1]

	const layers = useMemo(
		() =>
			Math.round((object_height - first_layer_height) / layer_height + 1),
		[first_layer_height, layer_height, object_height],
	)
	const layer = printingOrPaused
		? ((print_height - first_layer_height) / layer_height + 1).toFixed(0)
		: 0

	const elapsed = new Date(0)
	elapsed.setSeconds(print_duration)

	const remaining = useMemo(() => {
		const rem = new Date(0)
		if (progress) {
			rem.setSeconds((1 / progress) * print_duration - print_duration)
		}
		return rem
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [progress])

	return {
		filename,
		friendlyName,
		thumb,
		layers,
		layer,
		progress,
		object_height,
		print_height,
		elapsed,
		remaining,
		first_layer_bed_temp,
		first_layer_extr_temp,
	}
}

export default usePrintStats
