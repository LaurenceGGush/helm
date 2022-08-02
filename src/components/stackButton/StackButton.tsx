import { Button } from "@chakra-ui/react"
import styled from "@emotion/styled"

const StackButton = styled(Button)`
	display: flex;

	height: 100%;

	box-sizing: content-box;
	padding: calc(var(--chakra-sizes-1) / 4) 0;

	border-radius: 0;

	&:first-of-type {
		border-radius: var(--chakra-radii-md) var(--chakra-radii-md) 0 0;
	}
	&:last-of-type {
		border-radius: 0 0 var(--chakra-radii-md) var(--chakra-radii-md);
	}
`

export default StackButton
