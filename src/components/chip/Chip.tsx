import { FC } from "react"

import {
	Tag,
	TagLabel,
	TagLabelProps,
	TagLeftIcon,
	TagProps,
} from "@chakra-ui/react"
import { createStylesContext, useMultiStyleConfig } from "@chakra-ui/system"
import { css } from "@emotion/react"
import styled from "@emotion/styled"

const [ChipStylesProvider, useChipStyles] = createStylesContext("Chip")
export { useChipStyles }

interface ChipProps extends TagProps {
	disabled?: boolean
}
export const Chip: FC<ChipProps> = ({ css, children, ...rest }) => {
	const styles = useMultiStyleConfig("Tag", rest)

	return (
		<Tag
			as="button"
			variant="depth"
			css={[chipCss, css]}
			fontSize="xl"
			{...rest}
		>
			<ChipStylesProvider value={styles}>{children}</ChipStylesProvider>
		</Tag>
	)
}
const chipCss = css`
	position: relative;
	align-items: stretch;

	min-width: 0;
	margin: 0 0 var(--chakra-space-0-5) 0;
	padding-right: 0;
	padding-left: var(--chakra-space-2);

	&[disabled] {
		opacity: 0.5;

		cursor: not-allowed;
	}
`

export const ChipIcon = styled(TagLeftIcon)`
	height: auto;
	margin-right: var(--chakra-space-1);

	color: var(--colour-power);
	font-size: var(--chakra-fontSizes-sm);
`

export const ChipLabel: FC<TagLabelProps> = ({ children, css, ...rest }) => (
	<TagLabel css={[labelCss, css]} {...rest}>
		<span>{children}</span>
	</TagLabel>
)
const labelCss = css`
	display: flex;
	align-items: center;

	padding-top: 0.3rem;
	padding-right: var(--chakra-space-1);
	padding-bottom: 0.266rem;

	color: var(--colour-current-temp);

	span {
		height: 1rem;

		line-height: 0.7;
	}
`
