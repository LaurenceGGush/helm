import {
	Dispatch,
	MutableRefObject,
	SetStateAction,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react"

import { SetAdjustValue } from "../components/adjust/Adjust"
import debounce from "../utilities/debounce"
import getPageOffsets from "../utilities/getPageOffsets"

type Rect = {
	height: number
	width: number
	top: number
	left: number
}

export const useKnob = (setValue: SetAdjustValue, step: number) => {
	const knobRef = useRef<HTMLDivElement>(null)
	const lastVal = useRef<number>(0)
	const [rect, setRect] = useState<Rect>()

	// Calculate adjuster value from pointer position
	const handleMove = useCallback(
		(event: PointerEvent) => {
			if (!rect) return

			const { pageX, pageY } = event
			const midX = rect.left + rect.width / 2
			const midY = rect.top + rect.height / 2

			const move = knob(lastVal, pageX, pageY, midX, midY, step)
			setValue((value?: number) => (value || 0) + move)
		},
		[rect, setValue, step],
	)

	// Reset last val when move starts
	const handleDown = () => {
		lastVal.current = 0
	}

	// Set knob rect when resized
	useEffect(() => resizeEffect(knobRef.current, setRect), [])

	// Move effect
	useEffect(
		() => moveEffect(knobRef.current, { handleMove, handleDown }),
		[handleMove],
	)

	return knobRef
}

export const useSlide = (
	min: number,
	max: number,
	step: number,
	setAdjustValue: SetAdjustValue,
	initialValue: number,
	value?: number,
) => {
	const slideRef = useRef<HTMLDivElement>(null)
	const lastValue = useRef<number>(0)
	const [slidePosition, setSlidePosition] = useState<number>(initialValue)
	const [rect, setRect] = useState<Rect>()

	// Update position when value changes externally
	useEffect(() => {
		if (typeof value === "number") {
			setSlidePosition(value)
		}
	}, [value])
	useEffect(() => {
		if (typeof initialValue === "number") {
			setSlidePosition(initialValue)
		}
	}, [initialValue])

	// Calculate slide position and adjuster value from pointer position
	const handleMove = useCallback(
		(event: PointerEvent) => {
			if (!rect) return

			const { pageX, pageY } = event
			const midX = rect.left + rect.width / 2
			const posY = rect.top + rect.height

			const position = slide(pageX, pageY, midX, posY, min, max)
			const value = valueFromPosition(position, lastValue.current, step)

			lastValue.current = value
			setSlidePosition(position)
			setAdjustValue(value)
		},
		[rect, min, max, step, setAdjustValue],
	)

	// Snap position to value when move complete
	const handleUp = useCallback(
		() =>
			setSlidePosition((position) =>
				valueFromPosition(position, lastValue.current, step),
			),
		[step],
	)

	// Set slide rect when resized
	useEffect(() => resizeEffect(slideRef.current, setRect), [])

	// Move effect
	useEffect(
		() => moveEffect(slideRef.current, { handleMove, handleUp }),
		[handleMove, handleUp],
	)

	return { slideRef, position: slidePosition }
}

const valueFromPosition = (position: number, lastValue: number, step: number) =>
	(position > lastValue
		? Math.floor(position / step)
		: Math.ceil(position / step)) * step

type Handlers = {
	handleMove: (e: PointerEvent) => void
	handleDown?: () => void
	handleUp?: () => void
}
// Effect body to setup and cleanup pointer event listeners
const moveEffect = (
	element: HTMLDivElement | null,
	{ handleMove, handleDown, handleUp }: Handlers,
) => {
	if (!element) return

	const handlePointerUp = () => {
		handleUp && handleUp()
		element.removeEventListener("pointermove", handleMove)
		element.removeEventListener("pointerup", handlePointerUp)
		element.parentElement?.removeEventListener("pointerup", handlePointerUp)
		element.parentElement?.removeEventListener(
			"pointerleave",
			handlePointerUp,
		)
	}

	const handlePointerDown = () => {
		handleDown && handleDown()
		element.addEventListener("pointermove", handleMove)
		element.addEventListener("pointerup", handlePointerUp)
		element.parentElement?.addEventListener("pointerup", handlePointerUp)
		element.parentElement?.addEventListener("pointerleave", handlePointerUp)
	}

	element.addEventListener("pointerdown", handlePointerDown)

	return () => {
		element.removeEventListener("pointerdown", handlePointerDown)
		element.removeEventListener("pointerup", handlePointerUp)
		element.removeEventListener("pointermove", handleMove)
	}
}

// Effect body to setup and cleanup resize observer
function resizeEffect(
	element: HTMLDivElement | null,
	setRect: Dispatch<SetStateAction<Rect | undefined>>,
) {
	if (!element) return

	const handleResize = debounce((entries: ResizeObserverEntry[]) => {
		if (!element) return

		setRect({
			height: entries[0].contentRect.height,
			width: entries[0].contentRect.width,
			...getPageOffsets(element),
		})
	})

	const observer = new ResizeObserver(handleResize)
	observer.observe(element)

	return () => observer.disconnect()
}

// Calculate knob value from coordinates
function knob(
	lastVal: MutableRefObject<number>,
	x: number,
	y: number,
	midX: number,
	midY: number,
	step: number,
	steps = 3,
) {
	const val = xyToVal(x, y, midX, midY)

	if (!lastVal.current) {
		lastVal.current = val
		return 0
	}

	const difference = val - lastVal.current
	const direction = difference >= 0 ? 1 : -1
	const amplitude = Math.round(Math.abs(difference) / steps)

	if (!amplitude) {
		return 0
	}

	lastVal.current = val

	if (amplitude > 100 / steps - steps) {
		return direction * step
	}

	return direction * amplitude * step
}

// Calculate slide position from coordinates
function slide(
	x: number,
	y: number,
	midX: number,
	posY: number,
	min = 0,
	max = 300,
) {
	const val = xyToVal(x, y, midX, posY, min, max, 110, 140)

	// clamp within min - max
	return Math.min(max, Math.max(min, val))
}

// Maths! to convert coordinates into degrees around an arc
// and normalise within min and max
function xyToVal(
	cursorX: number,
	cursorY: number,
	centreX: number,
	centreY: number,
	min = 0,
	max = 100,
	offset = 0,
	arc = 360,
) {
	const x = cursorY - centreY
	const y = -(cursorX - centreX)

	const TAU = 2 * Math.PI

	const offsetRad = degToRad(offset)
	const arcRad = degToRad(arc)

	let angle = Math.atan2(y, x) - offsetRad
	if (arcRad !== TAU && angle < 0 && angle > -0.5) {
		angle = 0
	} else if (angle < 0) {
		angle += TAU
	}

	return Math.round((angle * (max - min)) / arcRad + min)
}
// Less maths
function degToRad(degrees: number) {
	return (degrees * Math.PI) / 180
}
