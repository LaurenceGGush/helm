import { FC } from "react"

import styled from "@emotion/styled"

import { useKnob } from "../../hooks/useKnob"
import { colourModeRule } from "../../theme/colourMode"
import type { SetAdjustValue } from "../adjust/Adjust"

interface KnobProps {
	setValue: SetAdjustValue
	step?: number
}
const Knob: FC<KnobProps> = ({ setValue, ...rest }) => {
	const knobRef = useKnob(setValue, 1)

	return (
		<KnobWrapper className="Knob" ref={knobRef} {...rest}>
			<div>
				<KnobSvg />
			</div>
		</KnobWrapper>
	)
}

const KnobWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;

	width: 100%;
	height: 100%;

	overflow: hidden;

	div {
		height: 100%;
		aspect-ratio: 1;

		max-width: min(15rem, 100%);
		max-height: min(15rem, 100%);
	}

	.chevron {
		${colourModeRule(
			"stroke",
			"--chakra-colors-whiteAlpha-600",
			"--chakra-colors-blackAlpha-200",
		)}
	}
`

const KnobSvg = () => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 190">
		<path
			className="outer"
			fill="var(--chakra-colors-button-bg)"
			stroke="var(--chakra-colors-highlight-bg)"
			strokeWidth="0.5"
			d="M189.5 95a94.5 94.5 0 1 0-189 0 94.5 94.5 0 1 0 189 0z"
		/>
		<path
			className="inner"
			fill="var(--chakra-colors-background)"
			stroke="var(--chakra-colors-highlight-bg)"
			strokeWidth="0.5"
			d="M142.2 95a47.2 47.2 0 1 0-94.5 0 47.2 47.2 0 1 0 94.5 0z"
		/>
		<g
			className="chevron"
			strokeLinecap="round"
			strokeWidth="5"
			transform="rotate(-30 95 95)"
		>
			<path d="m128.3 34.2-16.2 4.2" />
			<path d="m122.3 18.5 6 15.7" />
			<path d="m139.1 27.2 6 15.7" />
			<path d="M145.1 42.9 129 47" />
			<path d="m61.7 34.2 16.2 4.2" />
			<path d="m67.7 18.5-6 15.7" />
			<path d="m50.9 27.2-6 15.7" />
			<path d="M44.9 42.9 61 47" />
			<path d="m75 164.5-4.6-16.2" />
			<path d="m58.3 167.1 16.6-2.6" />
			<path d="m42.4 156.9 16.6-2.7" />
			<path d="m59 154.2-4.5-16.1" />
			<path d="m24.8 77.6 11.8 12" />
			<path d="m14.2 90.7 10.6-13" />
			<path d="m15.1 109.5 10.6-13" />
			<path d="m25.7 96.5 11.8 12" />
			<path d="m165.2 77.6-11.8 12" />
			<path d="m175.8 90.7-10.6-13" />
			<path d="m174.9 109.5-10.6-13" />
			<path d="m164.3 96.5-11.8 12" />
			<path d="m115 164.5 4.5-16.2" />
			<path d="m131.6 167.1-16.5-2.6" />
			<path d="m147.5 156.9-16.5-2.7" />
			<path d="m131 154.2 4.4-16.1" />
		</g>
	</svg>
)

export default Knob
