import { RESET } from "jotai/utils"

import { MoonrakerResponses } from "../moonraker/methods"
import {
	EndstopValue,
	GcodeHistoryItem,
	PrinterInfo,
	PrinterStatus,
} from "../store/types"

export const version = "v0.10.0-somehash"
const baseInfo = {
	hostname: "MYP",
	software_version: version,
}

export const emptyInfo: PrinterInfo = {
	hostname: "",
}

export const startupInfo: PrinterInfo = {
	...baseInfo,
	state: "startup",
	state_message:
		"Printer is not ready\nThe klippy host software is attempting to connect.  Please retry in a few moments.",
}

export const disconnectedInfo: PrinterInfo = {
	...baseInfo,
	state: "closed",
	state_message: "Reconnecting...",
}

export const errorInfo: PrinterInfo = {
	...baseInfo,
	state: "error",
	state_message: "Uh oh\nSomething went wrong!",
}
export const bigErrorInfo: PrinterInfo = {
	...baseInfo,
	state: "error",
	state_message: `Uh oh\nSomething went wrong!
	Uh oh Something went wrong!
	Uh oh Something went wrong!
	Uh oh Something went wrong!
	Uh oh Something went wrong!
	Uh oh Something went wrong!
	Uh oh Something went wrong!
	Uh oh Something went wrong!
	Uh oh Something went wrong!
	Uh oh Something went wrong!
	Uh oh Something went wrong!
	Uh oh Something went wrong!
	Uh oh Something went wrong!
	`,
}

export const readyInfo: PrinterInfo = {
	...baseInfo,
	state: "ready",
	state_message: "Printer is ready",
}

export const heatersOn: PrinterStatus = {
	extruder: {
		temperature: 278.4,
		target: 280,
		power: 0.6,
		can_extrude: true,
	},
	extruder1: { temperature: 224, target: 0, power: 0, can_extrude: true },
	extruder2: { temperature: 24.9, target: 0, power: 0, can_extrude: false },
	extruder3: { temperature: 23.8, target: 0, power: 0, can_extrude: false },
	heater_bed: { temperature: 57.9, target: 60, power: 0.2 },
}

const rand = () => Math.random() * 0.3
export const heatersOnRandomTemps = (): PrinterStatus => ({
	extruder: {
		temperature: 278.8 + rand(),
		target: 280,
		power: 0.6,
		can_extrude: true,
	},
	extruder1: {
		temperature: 224 + rand(),
		target: 0,
		power: 0,
		can_extrude: true,
	},
	extruder2: {
		temperature: 24.9 + rand(),
		target: 0,
		power: 0,
		can_extrude: false,
	},
	extruder3: {
		temperature: 23.8 + rand(),
		target: 0,
		power: 0,
		can_extrude: false,
	},
	heater_bed: { temperature: 58.8 + rand(), target: 60, power: 0.2 },
})

export const baseEndstops = {
	"manual_stepper tool_lock": "TRIGGERED",
	x: "open",
	z: "open",
	y: "open",
} as const

const endstopValues: EndstopValue[] = ["open", "TRIGGERED"]
const randomEndstopValue = (): EndstopValue =>
	endstopValues[Math.floor(Math.random() * endstopValues.length)]
export const randomEndstops = () => ({
	"manual_stepper tool_lock": randomEndstopValue(),
	x: randomEndstopValue(),
	z: randomEndstopValue(),
	y: randomEndstopValue(),
})

export const baseStatus: PrinterStatus = {
	...heatersOn,
	heaters: {
		available_heaters: ["extruder", "heater_bed"],
	},
	gcode_move: {
		speed_factor: 1,
		extrude_factor: 1,
		gcode_position: [0, 0, 9.25, 0],
		homing_origin: [0, 0, 0.2, 0],
	},
	fan: { speed: 1 },
	print_stats: {
		state: "standby",
		print_duration: 1,
		filename: "",
	},
	virtual_sdcard: {
		is_active: false,
		progress: 0,
	},
	pause_resume: {
		is_paused: false,
	},
	toolhead: { extruder: "extruder", homed_axes: "xyz" },
	dock: {},
	"gcode_macro LEDS": {},
	"gcode_macro NOZZLE_SCRUB": {},
}

export const baseList = Object.keys(baseStatus) as (keyof PrinterStatus)[]
export const homingList: (keyof PrinterStatus)[] = [
	...baseList,
	"gcode_macro HOME",
	"gcode_macro INIT",
	"gcode_macro HOME_2",
	"gcode_macro INIT_SHORT",
]

export const heatersOff: PrinterStatus = {
	extruder: { temperature: 23.4, target: 0, power: 0, can_extrude: false },
	extruder1: { temperature: 24, target: 0, power: 0, can_extrude: false },
	extruder2: { temperature: 24.1, target: 0, power: 0, can_extrude: false },
	extruder3: { temperature: 23.8, target: 0, power: 0, can_extrude: false },
	heater_bed: { temperature: 23.9, target: 0, power: 0 },
}

export const printLoadedStatus = {
	...baseStatus,
	print_stats: {
		state: "standby",
		print_duration: 250,
		filename: "testing-file.gcode",
	},
	virtual_sdcard: {
		is_active: true,
		progress: 0,
	},
}

export const pausedStatus: PrinterStatus = {
	...printLoadedStatus,
	print_stats: {
		...printLoadedStatus.print_stats,
		state: "paused",
	},
	virtual_sdcard: {
		is_active: true,
		progress: 0.34,
	},
	pause_resume: {
		is_paused: true,
	},
}
export const printingStatus: PrinterStatus = {
	...baseStatus,
	print_stats: {
		...printLoadedStatus.print_stats,
		state: "printing",
	},
	virtual_sdcard: {
		is_active: true,
		progress: 0.74,
	},
	pause_resume: {
		is_paused: false,
	},
}

export const resetStatus = RESET as unknown as PrinterStatus
const cameraLocation = globalThis?.document?.location || {
	protocol: "http:",
	host: "localhost",
}
export const baseFluidd = {
	cameras: {
		cameras: [
			{
				id: "dfc749cb-7df9-4185-a947-d08e51d3e5f6",
				enabled: true,
				name: "Bed",
				type: "mjpgadaptive",
				fpstarget: 30,
				fpsidletarget: 1,
				url: `${cameraLocation.protocol}//${cameraLocation.host}/camera.jpg?action=stream`,
				flipX: false,
				flipY: false,
				height: 720,
				rotate: "",
			},
		],
		activeCamera: "dfc749cb-7df9-4185-a947-d08e51d3e5f6",
	},
	uiSettings: { general: { instanceName: "Printer" } },
}

export const baseRecent = {
	E0: [220, 240, 260],
	Bed: [60, 50, 70, 80],
}

const now = new Date()
const aminuteago = new Date(now).setMinutes(now.getMinutes() - 1) / 1000
const before = new Date(now).setMinutes(now.getMinutes() - 3) / 1000
const earlier = new Date(now).setHours(now.getHours() - 1) / 1000
const yesterday = new Date(now).setDate(now.getDate() - 1) / 1000
const lastweek = new Date(now).setDate(now.getDate() - 7) / 1000
const lastyear = new Date(now).setFullYear(now.getFullYear() - 1) / 1000

export const gcodes = [
	{
		path: "rail_bracket_90_mirror.gcode",
		modified: aminuteago,
		size: 8097190,
	},
	{
		path: "rail_bracket_90.gcode",
		modified: before,
		size: 8119878,
	},
	{
		path: "propellor.gcode",
		modified: earlier,
		size: 3264256,
	},
	{
		path: "rail_bracket.gcode",
		modified: lastweek,
		size: 4811356,
	},
	{
		path: "tube_adapter_100_-_82_thread.gcode",
		modified: yesterday,
		size: 11363898,
	},
	{
		path: "grill_band.gcode",
		modified: yesterday,
		size: 3309336,
	},
	{
		path: "spinner-body-type-d.gcode",
		modified: lastweek,
		size: 2178384,
	},
	{
		path: "pull-gear-v2.gcode",
		modified: lastweek,
		size: 763123,
	},
	{
		path: "spinner-body-type-a.gcode",
		modified: lastyear,
		size: 15604663,
	},
	{
		path: "Jim_Solder_Fingers_Jaw_Static_lower.gcode",
		modified: lastyear,
		size: 5831577,
	},
	{
		path: "Jim_Solder_Fingers_Base_weight.gcode",
		modified: lastyear,
		size: 1413412,
	},
	{
		path: "frame.gcode",
		modified: lastyear,
		size: 4364336,
	},
]

export const fileMeta = {
	filename: "testing.gcode",
	size: 8090,
	modified: now,
	slicer: "F360",
	slicer_version: "8",
	first_layer_height: 0.25,
	first_layer_bed_temp: 60,
	first_layer_extr_temp: 280,
	layer_height: 0.2,
	object_height: 100,
	estimated_time: 500,
	filament_total: 500,

	thumbnails: [
		{
			width: 100,
			height: 100,
			size: 6716,
			relative_path: "",
		},
		{
			width: 200,
			height: 200,
			size: 17120,
			relative_path: "",
		},
	],
}

export const gcodeStore: GcodeHistoryItem[] = [
	{
		message: "STATUS",
		time: 1652530885.148376,
		type: "command",
	},
	{
		message: "// Klipper state: Ready",
		time: 1652530886.0483768,
		type: "response",
	},
	{
		message:
			"!! No trigger on manual_stepper tool_lock after full movement",
		time: 1652727831.1666899,
		type: "error",
	},
]

export const zTiltOutput: GcodeHistoryItem[] = [
	{
		message: "// probe at 80.000,100.000 is z=-2.987500",
		time: 1652535033.2861414,
		type: "response",
	},
	{
		message: "// probe at 250.000,100.000 is z=-2.962500",
		time: 1652535037.4465337,
		type: "response",
	},
	{
		message: "// probe at 250.000,280.000 is z=-2.975000",
		time: 1652535041.6318896,
		type: "response",
	},
	{
		message: "// probe at 80.000,280.000 is z=-2.943750",
		time: 1652535045.820528,
		type: "response",
	},
	{
		message:
			"// Making the following Z adjustments:\n// stepper_z = -0.008211\n// stepper_z1 = -0.002312\n// stepper_z2 = 0.022632",
		time: 1652535045.820581,
		type: "response",
	},
	{
		message:
			"// Retries: 0/3 Probed points range: 0.043750 tolerance: 0.040000",
		time: 1652535045.820624,
		type: "response",
	},
	{
		message: "// probe at 80.000,100.000 is z=-2.985539",
		time: 1652535050.136627,
		type: "response",
	},
	{
		message: "// probe at 250.000,100.000 is z=-2.966789",
		time: 1652535054.33889,
		type: "response",
	},
	{
		message: "// probe at 250.000,280.000 is z=-2.998039",
		time: 1652535058.5440245,
		type: "response",
	},
	{
		message: "// probe at 80.000,280.000 is z=-2.966789",
		time: 1652535062.736113,
		type: "response",
	},
	{
		message:
			"// Making the following Z adjustments:\n// stepper_z = -0.005196\n// stepper_z1 = 0.006610\n// stepper_z2 = -0.010590",
		time: 1652535062.736166,
		type: "response",
	},
	{
		message:
			"// Retries: 1/3 Probed points range: 0.031250 tolerance: 0.040000",
		time: 1652535062.7362106,
		type: "response",
	},
]

export const baseData: MoonrakerResponses = {
	server_info: { klippy_connected: true },
	file_list: gcodes,
	metadata: fileMeta,
	printer_info: readyInfo,
	db_item_get: {
		fluidd: { value: baseFluidd },
	},
	object_list: { objects: baseList },
	gcode_store: { gcode_store: gcodeStore },
	query_endstops: baseEndstops,
	object_status: { status: baseStatus },
}
