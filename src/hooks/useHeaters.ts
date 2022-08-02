import { useMemo } from "react"

import { selectAtom, useAtomValue } from "jotai/utils"

import { statusAtom } from "../store"
import { Heater, PrinterStatus } from "../store/types"

interface IdHeater extends Heater {
	id: string
}

const selectHeaters = (status: PrinterStatus) => {
	const heaters = []

	for (const heater of status.heaters?.available_heaters || []) {
		heaters.push({
			...status[heater],
			temperature: toOneDP(status[heater]?.temperature || 0),
			id: heater,
		} as IdHeater)
	}

	return heaters
}
const equalHeaters = (next: Array<IdHeater>, prev: Array<IdHeater>) => {
	if (next?.length !== prev?.length) {
		return false
	}

	for (const nextHeater of next) {
		const prevHeater = prev.find((heater) => heater.id === nextHeater.id)

		if (!prevHeater) {
			return false
		}

		if (nextHeater.target !== prevHeater.target) {
			return false
		}

		if (
			nextHeater.temperature > prevHeater.temperature + 0.2 ||
			nextHeater.temperature < prevHeater.temperature - 0.2
		) {
			return false
		}
	}

	return true
}
const heatersAtom = selectAtom(statusAtom, selectHeaters, equalHeaters)

const useHeaters = () => {
	const heaters = useAtomValue(heatersAtom)

	const groupedHeaters = useMemo(() => {
		const extruders = []
		const beds = []
		const generics = []

		for (const heater of heaters) {
			if (heater.id.match(/^extruder/)) {
				extruders.push(heater)
			} else if (heater.id.match(/^heater_bed/)) {
				beds.push(heater)
			} else {
				generics.push(heater)
			}
		}

		// logger.info("heaters", extruders, beds, generics)

		return { extruders, beds, generics }
	}, [heaters])

	return groupedHeaters
}

const toOneDP = (num: number) => {
	return Math.round(num * 10) / 10
}

export default useHeaters

const selectMultiExtruder = (status: PrinterStatus) => {
	const extruders = status.heaters?.available_heaters?.filter((heater) =>
		heater.match(/^extruder/),
	)

	return !!extruders && extruders.length > 1
}
const multiExtruderAtom = selectAtom(statusAtom, selectMultiExtruder)

export const useMultiExtruder = () => useAtomValue(multiExtruderAtom)

const selectNumExtruders = (status: PrinterStatus) => {
	const extruders = status.heaters?.available_heaters?.filter((heater) =>
		heater.match(/^extruder/),
	)

	return extruders?.length || 0
}
const numExtrudersAtom = selectAtom(statusAtom, selectNumExtruders)

export const useNumExtruders = () => useAtomValue(numExtrudersAtom)
