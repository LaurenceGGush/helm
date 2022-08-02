/**
 * Calculate average framerate from array of past frame times
 */
export const calculateFps = (frameTimes: number[], now?: number) => {
	if (frameTimes.length < 3) {
		return 0
	}

	if (now) {
		frameTimes = [...frameTimes, now]
	}

	const intervals = frameTimes
		.map((time, i) => {
			if (i === 0) {
				return 0
			}

			return time - frameTimes[i - 1]
		})
		.slice(1)

	const average =
		intervals.reduce((total, interval) => total + interval) /
		intervals.length

	const fps = 1000 / average

	return fps
}
