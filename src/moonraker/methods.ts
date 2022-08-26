const methods = {
	printer_info: "printer.info",
	gcode_script: "printer.gcode.script",
	gcode_help: "printer.gcode.help",
	start_print: "printer.print.start",
	cancel_print: "printer.print.cancel",
	pause_print: "printer.print.pause",
	resume_print: "printer.print.resume",
	query_endstops: "printer.query_endstops.status",
	object_list: "printer.objects.list",
	object_status: "printer.objects.query",
	object_subscription: "printer.objects.subscribe",
	temperature_store: "server.temperature_store",
	estop: "printer.emergency_stop",
	restart: "printer.restart",
	firmware_restart: "printer.firmware_restart",

	// Database
	db_list: "server.database.list",

	db_item_get: "server.database.get_item",
	db_item_post: "server.database.post_item",
	db_item_delete: "server.database.delete_item",

	// File Management Apis
	file_list: "server.files.list",
	metadata: "server.files.metadata",

	directory_get: "server.files.get_directory",
	directory_post: "server.files.post_directory",
	directory_delete: "server.files.delete_directory",

	move: "server.files.move",
	copy: "server.files.copy",
	delete_file: "server.files.delete_file",

	// Server APIs
	server_info: "server.info",
	gcode_store: "server.gcode_store",

	// Machine APIs
	reboot: "machine.reboot",
	shutdown: "machine.shutdown",

	// Announcements APIs
	list_announcements: "server.announcements.list",
	update_announcements: "server.announcements.update",
	dismiss_announcement: "server.announcements.dismiss",

	// Receive
	notify_status_update: "notify_status_update",
	notify_klippy_ready: "notify_klippy_ready",
	notify_klippy_disconnected: "notify_klippy_disconnected",
	notify_gcode_response: "notify_gcode_response",
	notify_filelist_changed: "notify_filelist_changed",
} as const

export default methods

export type MoonrakerResponses = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key in keyof typeof methods]?: any
}
