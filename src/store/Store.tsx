import { useEffect } from "react"

import { useAtom, useAtomValue, useSetAtom } from "jotai"

import {
	gcodeResponsesAtom,
	infoAtom,
	initialiseStatusAtom,
	printerAtom,
	refreshInfoAtom,
	statusAtom,
	statusObjects,
} from "../store"
import { logger } from "../utilities/logger"
import { PrinterStatus } from "./types"

const Store = () => {
	const printer = useAtomValue(printerAtom)

	const [info, updateInfo] = useAtom(infoAtom)
	const refreshInfo = useSetAtom(refreshInfoAtom)

	const updateStatus = useSetAtom(statusAtom)
	const initialiseStatus = useSetAtom(initialiseStatusAtom)

	const updateOutput = useSetAtom(gcodeResponsesAtom)

	useEffect(() => {
		let unsubKlippyReady: () => void,
			unsubKlippyDisconnect: () => void,
			unsubStatus: () => void,
			unsubGcodeResponses: () => void,
			unsubSocketClosed: () => void,
			unsubSocketOpening: () => void,
			unsubSocketOpened: () => void

		const asyncEffect = async () => {
			if (info?.state === "closed") {
				logger.info("closed", info)

				unsubSocketOpening = printer.subscribeSocketOpening(() =>
					updateInfo({
						hostname: info?.hostname,
						state_message: "Connecting...",
						state: "opening",
					}),
				)

				return
			}
			if (info?.state === "opening") {
				logger.info("closed", info)

				unsubSocketOpened = printer.subscribeSocketOpened(refreshInfo)

				return
			}

			if (info?.state !== "ready") {
				logger.info("not ready", info?.state, info)

				unsubKlippyReady = printer.subscribeKlippyReady(refreshInfo)

				unsubSocketClosed = printer.subscribeSocketClosed((reason) => {
					updateInfo({
						hostname: info?.hostname,
						state_message: `${reason}\nReconnecting...`,
						state: "closed",
					})
				})

				return
			}

			initialiseStatus()

			unsubStatus = printer.subscribeStatusUpdates(
				statusObjects,
				(status: PrinterStatus) => {
					if (
						status?.webhooks?.state &&
						status?.webhooks?.state !== "ready"
					) {
						updateInfo({
							hostname: info?.hostname,
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
					hostname: info?.hostname,
					state_message: "Klippy Disconnected!\nReconnecting...",
					state: "disconnected",
				})
			})
			unsubSocketClosed = printer.subscribeSocketClosed((reason) => {
				updateInfo({
					hostname: info?.hostname,
					state_message: reason,
					state: "closed",
				})
			})
		}
		asyncEffect()

		return () => {
			unsubStatus && unsubStatus()
			unsubGcodeResponses && unsubGcodeResponses()
			unsubKlippyReady && unsubKlippyReady()
			unsubKlippyDisconnect && unsubKlippyDisconnect()
			unsubSocketClosed && unsubSocketClosed()
			unsubSocketOpening && unsubSocketOpening()
			unsubSocketOpened && unsubSocketOpened()
		}
	}, [
		printer,
		info,
		updateStatus,
		updateOutput,
		refreshInfo,
		initialiseStatus,
		updateInfo,
	])

	logger.info("Store")

	return <></>
}

export default Store
