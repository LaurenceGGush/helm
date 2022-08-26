import { useSetAtom } from "jotai"

import { gcodeResponsesAtom } from "../store"
import usePrinter from "./usePrinter"

export const useSendGcode = () => {
	const printer = usePrinter()
	const updateOutput = useSetAtom(gcodeResponsesAtom)

	return (command: string) => {
		printer.gcode(command.toLocaleUpperCase())

		updateOutput({
			message: command.toLocaleUpperCase(),
			type: "command",
			time: Date.now(),
		})
	}
}

export const useExtruderTemperature = () => {
	const sendGcode = useSendGcode()
	return (temperature = 0, extruder = 0) =>
		sendGcode(`M104 T${extruder} S${temperature}`)
}
export const useBedTemperature = () => {
	const sendGcode = useSendGcode()
	return (temperature = 0) => sendGcode(`M140 S${temperature}`)
}
export const useFeedRate = () => {
	const sendGcode = useSendGcode()
	return (rate = 100) => sendGcode(`M220 S${rate}`)
}
export const useFlowRate = () => {
	const sendGcode = useSendGcode()
	return (rate = 100) => sendGcode(`M221 S${rate}`)
}
export const useFanSpeed = () => {
	const sendGcode = useSendGcode()
	return (speed = 0) => sendGcode(`M106 S${Math.round(speed * 2.55)}`)
}
export const useLeds = () => {
	const sendGcode = useSendGcode()
	return () => sendGcode(`LEDS`)
}
