/* eslint-disable @typescript-eslint/no-explicit-any */

import { RequestError } from "../errors"
import type { FileMeta } from "../hooks/useFileMeta"
import { wsUrl } from "../settings"
import type { PrinterInfo, PrinterStatus } from "../store/types"
import { logger } from "../utilities/logger"
import Connection from "./connection"
import methods from "./definitions"

const handleError = (error: Error) => {
	if (error instanceof RequestError) {
		logger.error(error, error.data)
	} else {
		logger.error(error)
	}
}

async function moonraker() {
	const connection = await Connection(wsUrl)
	// logger.info("socket", socket)

	return {
		gcode(script: string) {
			connection
				.request(methods.gcode_script.method, { script })
				.then((result) => logger.info("gcode", result), handleError)
		},

		gcodeHistory() {
			return connection
				.request(methods.gcode_store.method, {
					count: 100,
				})
				.then(
					(result: any) => result.gcode_store || [],
					(error) => logger.error(error),
				)
		},

		fluidd(): Promise<PrinterInfo> {
			return connection
				.request(methods.db_item.method.get, {
					namespace: "fluidd",
				})
				.then(
					(result: any) => result.value,
					(error) => logger.error(error),
				)
		},

		recent(key?: string) {
			return connection
				.request(methods.db_item.method.get, {
					namespace: "helm",
					key: key ? `recent.${key}` : "recent",
				})
				.then(
					(result: any) => result.value,
					(error) => logger.error(error),
				)
		},

		async setRecent(key: string, value: number) {
			const recent = await connection
				.request(methods.db_item.method.get, {
					namespace: "helm",
					key: `recent.${key}`,
				})
				.then(
					(result: any) => JSON.parse(result.value),
					(error) => logger.error(error),
				)

			if (recent.length > 100) {
				recent.pop()
			}
			recent.unshift(value)

			const updated = await connection.request(
				methods.db_item.method.post,
				{
					namespace: "helm",
					key: `recent.${key}`,
					value: JSON.stringify(recent),
				},
			)

			return updated
		},

		info(): Promise<PrinterInfo> {
			return connection.request(methods.printer_info.method).then(
				(result: any) => result,
				(error) => logger.error(error),
			)
		},

		status(objects: object) {
			return connection
				.request(methods.object_status.method, {
					objects,
				})
				.then(
					(result: any) => result.status,
					(error) => logger.error(error),
				)
		},

		subscribeKlippyReady(callback: () => void) {
			connection.subscribe(methods.notify_klippy_ready.method, callback)

			return () =>
				connection.unsubscribe(methods.notify_klippy_ready.method)
		},
		subscribeKlippyDisconnected(callback: () => void) {
			connection.subscribe(
				methods.notify_klippy_disconnected.method,
				callback,
			)

			return () =>
				connection.unsubscribe(
					methods.notify_klippy_disconnected.method,
				)
		},
		subscribeSocketClosed(callback: () => void) {
			connection.subscribe("socketClosed", callback)

			return () => connection.unsubscribe("socketClosed")
		},
		subscribeSocketOpened(callback: () => void) {
			connection.subscribe("socketOpened", callback)

			return () => connection.unsubscribe("socketOpened")
		},

		subscribeStatusUpdates(
			objects: object,
			callback: (newStatus: PrinterStatus) => void,
		) {
			connection.request(methods.object_subscription.method, {
				objects,
			})
			connection.subscribe(
				methods.notify_status.method,
				(newStatus: PrinterStatus[]) => callback(newStatus[0]),
			)

			return () => connection.unsubscribe(methods.notify_status.method)
		},

		subscribeGcodeResponse(callback: (message: string[]) => void) {
			connection.subscribe(methods.notify_gcode.method, callback)
			return () => connection.unsubscribe(methods.notify_gcode.method)
		},

		restart() {
			connection
				.request(methods.restart.method)
				.then((res) => logger.info("restart", res))
		},
		reallyRestart() {
			connection
				.request(methods.firmware_restart.method)
				.then((res) => logger.info("really restart", res))
		},
		reboot() {
			connection
				.request(methods.reboot.method)
				.then((res) => logger.info("reboot", res))
		},
		shutdown() {
			connection
				.request(methods.shutdown.method)
				.then((res) => logger.info("shutdown", res))
		},
		estop() {
			connection
				.request(methods.estop.method)
				.then((res) => logger.info("emergency!!!!", res))
		},

		queryEndstops() {
			return connection
				.request(methods.query_endstops.method)
				.then((result) => {
					logger.info("endstops", result)
					return result
				})
		},

		start(filename: string) {
			connection
				.request(methods.start_print.method, {
					filename,
				})
				.then((res) => logger.info("start", res))
		},
		pause() {
			connection
				.request(methods.pause_print.method)
				.then((res) => logger.info("pause", res))
		},
		resume() {
			connection
				.request(methods.resume_print.method)
				.then((res) => logger.info("resume", res))
		},
		cancel() {
			connection
				.request(methods.cancel_print.method)
				.then((res) => logger.info("cancel", res))
		},

		subscribeGcodesUpdates(callback: () => void) {
			connection.subscribe(methods.notify_filelist.method, callback)

			return () => connection.unsubscribe(methods.notify_filelist.method)
		},
		listGcodes(): Promise<any[]> {
			return connection.request(methods.file_list.method)
		},
		fileMeta(filename: string): Promise<FileMeta> {
			return connection.request(methods.metadata.method, {
				filename,
			})
		},

		loadGcode(filename: string) {
			connection
				.request(methods.gcode_script.method, {
					script: `M23 ${filename}`,
				})
				.then((res) => logger.info("loaded gcode", res))
		},
		unLoadGcode() {
			connection
				.request(methods.gcode_script.method, {
					script: `SDCARD_RESET_FILE`,
				})
				.then((res) => logger.info("unloaded gcode", res))
		},

		init() {
			connection
				.request(methods.gcode_script.method, {
					script: `INIT`,
				})
				.then((res) => logger.info("INIT", res))
		},
		home() {
			connection
				.request(methods.gcode_script.method, {
					script: `G28`,
				})
				.then((res) => logger.info("HOME", res))
		},
		tram() {
			connection
				.request(methods.gcode_script.method, {
					script: `Z_TILT_ADJUST`,
				})
				.then((res) => logger.info("Tram", res))
		},

		extruder(extruder: string) {
			const ext = parseInt(extruder, 10)
				? `extruder${extruder}`
				: "extruder"

			connection
				.request(methods.gcode_script.method, {
					script: `activate_extruder extruder=${ext}`,
				})
				.then((res) => logger.info(`E${extruder}`, res))
		},

		tool(tool: string) {
			connection
				.request(methods.gcode_script.method, {
					script: `T${tool}`,
				})
				.then((res) => logger.info(`T${tool}`, res))
		},
		dropOffTool() {
			connection
				.request(methods.gcode_script.method, {
					script: `TOOL_DROPOFF`,
				})
				.then((res) => logger.info("drop off", res))
		},

		moveBy(distance: number | string, axis: string) {
			connection
				.request(methods.gcode_script.method, {
					script: `MOVE_BY A=${axis} D=${distance}`,
				})
				.then((res) => logger.info(`${axis} ${distance}`, res))
		},

		adjustOffset(distance: number, axis: string) {
			connection
				.request(methods.gcode_script.method, {
					script: `SET_GCODE_OFFSET ${axis}_ADJUST=${distance} MOVE=1`,
				})
				.then((res) =>
					logger.info(`gcode offset ${axis} ${distance}`, res),
				)
		},

		extrude(distance: number, feed: number) {
			connection
				.request(methods.gcode_script.method, {
					script: `MOVE_BY A=E D=${distance} F=${feed * 60}`,
				})
				.then((res) => logger.info(`E ${distance}`, res))
		},

		nozzleScrub() {
			connection
				.request(methods.gcode_script.method, {
					script: `NOZZLE_SCRUB`,
				})
				.then((res) => logger.info("scrub", res))
		},

		turnOffMotors() {
			connection
				.request(methods.gcode_script.method, {
					script: `M84`,
				})
				.then((res) => logger.info("turn off motors", res))
		},
	}
}

export default moonraker
