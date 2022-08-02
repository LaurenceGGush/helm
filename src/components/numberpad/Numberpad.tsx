import { FC } from "react"

import { Box, Button, IconButton, IconButtonProps } from "@chakra-ui/react"
import styled from "@emotion/styled"
import { TiBackspace } from "react-icons/ti"

import { SetAdjustValue } from "../adjust/Adjust"

const NumberPad: FC<{ setValue: SetAdjustValue }> = ({ setValue }, ...rest) => {
	const handleNumber = (number: number) => {
		setValue((value?: number) => parseInt(`${value || ""}${number}`, 10))
	}
	const handleBack = () =>
		setValue((value?: number) => Math.trunc((value || 0) / 10) || NaN)

	return (
		<NumberPadWrapper className="NumberPad" {...rest}>
			<Box gridColumn="4" gridRow="1/4">
				<ActionButton
					aria-label="backspace"
					width="100%"
					onClick={handleBack}
					icon={<TiBackspace />}
				/>
			</Box>

			{[7, 8, 9, 4, 5, 6, 1, 2, 3, 0].map((number) => (
				<Button
					key={number}
					variant="solid"
					size="sm"
					fontSize="lg"
					onClick={() => handleNumber(number)}
				>
					{number}
				</Button>
			))}
		</NumberPadWrapper>
	)
}

const NumberPadWrapper = styled.div`
	display: grid;
	grid-auto-flow: dense;
	grid-template-columns: repeat(4, 1fr);
	width: 100%;
	margin: auto;
	gap: var(--chakra-sizes-1);

	button:last-of-type {
		grid-column: 2;
	}
`

const ActionButton: FC<IconButtonProps> = (props) => (
	<IconButton
		variant="solid"
		size="sm"
		fontSize="lg"
		gridColumn={4}
		{...props}
	/>
)

export default NumberPad
