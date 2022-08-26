import { RequestError } from "../errors"
import type { FileMeta } from "../hooks/useFileMeta"
import { wsUrl } from "../settings"
import type {
	GcodeHistoryItem,
	PrinterInfo,
	PrinterStatus,
} from "../store/types"
import { logger } from "../utilities/logger"
import Connection from "./connection"
import methods from "./methods"

const handleError = (error: Error) => {
	if (error instanceof RequestError) {
		logger.error(error, error.data)
	} else {
		logger.error(error)
	}
}

async function moonraker(id: string) {
	const connection = Connection(`${wsUrl}${id ? `/${id}` : ""}`)

	try {
		await connection.open()
	} catch (error) {
		logger.error("Server Error: can't connect to moonraker")
	}

	return {
		open: connection.open,

		gcode(script: string) {
			connection
				.call(methods.gcode_script, {
					script: script.toLocaleUpperCase(),
				})
				.then(
					(result) => logger.info("gcode", script, result),
					handleError,
				)
		},

		gcodeHistory(): Promise<GcodeHistoryItem[]> {
			return connection
				.call(methods.gcode_store, {
					count: 100,
				})
				.then((result) => result.gcode_store || [])
		},

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		fluidd(): Promise<any> {
			return connection
				.call(methods.db_item_get, {
					namespace: "fluidd",
				})
				.then((result) => result.value)
		},

		recent(key?: string) {
			return connection
				.call(methods.db_item_get, {
					namespace: "helm",
					key: key ? `recent.${key}` : "recent",
				})
				.then((result) => result.value)
		},

		async setRecent(key: string, value: number) {
			const recent = await connection
				.call(methods.db_item_get, {
					namespace: "helm",
					key: `recent.${key}`,
				})
				.then(
					(result) => JSON.parse(result.value),
					(error) => logger.error(error),
				)

			if (recent.length > 100) {
				recent.pop()
			}
			recent.unshift(value)

			const updated = await connection.call(methods.db_item_post, {
				namespace: "helm",
				key: `recent.${key}`,
				value: JSON.stringify(recent),
			})

			return updated
		},

		serverInfo() {
			return connection.call(methods.server_info)
		},

		info(): Promise<PrinterInfo> {
			const info = connection.call(methods.printer_info)
			info.then((res) => logger.info("info", res))
			return info
		},

		objectList(): Promise<(keyof PrinterStatus)[]> {
			return connection
				.call(methods.object_list)
				.then((result) => result.objects)
		},

		status(objects: object): Promise<PrinterStatus> {
			return connection
				.call(methods.object_status, {
					objects,
				})
				.then((result) => result.status)
		},

		subscribeKlippyReady(callback: () => void) {
			return connection.subscribe(methods.notify_klippy_ready, callback)
		},
		subscribeKlippyDisconnected(callback: () => void) {
			return connection.subscribe(
				methods.notify_klippy_disconnected,
				callback,
			)
		},
		subscribeSocketClosed(callback: (reason: string) => void) {
			return connection.subscribe("socketClosed", callback)
		},
		subscribeSocketOpening(callback: () => void) {
			return connection.subscribe("socketOpening", callback)
		},
		subscribeSocketOpened(callback: () => void) {
			return connection.subscribe("socketOpened", callback)
		},

		subscribeStatusUpdates(
			objects: object,
			callback: (newStatus: PrinterStatus) => void,
		) {
			connection.call(methods.object_subscription, {
				objects,
			})
			return connection.subscribe(
				methods.notify_status_update,
				(newStatus: PrinterStatus[]) => callback(newStatus[0]),
			)
		},

		subscribeGcodeResponse(callback: (message: string[]) => void) {
			return connection.subscribe(methods.notify_gcode_response, callback)
		},

		restart() {
			connection
				.call(methods.restart)
				.then((res) => logger.info("restart", res))
		},
		reallyRestart() {
			connection
				.call(methods.firmware_restart)
				.then((res) => logger.info("really restart", res))
		},
		reboot() {
			connection
				.call(methods.reboot)
				.then((res) => logger.info("reboot", res))
		},
		shutdown() {
			connection
				.call(methods.shutdown)
				.then((res) => logger.info("shutdown", res))
		},
		estop() {
			connection
				.call(methods.estop)
				.then((res) => logger.info("emergency!!!!", res))
		},

		queryEndstops() {
			return connection.call(methods.query_endstops).then((result) => {
				logger.info("endstops", result)
				return result
			})
		},

		start(filename: string) {
			connection
				.call(methods.start_print, {
					filename,
				})
				.then((res) => logger.info("start", res))
		},
		pause() {
			connection
				.call(methods.pause_print)
				.then((res) => logger.info("pause", res))
		},
		resume() {
			connection
				.call(methods.resume_print)
				.then((res) => logger.info("resume", res))
		},
		cancel() {
			connection
				.call(methods.cancel_print)
				.then((res) => logger.info("cancel", res))
		},

		subscribeGcodesUpdates(callback: () => void) {
			return connection.subscribe(
				methods.notify_filelist_changed,
				callback,
			)
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		listGcodes(): Promise<any[]> {
			return connection.call(methods.file_list)
		},
		fileMeta(filename: string): Promise<FileMeta> {
			return connection.call(methods.metadata, {
				filename,
			})
		},

		loadGcode(filename: string) {
			connection
				.call(methods.gcode_script, {
					script: `M23 ${filename}`,
				})
				.then((res) => logger.info("loaded gcode", res))
		},
		unLoadGcode() {
			connection
				.call(methods.gcode_script, {
					script: `SDCARD_RESET_FILE`,
				})
				.then((res) => logger.info("unloaded gcode", res))
		},

		tram() {
			connection
				.call(methods.gcode_script, {
					script: `Z_TILT_ADJUST`,
				})
				.then((res) => logger.info("Tram", res))
		},

		extruder(extruder: string) {
			const ext = parseInt(extruder, 10)
				? `extruder${extruder}`
				: "extruder"

			connection
				.call(methods.gcode_script, {
					script: `activate_extruder extruder=${ext}`,
				})
				.then((res) => logger.info(`E${extruder}`, res))
		},

		tool(tool: string) {
			connection
				.call(methods.gcode_script, {
					script: `T${tool}`,
				})
				.then((res) => logger.info(`T${tool}`, res))
		},
		dropOffTool() {
			connection
				.call(methods.gcode_script, {
					script: `TOOL_DROPOFF`,
				})
				.then((res) => logger.info("drop off", res))
		},

		moveBy(distance: number | string, axis: string) {
			connection
				.call(methods.gcode_script, {
					script: `MOVE_BY A=${axis} D=${distance}`,
				})
				.then((res) => logger.info(`${axis} ${distance}`, res))
		},

		adjustOffset(distance: number, axis: string) {
			connection
				.call(methods.gcode_script, {
					script: `SET_GCODE_OFFSET ${axis}_ADJUST=${distance} MOVE=1`,
				})
				.then((res) =>
					logger.info(`gcode offset ${axis} ${distance}`, res),
				)
		},

		extrude(distance: number, feed: number) {
			connection
				.call(methods.gcode_script, {
					script: `MOVE_BY A=E D=${distance} F=${feed * 60}`,
				})
				.then((res) => logger.info(`E ${distance}`, res))
		},

		nozzleScrub() {
			connection
				.call(methods.gcode_script, {
					script: `NOZZLE_SCRUB`,
				})
				.then((res) => logger.info("scrub", res))
		},

		turnOffMotors() {
			connection
				.call(methods.gcode_script, {
					script: `M84`,
				})
				.then((res) => logger.info("turn off motors", res))
		},
	}
}

export default moonraker
