import { logger } from "./logger"

const defaultRetries = process.env.NODE_ENV === "test" ? 2 : 10
const defaultDelay = process.env.NODE_ENV === "test" ? 1 : 250

async function backoff<T>(
	callback: () => Promise<T>,
	retries = defaultRetries,
	delay = defaultDelay,
	lastDelay = 0,
): Promise<T> {
	let result

	logger.log("backing", callback.name, retries)

	try {
		result = await callback()
	} catch (error) {
		if (retries <= 1) throw error

		await wait(delay)

		result = await backoff<T>(
			callback,
			retries - 1,
			delay + lastDelay,
			delay,
		)
	}

	return result
}

function wait(duration: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, duration))
}

export default backoff
