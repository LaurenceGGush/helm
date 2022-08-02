import { useEffect } from "react"

import { useAtom, useSetAtom } from "jotai"

import moonraker from "../moonraker"
import { logger } from "../utilities/logger"
import {
	fluiddAtom,
	gcodeHistoryAtom,
	gcodeResponsesAtom,
	infoAtom,
	printerAtom,
	statusAtom,
} from "."
import { PrinterStatus } from "./types"

const objects = {
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
	"gcode_macro INIT": null,
	"gcode_macro DOCK_INIT": ["tool_number"],
	"gcode_macro NOZZLE_SCRUB": null,
	"gcode_macro LEDS": null,
}

const Store = () => {
	const [printer, setPrinter] = useAtom(printerAtom)

	const [info, updateInfo] = useAtom(infoAtom)
	const updateFluidd = useSetAtom(fluiddAtom)
	const updateGcodeHistory = useSetAtom(gcodeHistoryAtom)
	const updateStatus = useSetAtom(statusAtom)
	const updateOutput = useSetAtom(gcodeResponsesAtom)

	useEffect(() => {
		let unsubKlippyReady: () => void,
			unsubKlippyDisconnect: () => void,
			unsubStatus: () => void,
			unsubGcodeResponses: () => void,
			unsubSocketClosed: () => void,
			unsubSocketOpened: () => void

		const asyncEffect = async () => {
			if (!printer) {
				const printer = await moonraker()
				printer.fluidd().then(updateFluidd)
				printer.gcodeHistory().then(updateGcodeHistory)

				let info = await printer.info()
				if (!info) {
					info = {
						state: "unknown",
					}
				}

				setPrinter(printer)
				updateInfo(info)

				logger.info("no printer", { info })

				return
			}

			if (info?.state === "closed") {
				unsubSocketOpened = printer.subscribeSocketOpened(async () => {
					updateInfo(await printer.info())
				})

				logger.info("closed", info)
				return
			}

			if (info?.state === "unknown") {
				setTimeout(async () => {
					const uinfo = await printer.info()

					logger.info("update info", uinfo)

					updateInfo(
						uinfo || {
							...info,
							state_message: info.state_message + ".",
						},
					)
				}, 1000)

				return
			}

			if (info?.state !== "ready") {
				unsubKlippyReady = printer.subscribeKlippyReady(async () => {
					updateInfo(await printer.info())
				})

				logger.info("not ready", info?.state, info)
			}

			updateStatus(await printer.status(objects))

			unsubStatus = printer.subscribeStatusUpdates(
				objects,
				(status: PrinterStatus) => {
					if (
						status?.webhooks?.state &&
						status?.webhooks?.state !== "ready"
					) {
						updateInfo({
							...info,
							state: status.webhooks.state,
							state_message: status.webhooks.state_message,
						})
					}

					updateStatus(status)
				},
			)
			unsubGcodeResponses = printer.subscribeGcodeResponse((message) => {
				updateOutput({
					message: message[0],
					type: "response",
					time: Date.now(),
				})
			})
			unsubKlippyDisconnect = printer.subscribeKlippyDisconnected(() => {
				updateInfo({
					hostname: info.hostname,
					state_message: "Klippy Disconnected!\nReconnecting...",
					state: "unknown",
				})
			})
			unsubSocketClosed = printer.subscribeSocketClosed(() => {
				updateInfo({
					hostname: info.hostname,
					state_message: "Socket closed!\nReconnecting...",
					state: "closed",
				})
			})
		}
		asyncEffect()

		return () => {
			if (unsubStatus) {
				unsubStatus()
			}
			if (unsubGcodeResponses) {
				unsubGcodeResponses()
			}
			if (unsubKlippyReady) {
				unsubKlippyReady()
			}
			if (unsubKlippyDisconnect) {
				unsubKlippyDisconnect()
			}
			if (unsubSocketClosed) {
				unsubSocketClosed()
			}
			if (unsubSocketOpened) {
				unsubSocketOpened()
			}
		}
	}, [
		printer,
		setPrinter,
		info,
		updateInfo,
		updateStatus,
		updateFluidd,
		updateGcodeHistory,
		updateOutput,
	])

	logger.info("Store")

	return <></>
}

export default Store
