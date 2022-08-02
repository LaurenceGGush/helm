import { FC } from "react"

import { Text } from "@chakra-ui/react"
import styled from "@emotion/styled"

import { colourModeRule } from "../../theme/colourMode"

const FpsCounter: FC<{ fps: number }> = ({ fps }) => {
	return (
		<Fps size="sm" padding="1">
			{fps.toLocaleString(undefined, { minimumIntegerDigits: 2 })}
		</Fps>
	)
}

const Fps = styled(Text)`
	position: absolute;

	bottom: 0;
	right: 0;

	padding: var(--chakra-space-1) var(--chakra-space-3);

	${colourModeRule(
		"text-shadow",
		"1px 1px 3px rgba(255, 255, 255, 0.5)",
		"1px 1px 3px rgba(0, 0, 0, 0.5)",
	)}
`

export default FpsCounter
