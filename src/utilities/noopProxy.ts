/* eslint-disable @typescript-eslint/no-explicit-any */
import { logger } from "./logger"

/**
 * No-op object, used to log and optionally mock data when rendering components
 * in storybook
 *
 * @param methods Methods to override
 */
const noopObj = (methods: any = {}) =>
	new Proxy(
		{},
		{
			get: (_, key) => {
				if (methods[key]) {
					return methods[key]
				}

				return (...args: any[]) => log(key, args)
			},
		},
	)

const log = (key: string | number | symbol, args: any[]) =>
	logger.info("noop", key, ...args)

export default noopObj
