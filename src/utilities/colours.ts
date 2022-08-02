const hexColourValidator = new RegExp(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)

// type RGB = `rgb(${number}, ${number}, ${number})`
// type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`
export type HexColour = `#${string}`

// type Color = RGB | RGBA | HEX

export function blendHexColours(
	colour1: HexColour,
	colour2: HexColour,
	factor = 0.5,
): HexColour {
	if (factor > 1 || factor < 0) {
		throw new Error("percentage must be between 0 and 1")
	}

	const hex1 = validateHexColour(colour1)
	const hex2 = validateHexColour(colour2)

	const rgb1 = hexToRgb(hex1)
	const rgb2 = hexToRgb(hex2)

	const blended = blendRgbColours(rgb1, rgb2, factor)

	const hex = rgbToHex(blended)

	return `#${hex}`
}

export function convertHexToRgb(hex: string): number[] {
	return hexToRgb(validateHexColour(hex))
}

function validateHexColour(hex: string) {
	const hexDigits = (hex.match(hexColourValidator) || [])[1]

	if (!hexDigits) {
		throw new Error(`colors must be provided as hexes (${hex})`)
	}

	return threeToSix(hexDigits)
}

export function blendRgbColours(rgb1: number[], rgb2: number[], factor = 0.5) {
	return [
		Math.round((1 - factor) * rgb1[0] + factor * rgb2[0]),
		Math.round((1 - factor) * rgb1[1] + factor * rgb2[1]),
		Math.round((1 - factor) * rgb1[2] + factor * rgb2[2]),
	]
}

function threeToSix(hex: string) {
	if (hex.length === 6) {
		return hex
	}

	return hex
		.split("")
		.map((char) => char + char)
		.join("")
}

function hexToRgb(hex: string) {
	return [
		parseInt(hex[0] + hex[1], 16),
		parseInt(hex[2] + hex[3], 16),
		parseInt(hex[4] + hex[5], 16),
	]
}

function rgbToHex(rgb: number[]) {
	return rgb
		.map((num) => Math.round(num).toString(16).padStart(2, "0"))
		.join("")
}
