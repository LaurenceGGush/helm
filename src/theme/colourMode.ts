import { css } from "@emotion/react"

export const colourModeRule = (
	property: string,
	light: string,
	dark: string,
) => css`
	${property}: ${wrapVars(light)};

	.chakra-ui-dark & {
		${property}: ${wrapVars(dark)};
	}
`

const wrapVars = (value: string) =>
	value.slice(0, 2) === "--" ? `var(${value})` : value
