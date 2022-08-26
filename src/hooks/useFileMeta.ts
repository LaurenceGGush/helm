import { useAsyncMemo } from "use-async-memo"

import usePrinter from "./usePrinter"

interface Thumbnail {
	width: number
	height: number
	size: number
	data?: string
	relative_path: string
}
export interface FileMeta {
	filename?: string
	size?: number
	modified?: string
	slicer?: string
	slicer_version?: string
	first_layer_height?: number
	first_layer_bed_temp?: number
	first_layer_extr_temp?: number
	layer_height?: number
	object_height?: number
	estimated_time?: number
	filament_total?: number

	thumbnails?: Thumbnail[]
}

const useFileMeta = (filename?: string): FileMeta => {
	const printer = usePrinter()

	const metadata = useAsyncMemo<FileMeta>(
		async () => {
			if (!filename) {
				return {}
			}

			const result = await printer.fileMeta(filename)

			// fudge thumbnail sizes as cura small thumbs are too small
			if (
				result?.thumbnails?.length &&
				result.thumbnails[0].width < 100
			) {
				result.thumbnails[0] = result.thumbnails[1]
			}

			return result
		},
		[printer, filename],
		{},
	)

	return metadata
}

export default useFileMeta
