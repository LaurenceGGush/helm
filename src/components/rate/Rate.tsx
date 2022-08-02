import { CSSProperties, FC } from "react"

import { TagProps, useColorModeValue, useToken } from "@chakra-ui/react"
import { css } from "@emotion/react"
import styled from "@emotion/styled"
import { IconType } from "react-icons"
import { IoIosAirplane } from "react-icons/io"

import { landscape } from "../../theme/medias"
import { shadow } from "../../theme/shadows"
import { blendHexColours, HexColour } from "../../utilities/colours"
import { Chip, ChipHighlight, ChipIcon } from "../chip"

export interface RateProps extends TagProps {
	/**
	 * Icon
	 */
	icon: IconType
	/**
	 * Value to display
	 */
	rate: number
	/**
	 * Nominal value
	 */
	nominal: number
	/**
	 * Highlight colour
	 */
	highlight?: HexColour
	/**
	 * Disabled
	 */
	isDisabled?: boolean
	/**
	 * Can be collapsed to a small size in landscape orientation
	 */
	smallable?: boolean
}
/**
 * Display a value with an icon and highlighting when value is not nominal
 */
const Rate: FC<RateProps> = ({
	icon = IoIosAirplane,
	rate = 1,
	nominal = 1,
	highlight = "#6495ED",
	isDisabled,
	smallable,
	css,
	...rest
}) => {
	const [gray300, gray600] = useToken("colors", ["gray.300", "gray.600"])
	const nominalColour = useColorModeValue(gray300, gray600) as `#${string}`
	const activeColour = rate !== nominal ? highlight : nominalColour
	const activeDepthColour = blendHexColours(activeColour, "#000", 0.25)

	const customProperties = {
		"--right-percent": 100 - rate * 100 + "%",
		"--active-colour": activeColour,
		"--active-depth-colour": activeDepthColour,
		"--shadow-active": shadow("--active-depth-colour", false),
	} as CSSProperties

	return (
		<Chip
			disabled={isDisabled}
			style={customProperties}
			className={`Rate${smallable ? " smallable" : ""}`}
			css={[rateCss, css]}
			{...rest}
		>
			<ChipIcon as={icon} css={iconCss} />

			<TheRate>
				<span>
					{(rate * 100).toFixed(0)}
					{/* <small>%</small> */}
				</span>
			</TheRate>
		</Chip>
	)
}

const rateCss = css`
	${landscape} {
		&.smallable {
			align-items: center;
			justify-content: center;
			padding: 0;
			aspect-ratio: 1/1;
		}
	}
`

const iconCss = css`
	z-index: 10;
	height: auto;
	margin-right: 0.25rem;

	font-size: var(--chakra-fontSizes-sm);

	${landscape} {
		.smallable & {
			margin: 0;
		}
	}
`

const TheRate = styled(ChipHighlight)`
	background: var(--active-colour);

	box-shadow: var(--shadow-active);
	[disabled] & {
		box-shadow: none;
	}

	${landscape} {
		.smallable & {
			position: absolute;
			z-index: 0;

			padding: 0;
			inset: 0 var(--right-percent) 0 0;

			clip-path: none;

			span {
				display: none;
			}
		}
	}
`

export default Rate
