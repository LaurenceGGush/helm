import equal from "fast-deep-equal"
import { useAtom } from "jotai"
import { selectAtom, useAtomValue } from "jotai/utils"

import { objectsAtom, usableMacrosAtom } from "../store"
import { HomeIs, PrinterStatus } from "../store/types"

const selectAvailableMacros = (objects: (keyof PrinterStatus)[]) => {
	const macros = Object.fromEntries(
		objects
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
const availableMacrosAtom = selectAtom(
	objectsAtom,
	selectAvailableMacros,
	equal,
)
export const useAvailableMacros = () => useAtomValue(availableMacrosAtom)

export const useUseableMacros = () => useAtom(usableMacrosAtom)

export const homePrefixes = ["home", "init"] as const
const selectHomingMacros = (macros: { [k: string]: boolean }) => {
	const homingMacros = Object.keys(macros).filter((macro) => {
		const splitMacro = macro.split("_")
		const macroPrefix =
			splitMacro[0] as unknown as typeof homePrefixes[number]

		return homePrefixes.includes(macroPrefix)
	})
	homingMacros.unshift("G28")

	return homingMacros as HomeIs[]
}
export const homingMacrosAtom = selectAtom(
	availableMacrosAtom,
	selectHomingMacros,
)
export const useHomingMacros = () => useAtomValue(homingMacrosAtom)
