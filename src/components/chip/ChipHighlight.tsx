import { FC } from "react"

import { Box, TagLabelProps } from "@chakra-ui/react"
import { css } from "@emotion/react"

import { useChipStyles } from "../chip"

interface ChipHighlightProps extends TagLabelProps {
	wonky?: boolean
}
const ChipHighlight: FC<ChipHighlightProps> = ({
	children,
	wonky = false,
	...rest
}) => {
	const styles = useChipStyles()

	return (
		<Box
			as="span"
			__css={styles.highlight}
			css={[baseCss, wonky ? wonkyCss : plainCss]}
			{...rest}
		>
			{children && <span>{children}</span>}
		</Box>
	)
}

const baseCss = css`
	display: flex;
	align-items: center;

	clip-path: polygon(
		var(--chakra-space-1) 0,
		125% 0,
		125% 125%,
		0 125%,
		0 100%
	);

	button:active & {
		box-shadow: var(--chakra-shadows-depth-shallow-highlight);
	}

	[disabled] & {
		box-shadow: none;
	}
`

const plainCss = css`
	padding: 0 var(--chakra-space-2);

	span {
		font-size: var(--chakra-fontSizes-lg);
		height: 1em;
		line-height: 1;
	}
`

const wonkyCss = css`
	font-size: 0.6em;

	width: 1.5em;

	padding: 0 var(--chakra-space-1) 0 0.1rem;

	span {
		width: 2rem;
		margin-left: 0.05rem;

		transform: rotateZ(-80deg);
		transform-origin: 0.55rem center;

		text-align: center;
	}
`

export default ChipHighlight
