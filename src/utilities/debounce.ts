/*
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing.
 */
function debounce(
	callback: CallableFunction,
	options: { wait?: number; immediate?: boolean } = {
		wait: 250,
		immediate: false,
	},
) {
	let timeout: number | undefined

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return function (...args: any[]) {
		const later = function () {
			timeout = undefined
			if (!options.immediate) {
				callback(...args)
			}
		}

		const callNow = options.immediate && !timeout

		clearTimeout(timeout)
		timeout = window.setTimeout(later, options.wait)

		if (callNow) {
			callback(...args)
		}
	}
}

export default debounce
