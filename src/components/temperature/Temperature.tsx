import { FC } from "react"

import { TagProps, useColorMode, useColorModeValue } from "@chakra-ui/react"
import styled from "@emotion/styled"
import { IoIosFlame } from "react-icons/io"
import { IconType } from "react-icons/lib"

import Nozzle from "../../icons/Nozzle"
import { shadow } from "../../theme/shadows"
import {
	getTemperatureColour,
	outsideTargetRange,
	warmRgb,
	warmRgba,
} from "../../utilities/temperature"
import { Chip, ChipHighlight, ChipIcon, ChipLabel } from "../chip"
import { FadeInOut } from "../fade"

export interface TemperatureProps extends TagProps {
	/**
	 * Icon
	 */
	icon: IconType | typeof Nozzle
	/**
	 * Value to display
	 */
	current: number
	/**
	 * Likely temperature range, used for highlight colour calculations
	 */
	range: {
		min: number
		max: number
	}
	/**
	 * Target value
	 */
	target: number
	/**
	 * PWM power level, 0 to 1
	 */
	power: number
	/**
	 * Disable control so it isn't clickable
	 */
	isDisabled?: boolean
}
/**
 * Temperature reporting and control
 *
 * Highlight colour changes from blue to red between min and max values
 */
const Temperature: FC<TemperatureProps> = ({
	icon = IoIosFlame,
	current = 0,
	range = { min: 30, max: 300 },
	target = 0,
	power = 0,
	isDisabled,
	...rest
}) => {
	const colourTargetTemp = getTemperatureColour(target, range, "dark")

	const colourTargetTempContrast = getTemperatureColour(
		target,
		range,
		"light",
		0.2,
	)

	const { colorMode } = useColorMode()
	const colourCurrentTemp = getTemperatureColour(current, range, colorMode)

	const customProperties = {
		"--colour-current-temp": "inherit",
		"--colour-target-temp": useColorModeValue(
			"colors.gray.300",
			"colors.gray.600",
		),
	}

	const highlight = target > range.min || current > range.min

	const cssProperties = {
		"--colour-target-temp": !!target && colourTargetTemp,
		"--colour-target-temp-highlight": !!target && colourTargetTempContrast,
		"--chakra-shadows-depth-highlight":
			!!target && shadow("--colour-target-temp-highlight", false),
		"--chakra-shadows-depth-shallow-highlight":
			highlight && shadow("--colour-target-temp-highlight", false, 1),
		"--colour-current-temp": highlight && colourCurrentTemp,
		"--colour-power": (power || target) && warmRgb,
		"--colour-pwm": warmRgba,
		// Power PWM as percent, clamped between 25 and 100
		"--pwm-percent": Math.max(25, Math.min(power * 100, 100)) + "%",
	}

	return (
		<Chip
			className="Temperature"
			as="button"
			variant="depth"
			disabled={isDisabled}
			sx={customProperties}
			css={cssProperties}
			{...rest}
		>
			{!!power && !isDisabled && <Power />}

			<ChipIcon as={icon} />

			<ChipLabel>
				{current ? (
					<>
						{current.toFixed(1)}
						<small>º</small>
					</>
				) : (
					"–⁠"
				)}
			</ChipLabel>

			<Target wonky>
				{!!target && (
					<FadeInOut
						className="test"
						in={!!target && outsideTargetRange(current, target)}
					>
						{target.toFixed(0)}
					</FadeInOut>
				)}
			</Target>
		</Chip>
	)
}

const Power = styled.span`
	position: absolute;
	top: 0;
	left: 0;
	width: var(--pwm-percent);
	height: 100%;

	transform: translateY(var(--chakra-space-depth));

	transition-property: var(--chakra-transition-property-common);
	transition-duration: var(--chakra-transition-duration-faster);

	border-radius: var(--chakra-radii-sm);

	box-shadow: 0 0 0 1px var(--colour-pwm);

	clip-path: polygon(
		var(--chakra-space-depth-minus) var(--chakra-space-depth),
		var(--chakra-space-depth-minus)
			calc(100% + calc(var(--chakra-space-depth) + 1px)),
		calc(100% - var(--chakra-space-depth))
			calc(100% + calc(var(--chakra-space-depth) + 1px)),
		calc(100% - var(--chakra-space-depth)) 0
	);

	button:active & {
		transform: translateY(1px);
	}
`

const Target = styled(ChipHighlight)`
	background: var(--colour-target-temp);
`

export default Temperature
