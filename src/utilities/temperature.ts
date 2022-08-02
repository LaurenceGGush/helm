import { blendRgbColours } from "./colours"

export const outsideTargetRange = (current: number, target: number) =>
	current < target - 1 || current > target + 1

const cool = [51, 170, 255]
const warm = [255, 82, 82]
export const warmRgb = `rgb(${warm.join(",")})`
export const warmRgba = `rgb(${warm.join(",")}, 0.5)`

export const getTemperatureColour = (
	current: number,
	range: { min: number; max: number },
	colorMode: "light" | "dark",
	baseFactor = 0.25,
) => {
	const base = colorMode === "light" ? [0, 0, 0] : [255, 255, 255]

	const factor = Math.min(
		1,
		Math.max(0.0001, (current - range.min) / (range.max - range.min)),
	)

	let blended = blendRgbColours(cool, warm, factor)
	blended = blendRgbColours(blended, base, baseFactor)

	return `rgb(${blended.join(",")})`
}
