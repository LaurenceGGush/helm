import {
	RefObject,
	useCallback,
	useEffect,
	useMemo,
	useReducer,
	useRef,
	useState,
} from "react"

import { logger } from "../utilities/logger"
import { calculateFps } from "./calculateFps"

type Frame = {
	src?: string
	className: string
}
interface Present {
	one: Frame
	two: Frame
}

export const useCameraImage = (
	ref: RefObject<HTMLDivElement>,
	baseUrl: string,
	targetFps?: number,
) => {
	const [fps, setFps] = useState(0)

	const initialPresent = useMemo(
		(): Present => ({
			one: {
				src: createSrc(baseUrl),
				className: "back",
			},
			two: {
				className: "front",
			},
		}),
		[baseUrl],
	)
	const presentReducer = useCallback(
		(state: Present, action: "one" | "two") => {
			const back: Frame = {
				className: "back",
				src: createSrc(baseUrl),
			}

			switch (action) {
				case "one":
					return {
						one: { ...state.one, className: "front" },
						two: back,
					}

				case "two":
					return {
						one: back,
						two: { ...state.two, className: "front" },
					}

				default:
					throw new Error()
			}
		},
		[baseUrl],
	)
	const [present, dispatch] = useReducer(presentReducer, initialPresent)

	const [buffers, setBuffers] = useState<NodeListOf<HTMLImageElement>>()

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
		(buffer: "one" | "two") => (event: Event) => {
			const targetMs = 1000 / (targetFps || 10)
			const fpsMs = 1000 / calculateFps(frameTimes.current.slice(-5))
			const fpsOffset = Math.max(0, Math.min(targetMs, fpsMs - targetMs))

			const margin = Math.max(0, targetMs - fpsOffset)

			logger.log({ offset: fpsOffset, margin })

			setTimeout(() => dispatch(buffer), margin)

			pushFrameTime(event.timeStamp)
		},
		[pushFrameTime, targetFps],
	)

	const handleError = useCallback(
		(buffer: "one" | "two") => () => {
			setTimeout(() => dispatch(buffer), 1000)
		},
		[],
	)

	// Buffer aquire effect
	useEffect(() => {
		if (ref.current) {
			setBuffers(ref.current.querySelectorAll("img"))
		}
	}, [ref])

	// Image update effect
	useEffect(() => {
		if (buffers?.length === 2) {
			buffers[0].onload = handleLoad("one")
			buffers[0].onerror = handleError("one")
			buffers[1].onload = handleLoad("two")
			buffers[1].onerror = handleError("two")
		}
	}, [buffers, handleError, handleLoad])

	// FPS update effect
	useEffect(() => {
		const interval = setInterval(() => {
			const e = new Event("event")
			const fps = calculateFps(frameTimes.current, e.timeStamp)
			setFps(fps)
		}, 500)

		return () => clearInterval(interval)
	}, [setFps])

	return { fps: Math.round(fps), one: present.one, two: present.two }
}

const createSrc = (base: string) => `${base}&b=${new Date().getTime()}`
