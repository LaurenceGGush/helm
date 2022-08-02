/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, ReactNode, useEffect, useState } from "react"

import { useSetAtom } from "jotai"
import { RESET } from "jotai/utils"
import { useUpdateAtom } from "jotai/utils"

import { Moonraker } from "../moonraker/moonraker"
import {
	fluiddAtom,
	gcodeHistoryAtom,
	gcodeResponsesAtom,
	infoAtom,
	printerAtom,
	recentAtom,
	statusAtom,
} from "../store"
import { GcodeHistoryItem, PrinterInfo, PrinterStatus } from "../store/types"
import { logger } from "../utilities/logger"
import noopObj from "../utilities/noopProxy"
import {
	baseFluidd,
	baseRecent,
	fileMeta,
	gcodes,
	gcodeStore,
	randomEndstops,
	zTiltOutput,
} from "./mockdata"

export const baseMockPrinter = {
	fileMeta: () => fileMeta,
	listGcodes: () => gcodes,
	queryEndstops: () => Promise.resolve(randomEndstops()),
}

interface MockStoreProps {
	printer?: Moonraker
	info?: PrinterInfo
	status?: PrinterStatus
	fluidd?: any
	recent?: any
	children?: ReactNode
}
export const MockStore: FC<MockStoreProps> = ({
	children,
	printer,
	info,
	status,
	fluidd = baseFluidd,
	recent = baseRecent,
}) => {
	const setPrinter = useUpdateAtom(printerAtom)
	const setInfo = useUpdateAtom(infoAtom)
	const setStatus = useUpdateAtom(statusAtom)
	const setFluidd = useUpdateAtom(fluiddAtom)
	const setRecent = useUpdateAtom(recentAtom)
	const setGcodeHistory = useUpdateAtom(gcodeHistoryAtom)

	const [stateUpdated, setStateUpdated] = useState(false)

	const runInit = useInit()

	if (!printer) {
		printer = noopObj({
			...baseMockPrinter,
			init: runInit,
		}) as Moonraker
	}

	// logger.log("mS", status)

	useEffect(() => {
		if (stateUpdated) return

		setPrinter(() => printer)
		setFluidd(() => fluidd)
		setRecent(() => recent)
		setGcodeHistory(gcodeStore)
		info && setInfo(() => info)
		status && setStatus(status)
		setStateUpdated(true)
	}, [
		setPrinter,
		setInfo,
		setStatus,
		info,
		status,
		printer,
		setFluidd,
		fluidd,
		setGcodeHistory,
		stateUpdated,
		setRecent,
		recent,
	])

	if (!stateUpdated) {
		logger.warn("nothing")
		return <></>
	}

	return <>{children}</>
}

interface UpdateStoreProps {
	printer?: Moonraker
	info?: PrinterInfo
	status?: PrinterStatus | typeof RESET
	fluidd?: any
	children?: ReactNode
}
export const UpdateStore: FC<UpdateStoreProps> = ({
	printer,
	children,
	info,
	status,
	fluidd,
}) => {
	const setPrinter = useUpdateAtom(printerAtom)
	const setInfo = useUpdateAtom(infoAtom)
	const setStatus = useUpdateAtom(statusAtom)
	const setFluidd = useUpdateAtom(fluiddAtom)
	const setGcodeHistory = useUpdateAtom(gcodeHistoryAtom)

	const [stateUpdated, setStateUpdated] = useState(false)

	useEffect(() => {
		printer && setPrinter(() => printer)
		fluidd && setFluidd(() => fluidd)
		info && setInfo(() => info)
		status && setStatus(status)
		setStateUpdated(true)
	}, [
		setInfo,
		setStatus,
		info,
		status,
		setFluidd,
		fluidd,
		setGcodeHistory,
		stateUpdated,
		printer,
		setPrinter,
	])

	if (!stateUpdated) {
		return <></>
	}

	return <>{children}</>
}

export const useInit = () => {
	const updateOutput = useSetAtom(gcodeResponsesAtom)

	return () => {
		updateOutput({
			message: "INIT",
			time: 1652535017.0145817,
			type: "command",
		})

		outputZTilt(structuredClone(zTiltOutput), updateOutput)
	}
}

function outputZTilt(
	outputs: GcodeHistoryItem[],
	update: (output: GcodeHistoryItem) => void,
) {
	const output = outputs.shift()
	if (output) {
		update(output)

		setTimeout(() => {
			outputZTilt(outputs, update)
		}, 500)
	}
}
