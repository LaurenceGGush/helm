export type Orientation = "portrait" | "landscape"

export function getScreenOrientation(): Orientation {
	if (typeof window.screen !== "undefined" && window.screen.orientation) {
		return (window.screen.orientation.type.match(/\w+/) || [
			"landscape",
		])[0] as Orientation
	}

	return "landscape"
}
