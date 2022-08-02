let baseUrl = window.location?.hostname

// if running locally connect directly to moonraker
if (
	["localhost", "127.0.0.1", "0.0.0.0", ""].includes(
		window.location?.hostname,
	)
) {
	baseUrl = "0.0.0.0"
}

// in development connect to local printer, change to your testing printer ip
if (process.env.NODE_ENV === "development") {
	baseUrl = "192.168.1.58"
}

export const wsUrl = `ws://${baseUrl}/websocket`

export const httpUrl = `http://${baseUrl}`
export const filesUrl = `${httpUrl}/server/files`
