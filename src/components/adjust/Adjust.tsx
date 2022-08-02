import {
	Dispatch,
	FC,
	SetStateAction,
	useCallback,
	useMemo,
	useReducer,
	useState,
} from "react"

import { Box } from "@chakra-ui/react"
import styled from "@emotion/styled"
import { BiCircle } from "react-icons/bi"
import { RiKeyboardLine } from "react-icons/ri"

import useOrientation from "../../hooks/useOrientation"
import SlideIcon from "../../icons/Slide"
import { landscape } from "../../theme/medias"
import debounce from "../../utilities/debounce"
import { logger } from "../../utilities/logger"
import Knob from "../knob"
import NumberPad from "../numberpad"
import type { PushButtonOption } from "../pushButtons"
import PushButtons from "../pushButtons"
import Slide from "../slide"
import AdjusterIO from "./AdjusterIO"

/**
 * UI to use to adjust value
 */
type Adjuster = "slide" | "knob" | "pad"

type AdjustValueAction = {
	arg: SetValueArg
	placeholder?: boolean
}

export interface AdjustProps {
	/**
	 * Display name
	 */
	name: string
	/**
	 * Placeholder to use when no value set, defaults to 0
	 */
	placeholder?: number
	/**
	 * Lower bound for the range slider, defaults to 0
	 */
	min?: number
	/**
	 * Cap for all inputs, defaults to 100
	 */
	max?: number
	/**
	 * Nominal value to reset to, defaults to 0
	 */
	nominal?: number
	/**
	 * Nominal button title, defaults to "Reset"
	 */
	nominalTitle?: string
	/**
	 * Called to close adjustment
	 */
	onClose: () => void
	/**
	 * Update handler, will be called to update value
	 */
	onUpdate: (value: number) => void
	/**
	 * Call onUpdate on every change
	 */
	updateOnChange?: boolean
	/**
	 * Starting adjuster type, defaults to 'slide'
	 */
	type?: Adjuster
}
/**
 * Adjust temperatures, speeds and feeds values intuitive controls
 *
 * Slider allows for rapid adjustment of values with Knob and Number Pad providing more fine grained adjustment
 */
const Adjust: FC<AdjustProps> = ({
	name,
	placeholder = 0,
	min = 0,
	max = 100,
	nominal = 0,
	nominalTitle = "Reset",
	onUpdate,
	onClose,
	updateOnChange = false,
	type = "slide",
	...rest
}) => {
	const debouncedUpdate = useMemo(
		() =>
			debounce((value: number) => {
				onUpdate(value)
			}),
		[onUpdate],
	)
	const adjustValueReducer = useCallback(
		(previous: number | undefined, action: AdjustValueAction) => {
			let initialValue = previous

			if (action.placeholder && typeof initialValue !== "number") {
				initialValue = placeholder
			}

			let newValue: number | undefined
			if (typeof action.arg === "function") {
				newValue = action.arg(initialValue)
			} else {
				newValue = action.arg
			}

			if (typeof newValue === "undefined" || isNaN(newValue)) {
				return undefined
			}

			if (typeof newValue !== "number") {
				return previous
			}

			const clampedValue = Math.min(max, Math.max(0, newValue))

			if (updateOnChange) {
				debouncedUpdate(clampedValue)
			}

			return clampedValue
		},
		[debouncedUpdate, max, placeholder, updateOnChange],
	)
	const [value, dispatch] = useReducer(adjustValueReducer, undefined)

	const setMaxValue = useCallback((arg: SetValueArg) => dispatch({ arg }), [])
	const setPlaceholderMaxValue = useCallback(
		(arg: SetValueArg) => dispatch({ arg, placeholder: true }),
		[],
	)

	const [adjuster, setAdjuster] = useState<Adjuster>(type)

	const orientation = useOrientation()

	const handleTick = () => onUpdate && value && onUpdate(value)

	const handleNominal = () => onUpdate && onUpdate(nominal)

	const adjustProps = {
		placeholder,
		value,
		setValue: setPlaceholderMaxValue,
	}
	const renderAdjuster = () => {
		switch (adjuster) {
			case "slide":
				return <Slide min={min} max={max} {...adjustProps} />
			case "knob":
				return <Knob {...adjustProps} />
			case "pad":
				return <NumberPad setValue={setMaxValue} />
			default:
				return null
		}
	}

	const adjustOptions = useMemo(() => {
		const options: PushButtonOption<Adjuster>[] = [
			{ icon: SlideIcon, value: "slide" },
			{ icon: BiCircle, value: "knob" },
		]
		if (!updateOnChange) {
			options.push({ icon: RiKeyboardLine, value: "pad" })
		}

		return options
	}, [updateOnChange])

	logger.info("adjust")

	return (
		<AdjustWrapper className="Adjust" {...rest}>
			<AdjusterIO
				name={name}
				placeholder={placeholder}
				value={value}
				setValue={setPlaceholderMaxValue}
				nominal={nominal}
				nominalTitle={nominalTitle}
				updateOnChange={updateOnChange}
				handleTick={handleTick}
				handleClose={onClose}
				handleNominal={handleNominal}
			/>

			<AdjustInner>
				{renderAdjuster()}

				<AdjusterPushButtons<Adjuster>
					size="sm"
					vertical={orientation === "landscape"}
					options={adjustOptions}
					value={adjuster}
					updateValue={setAdjuster}
				/>
			</AdjustInner>
		</AdjustWrapper>
	)
}

type SetValueArg = number | undefined | SetStateAction<number | undefined>
export type SetAdjustValue = Dispatch<SetValueArg>

const AdjustWrapper = styled(Box)`
	display: flex;
	flex-direction: column;
	align-items: space-between;
	gap: var(--chakra-sizes-2);

	height: 100%;

	margin-bottom: var(--chakra-space-1);

	background: var(--chakra-colors-background);

	${landscape} {
		justify-content: space-between;
		height: 100%;
	}
`

const AdjustInner = styled(Box)`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	gap: var(--chakra-sizes-2);

	width: 100%;
	height: 100%;
	min-height: 0;

	${landscape} {
		flex-direction: row;
		margin-bottom: var(--chakra-sizes-2);
	}
`

const AdjusterPushButtons = styled(PushButtons)`
	margin: 0 auto;

	${landscape} {
		max-height: 40vh;
		margin: auto 0;
	}
` as typeof PushButtons

export default Adjust
