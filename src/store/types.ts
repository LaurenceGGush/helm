/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AdjustProps } from "../components/adjust/Adjust"
import { homePrefixes } from "../hooks/useMacros"

export interface PrinterInfo {
	state?:
		| "startup"
		| "ready"
		| "error"
		| "opening"
		| "closed"
		| "disconnected"
		| "shutdown"
	state_message?: string
	hostname?: string
	software_version?: string
}

export interface Heater {
	temperature: number
	target: number
	power: number
}

export interface Extruder extends Heater {
	can_extrude: boolean
}

export type Heaters = Array<
	"extruder" | "extruder1" | "extruder2" | "extruder3" | "heater_bed"
>

export type EndstopValue = "open" | "TRIGGERED"
export interface Endstops {
	[key: string]: EndstopValue
}

export interface PrinterStatus {
	extruder?: Extruder
	[key: `extruder${number}`]: Extruder
	heater_bed?: Heater
	heaters?: {
		//TODO add heater_generic_XX
		available_heaters: Heaters
	}
	gcode_move?: {
		speed_factor: number
		extrude_factor: number
		gcode_position: number[]
		homing_origin: number[]
	}
	fan?: { speed: number }
	print_stats?: {
		state: string
		print_duration: number
		filename: string
	}
	virtual_sdcard?: {
		is_active: boolean
		progress?: number
	}
	display_status?: {
		progress: number
	}
	pause_resume?: {
		is_paused: boolean
	}
	toolhead?: {
		extruder?: "extruder" | `extruder${number}`
		homed_axes?: string
	}
	webhooks?: { state: PrinterInfo["state"]; state_message: string }
	query_endstops?: { last_query: Endstops }
	dock?: { tool_number?: string }
	[key: `gcode_macro ${string}`]: any
}

export type Camera = {
	streamUrl: string
	adaptiveUrl?: string
	fpstarget: number
	flipX: boolean
	flipY: boolean
	type: string
}

export interface ServerSettings {
	name: string
	camera?: Camera
}

export interface GcodeHistoryItem {
	message: string
	time: EpochTimeStamp
	type: "command" | "response" | "error"
}

export type Adjuster = {
	id: string
	props: Omit<AdjustProps, "onClose">
}

export type AdjusterAction = Adjuster | "close"

type Character =
	| "a"
	| "b"
	| "c"
	| "d"
	| "e"
	| "f"
	| "g"
	| "h"
	| "i"
	| "j"
	| "k"
	| "l"
	| "m"
	| "n"
	| "o"
	| "p"
	| "q"
	| "r"
	| "s"
	| "t"
	| "u"
	| "v"
	| "w"
	| "x"
	| "y"
	| "z"
type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
// must start with a lower case alpha numeric, not ideal but close enough
type notEmptyString = `${Character | Digit}${string}`
type underscoreString = `_${notEmptyString}`

type HomePrefixes = typeof homePrefixes[number]
export type HomeIs = "G28" | `${HomePrefixes}${underscoreString | ""}`
