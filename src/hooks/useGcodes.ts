import { useEffect, useState } from "react"

import { useAsyncMemo } from "use-async-memo"

import usePrinter from "./usePrinter"

const sortByDate: (
	a: { modified: number },
	b: { modified: number },
) => number = (a, b) => b.modified - a.modified

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const processGcodes = (gcodes: any[]): GcodeFile[] => {
	return gcodes.map((gcode) => {
		const name = gcode.path.replace(/\.gcode$/, "")
		const modified = new Date(gcode.modified * 1000)

		return {
			...gcode,
			name,
			modified,
		}
	})
}

export interface GcodeFile {
	path: string
	modified: Date
	size: number
	name: string
}

const useGcodes = (): GcodeFile[] => {
	const printer = usePrinter()
	const [now, setNow] = useState(new Date())

	useEffect(() => {
		const unsub = printer.subscribeGcodesUpdates(() => setNow(new Date()))

		return unsub
	}, [printer])

	const gcodes = useAsyncMemo(
		async () => {
			const result = await printer.listGcodes()
			const sorted = result?.sort(sortByDate)
			const processed = processGcodes(sorted.slice(0, 10))

			return processed
		},
		[printer, now],
		[],
	)

	return gcodes
}

export default useGcodes
