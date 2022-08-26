import { expect, test } from "vitest"

import { calculateFps } from "./calculateFps"

test("18 FPS", () => {
	const fps = calculateFps([1435, 1500, 1550, 1600, 1685, 1710])

	expect(Math.round(fps)).toEqual(18)
})

test("5 fps", () => {
	const fps = calculateFps([1400, 1600, 1800, 2000, 2200, 2400])

	expect(fps).toEqual(5)
})

test("stalled", () => {
	const fps = calculateFps([1400, 1600, 1800, 2000, 2200, 2400], 3800)

	expect(fps).toEqual(2.5)
})

test("some real numbers", () => {
	const fps = calculateFps([
		237370, 237414, 237543, 237627, 237740, 237764, 237861, 237916, 237974,
		238077, 238102, 238203, 238261, 238323, 238390, 238455, 238513,
	])

	expect(Math.round(fps)).toEqual(14)
})

test("not enough data", () => {
	const fps = calculateFps([1400])

	expect(fps).toEqual(0)
})
