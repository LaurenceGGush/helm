// API Definitions
const methods = {
	printer_info: {
		url: "/printer/info",
		method: "printer.info",
	},
	gcode_script: {
		url: "/printer/gcode/script",
		method: "printer.gcode.script",
	},
	gcode_help: {
		url: "/printer/gcode/help",
		method: "printer.gcode.help",
	},
	start_print: {
		url: "/printer/print/start",
		method: "printer.print.start",
	},
	cancel_print: {
		url: "/printer/print/cancel",
		method: "printer.print.cancel",
	},
	pause_print: {
		url: "/printer/print/pause",
		method: "printer.print.pause",
	},
	resume_print: {
		url: "/printer/print/resume",
		method: "printer.print.resume",
	},
	query_endstops: {
		url: "/printer/query_endstops/status",
		method: "printer.query_endstops.status",
	},
	object_list: {
		url: "/printer/objects/list",
		method: "printer.objects.list",
	},
	object_status: {
		url: "/printer/objects/query",
		method: "printer.objects.query",
	},
	object_subscription: {
		url: "/printer/objects/subscribe",
		method: "printer.objects.subscribe",
	},
	temperature_store: {
		url: "/server/temperature_store",
		method: "server.temperature_store",
	},
	estop: {
		url: "/printer/emergency_stop",
		method: "printer.emergency_stop",
	},
	restart: {
		url: "/printer/restart",
		method: "printer.restart",
	},
	firmware_restart: {
		url: "/printer/firmware_restart",
		method: "printer.firmware_restart",
	},

	// Database
	db_list: {
		url: "/server/database/list",
		method: "server.database.list",
	},
	db_item: {
		url: "/server/database/item",
		method: {
			get: "server.database.get_item",
			post: "server.database.post_item",
			delete: "server.database.delete_item",
		},
	},

	// File Management Apis
	file_list: {
		url: "/server/files/list",
		method: "server.files.list",
	},
	metadata: {
		url: "/server/files/metadata",
		method: "server.files.metadata",
	},
	directory: {
		url: "/server/files/directory",
		method: {
			get: "server.files.get_directory",
			post: "server.files.post_directory",
			delete: "server.files.delete_directory",
		},
	},
	move: {
		url: "/server/files/move",
		method: "server.files.move",
	},
	copy: {
		url: "/server/files/copy",
		method: "server.files.copy",
	},
	delete_file: {
		method: "server.files.delete_file",
	},
	upload: {
		url: "/server/files/upload",
	},
	gcode_files: {
		url: "/server/files/gcodes/",
	},
	klippy_log: {
		url: "/server/files/klippy.log",
	},
	moonraker_log: {
		url: "/server/files/moonraker.log",
	},
	cfg_files: {
		url: "/server/files/config/",
	},
	cfg_examples: {
		url: "/server/files/config_examples/",
	},

	// Server APIs
	server_info: {
		url: "/server/info",
		method: "server.info",
	},
	gcode_store: {
		url: "server/gcode_store",
		method: "server.gcode_store",
	},

	// Machine APIs
	reboot: {
		url: "/machine/reboot",
		method: "machine.reboot",
	},
	shutdown: {
		url: "/machine/shutdown",
		method: "machine.shutdown",
	},

	// Access APIs
	apikey: {
		url: "/access/api_key",
	},
	oneshot_token: {
		url: "/access/oneshot_token",
	},
	login: {
		url: "/access/login",
	},
	logout: {
		url: "/access/logout",
	},
	refresh_jwt: {
		url: "/access/refresh_jwt",
	},
	user: {
		url: "/access/user",
	},
	reset_password: {
		url: "/access/user/password",
	},

	// Announcements APIs
	list_announcements: {
		url: "/server/announcements/list",
		method: "server.announcements.list",
	},
	update_announcements: {
		url: "/server/announcemets/update",
		method: "server.announcements.update",
	},
	dismiss_announcement: {
		url: "/server/announcements/dismiss",
		method: "server.announcements.dismiss",
	},

	// Receive
	notify_status: {
		method: "notify_status_update",
	},
	notify_klippy_ready: {
		method: "notify_klippy_ready",
	},
	notify_klippy_disconnected: {
		method: "notify_klippy_disconnected",
	},
	notify_gcode: {
		method: "notify_gcode_response",
	},
	notify_filelist: {
		method: "notify_filelist_changed",
	},
}

export default methods
