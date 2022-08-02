import { RefObject, useCallback, useEffect, useRef, useState } from "react"

import { calculateFps } from "./calculateFps"

export const useCamvas = (
	ref: RefObject<HTMLCanvasElement>,
	baseUrl: string,
	targetFps?: number,
) => {
	const [fps, setFps] = useState(0)
	// Cache buster
	const [buster, setBuster] = useState(new Date().getTime())
	const bustIt = useCallback(() => setBuster(new Date().getTime()), [])
	const preloader = useRef(new Image())
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

	const handleLoad = useCallback(
		(event: Event) => {
			const image = event.target as HTMLImageElement
			const canvas = ref.current
			const ctx = ref.current?.getContext("2d")

			if (!image || !canvas || !ctx) {
				return
			}

			const targetMs = 1000 / (targetFps || 10)
			const fpsMs = 1000 / calculateFps(frameTimes.current.slice(-5))
			const fpsOffset = Math.max(0, Math.min(targetMs, fpsMs - targetMs))

			const margin = Math.max(0, targetMs - fpsOffset - 2)

			// logger.log({ offset: fpsOffset, margin })

			setTimeout(bustIt, margin)

			canvas.width = image.width
			canvas.height = image.height
			ctx.drawImage(image, 0, 0)

			pushFrameTime(event.timeStamp)
		},
		[ref, targetFps, bustIt, pushFrameTime],
	)

	// If image fails to (pre)load update cache buster to try again
	const handleError = useCallback(() => {
		setTimeout(bustIt, 1000)
	}, [bustIt])

	preloader.current.onload = handleLoad
	preloader.current.onerror = handleError

	// Update preloader image source when cache buster is updated
	useEffect(() => {
		preloader.current.src = `${baseUrl}&b=${buster}`
	}, [handleLoad, handleError, baseUrl, buster])

	// Update FPS display every half a second
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
