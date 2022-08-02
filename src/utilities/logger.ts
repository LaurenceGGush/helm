/* eslint-disable @typescript-eslint/no-explicit-any */
import { LOG_LEVEL } from "../environment"

/** Log levels */
export type LogLevel = "log" | "warn" | "error"

/** Signature of a logging function */
export interface LogFn {
	(message?: any, ...optionalParams: any[]): void
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop: LogFn = () => {}

/** Basic logger interface */
export interface Logger {
	log: LogFn
	info: LogFn
	warn: LogFn
	error: LogFn
}

/** Logger which outputs to the browser console */
class ConsoleLogger implements Logger {
	readonly log: LogFn = console.log.bind(console)
	readonly info: LogFn = console.info.bind(console)
	readonly warn: LogFn = console.warn.bind(console)
	readonly error: LogFn = console.error.bind(console)

	constructor(options?: { level?: LogLevel }) {
		const { level } = options || {}

		if (level === "error") {
			this.warn = noop
			this.info = noop
			this.log = noop

			return
		}

		if (level === "warn") {
			this.info = noop
			this.log = noop

			return
		}
	}
}

export const logger = new ConsoleLogger({ level: LOG_LEVEL })
