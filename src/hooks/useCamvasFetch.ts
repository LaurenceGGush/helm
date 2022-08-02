import { RefObject, useCallback, useEffect, useRef, useState } from "react"

import { logger } from "../utilities/logger"
import { calculateFps } from "./calculateFps"

export const useCamvasFetch = (
	ref: RefObject<HTMLCanvasElement>,
	baseUrl: string,
	targetFps?: number,
) => {
	const [fps, setFps] = useState(0)
	const [buster, setBuster] = useState(0)
	const bustIt = useCallback(() => setBuster(buster + 1), [buster])

	const frameTimes = useRef<number[]>([])
	const pushFrameTime = useCallback(
		(timestamp: number) => {
			frameTimes.current.push(timestamp)

			// just the most recent frames please
			frameTimes.current = frameTimes.current.slice(
				-Math.min(20, (targetFps || 10) * 2),
			)
		},
		[targetFps],
	)

	// canvas effect
	useEffect(() => {
		const canvas = ref.current
		const ctx = ref.current?.getContext("2d")
		let timeout: number

		if (canvas && ctx) {
			fetch(`${baseUrl}&b=${new Date().getTime()}`)
				.then(blobOrError)
				.then(createImageBitmap)
				.then((bitmap) => {
					if (ref.current) {
						canvas.width = bitmap.width
						canvas.height = bitmap.height
						ctx.drawImage(bitmap, 0, 0)

						const targetMs = 1000 / (targetFps || 10)
						const fpsMs =
							1000 /
							calculateFps(
								frameTimes.current.slice(-(targetFps || 10)),
							)
						const fpsOffset = Math.max(
							0,
							Math.min(targetMs, fpsMs - targetMs),
						)

						const margin = Math.max(0, targetMs - fpsOffset - 5)

						logger.log({ offset: fpsOffset, margin })

						timeout = window.setTimeout(bustIt, margin)

						pushFrameTime(performance.now())
					}
				})
				.catch((error) => {
					logger.error(error)
					timeout = window.setTimeout(bustIt, 1000)
				})
		}

		return () => {
			if (timeout) clearTimeout(timeout)
		}
	}, [ref, baseUrl, buster, bustIt, targetFps, pushFrameTime])

	// FPS update effect
	useEffect(() => {
		const interval = setInterval(() => {
			const e = new Event("event")
			const fps = calculateFps(frameTimes.current, e.timeStamp)
			setFps(fps)
		}, 500)

		return () => clearInterval(interval)
	}, [setFps])

	return Math.round(fps)
}

const blobOrError = (res: Response) => {
	if (!res.ok) throw Error(res.statusText)

	return res.blob()
}
