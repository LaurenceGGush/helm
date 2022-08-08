import { useCallback, useEffect, useRef, useState } from "react"

import { Box } from "@chakra-ui/react"
import styled from "@emotion/styled"

import { useOutput } from "../../hooks/useOutput"
import { colourModeRule } from "../../theme/colourMode"

const Output = ({ isSelected }: { isSelected: boolean }) => {
	const output = useOutput()
	const [scrolled, setScrolled] = useState(false)
	const ignoreNextScroll = useRef(false)
	const ref = useRef<HTMLDivElement>(null)

	const handleScroll = useCallback(() => {
		if (ignoreNextScroll.current) {
			ignoreNextScroll.current = false
			return
		}

		// When user scrolls to bottom unset scrolled
		if (
			ref.current &&
			ref.current?.scrollHeight - ref.current?.scrollTop ===
				ref.current?.clientHeight
		) {
			setScrolled(false)
			return
		}

		if (!scrolled) {
			setScrolled(true)
		}
	}, [scrolled])

	useEffect(() => {
		if (!scrolled) {
			ignoreNextScroll.current = true
			const lastChild = ref.current?.lastElementChild
			lastChild?.scrollIntoView()
		}
		if (!isSelected) {
			setScrolled(false)
		}
	}, [isSelected, scrolled, output])

	return (
		<Box
			ref={ref}
			height="100%"
			overflowY="scroll"
			position="relative"
			onScroll={handleScroll}
		>
			{output.map((response, index) => (
				<Response key={index} className={response.type}>
					<ResponseLines>
						{response.message.split("\n").map((line, index) => (
							<ResponseLine key={index}>{line}</ResponseLine>
						))}
					</ResponseLines>
				</Response>
			))}
		</Box>
	)
}

const Response = styled.p`
	position: relative;
	display: flex;

	font-family: "League Mono Condensed", monospace;
	font-size: var(--chakra-fontSizes-3xs);

	&.command::before {
		content: "$";

		width: var(--chakra-space-3);

		${colourModeRule(
			"color",
			"--chakra-colors-gray-700",
			"--chakra-colors-gray-300",
		)}
	}

	&.response {
		${colourModeRule(
			"color",
			"--chakra-colors-gray-500",
			"--chakra-colors-gray-400",
		)}
	}

	&.error {
		color: var(--chakra-colors-red-600);
	}
`

const ResponseLines = styled.span`
	display: block;
`
const ResponseLine = styled.span`
	display: block;
`

export default Output
