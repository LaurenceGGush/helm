import { memo, ReactNode } from "react"

import {
	Button,
	ButtonGroup,
	ButtonGroupProps,
	createIcon,
	Flex,
	Icon,
} from "@chakra-ui/react"
import { css } from "@emotion/react"
import { IconType } from "react-icons"

export interface PushButtonOption<TValue> {
	label?: ReactNode
	icon?: IconType | ReturnType<typeof createIcon>
	value: TValue
}

export interface PushButtonsProps<TValue> extends ButtonGroupProps {
	value: TValue
	updateValue: (v: TValue) => void
	/**
	 * Vertically stack the buttons
	 */
	vertical?: boolean
	/**
	 * Stretch the buttons horizontally to fill space
	 */
	stretch?: boolean
	options: PushButtonOption<TValue>[]
}

/**
 * Creates a group of buttons that work like radio buttons
 */
const PushButtons = <T extends string | number | undefined>({
	value,
	updateValue,
	vertical = false,
	stretch = false,
	options,
	fontSize,
	...rest
}: PushButtonsProps<T>) => {
	return (
		<ButtonGroup
			className="PushButtons"
			isAttached
			css={[vertical && verticalCss, stretch && stretchCss]}
			{...rest}
		>
			{options.map((option) => {
				const selected = value === option.value

				return (
					<Button
						key={option.value}
						onClick={() => updateValue(option.value)}
						className={selected ? "selected" : ""}
						fontSize={fontSize}
						css={[buttonCss, vertical && verticalButtonCss]}
					>
						{option.label && (
							<Flex
								flexDirection="column"
								justifyContent="center"
								as="span"
								width={stretch ? "10" : "auto"}
								textAlign="center"
								height="100%"
							>
								{option.label}
							</Flex>
						)}
						{option.icon && <Icon as={option.icon} />}
					</Button>
				)
			})}
		</ButtonGroup>
	)
}

const verticalCss = css`
	flex-direction: column;

	margin: auto 0;
`

const stretchCss = css`
	width: 100%;
`

const buttonCss = css`
	flex-grow: 1;

	z-index: 100;

	&.selected,
	&:active {
		background: var(--chakra-colors-active-bg);
		box-shadow: var(--chakra-shadows-depth-shallow);
		z-index: var(--chakra-zIndices-base);
	}

	&.selected {
		background: var(--chakra-colors-active-bg);
		transform: translateY(0);
		z-index: 10;
	}

	& ~ & {
		clip-path: polygon(-1px -50%, -1px 150%, 150% 150%, 150% -50%);
	}

	&.selected + &,
	&:active + & {
		clip-path: none;
	}
`

const verticalButtonCss = css`
	margin-top: -0.1em;
	margin-left: 0;

	&:first-of-type:not(:last-of-type) {
		margin-top: 0;

		border-radius: var(--chakra-radii-md) var(--chakra-radii-md) 0 0;
	}

	&:last-of-type:not(:first-of-type) {
		border-radius: 0 0 var(--chakra-radii-md) var(--chakra-radii-md);
	}

	& ~ & {
		clip-path: polygon(-50% -1px, -50% 150%, 150% 150%, 150% -1px);
	}
`

export default memo(PushButtons) as typeof PushButtons
