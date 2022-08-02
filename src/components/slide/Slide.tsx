import { FC, SVGProps, useEffect, useRef, useState } from "react"

import { Box } from "@chakra-ui/react"
import styled from "@emotion/styled"

import { useSlide } from "../../hooks/useKnob"
import { colourModeRule } from "../../theme/colourMode"
import type { SetAdjustValue } from "../adjust/Adjust"

interface SlideProps {
	min: number
	max: number
	placeholder: number
	value?: number
	setValue: SetAdjustValue
}
/**
 * Range slider
 *
 * Arched to achieve greater resolution in a given width
 */
const Slide: FC<SlideProps> = ({
	min,
	max,
	placeholder,
	value,
	setValue,
	...rest
}) => {
	/**
	 * SVG path length, used used to calculate handle position
	 * Should be consistant but appears to vary slightly between browsers
	 */
	const [pathLength, setPathLength] = useState(0)
	const pathRef = useRef<SVGPathElement | null>(null)

	const valueOrPlaceholder = typeof value === "number" ? value : placeholder

	const { slideRef, position } = useSlide(
		min,
		max,
		5,
		setValue,
		valueOrPlaceholder,
		value,
	)

	useEffect(() => {
		if (pathRef.current) {
			setPathLength(pathRef.current.getTotalLength())
		}
	}, [setPathLength])

	const percent = Math.max(
		0.001,
		1 - (max - valueOrPlaceholder) / (max - min),
	)

	const markerPercent = Math.max(0.001, 1 - (max - position) / (max - min))

	// logger.info("slide")

	const arcProps: SVGProps<SVGPathElement> = {
		d: "M197 80a99.3 99.3 0 0 0-172 0",
		fill: "none",
		stroke: "currentColor",
		strokeLinecap: "round",
	}

	return (
		<SlideArc className="Slide" ref={slideRef} {...rest}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 222 110">
				<path ref={pathRef} {...arcProps} strokeWidth="50" />
				{pathLength && (
					<>
						<path
							className="trail"
							{...arcProps}
							strokeWidth="42"
							strokeDasharray={pathLength}
							strokeDashoffset={pathLength * (1 + percent)}
						/>
						<path
							className="trail_end"
							{...arcProps}
							strokeWidth="34"
							strokeDasharray={`0.01 ${pathLength}`}
							strokeDashoffset={pathLength * (1 + percent)}
						/>
						<path
							className="marker"
							{...arcProps}
							strokeWidth="34"
							strokeDasharray={`0.01 ${pathLength}`}
							strokeDashoffset={pathLength * (1 + markerPercent)}
						/>
					</>
				)}
			</svg>
		</SlideArc>
	)
}

const SlideArc = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: center;

	width: 100%;
	max-width: min(15rem, 100%);

	margin: auto;

	touch-action: none;

	${colourModeRule(
		"color",
		"--chakra-colors-gray-100",
		"--chakra-colors-gray-700",
	)}

	.trail {
		${colourModeRule(
			"color",
			"--chakra-colors-white",
			"--chakra-colors-gray-800",
		)}
	}

	.marker {
		color: var(--chakra-colors-gray-400);
	}
`

export default Slide
