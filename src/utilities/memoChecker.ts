/* eslint-disable @typescript-eslint/no-explicit-any */
import { logger } from "./logger"

/**
 * Used to debug react memo not memoizing
 */
export const memoChecker = (p: any, n: any) => {
	logger.log("memo", areEqualShallow(p, n), p, n)

	return areEqualShallow(p, n)
}

function areEqualShallow(a: any, b: any) {
	for (const key in a) {
		if (!(key in b) || a[key] !== b[key]) {
			return false
		}
	}
	for (const key in b) {
		if (!(key in a) || a[key] !== b[key]) {
			return false
		}
	}
	return true
}
