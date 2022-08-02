import { FC, memo, useEffect, useState } from "react"

import { Button, ButtonProps, Flex, Grid, Icon, Text } from "@chakra-ui/react"
import { css } from "@emotion/react"
import styled from "@emotion/styled"
import {
	FiChevronsDown,
	FiChevronsUp,
	FiMaximize2,
	FiMinimize2,
} from "react-icons/fi"
import { RiHomeLine } from "react-icons/ri"

import LabelWithUnits from "../../components/labelWithUnits"
import PushButtons from "../../components/pushButtons"
import StackButton from "../../components/stackButton"
import usePrinter from "../../hooks/usePrinter"
import {
	useAvailableMacros,
	useGcodeOffsets,
	useHomed,
	usePrintingOrPaused,
} from "../../hooks/usePrinterStatus"
import { logger } from "../../utilities/logger"

const rotateSizes = (state: number) => {
	switch (state) {
		case 0:
			return 1
		case 1:
			return 2
		case 2:
			return 0
		default:
			return 0
	}
}

/**
 * Manual movement and homing controls
 *
 * During printing displays Z axis baby stepping controls
 */
const Move = () => {
	const { printingOrPaused } = usePrintingOrPaused()

	useEffect(() => logger.info("move"))

	return printingOrPaused ? <BabyStepping /> : <CrossMove />
}

const babyStepDistances = [0.01, 0.05, 0.1, 0.5]
const BabyStepping = () => {
	const printer = usePrinter()
	const gcodeOffsets = useGcodeOffsets()

	const [step, setStep] = useState<number>(babyStepDistances[1])

	return (
		<Grid
			className="Move BabyStepping"
			gridTemplateColumns="repeat(5,1fr)"
			gridTemplateRows="repeat(2,1fr)"
			gap="0 var(--chakra-space-2)"
		>
			<PushButtons<number>
				gridRow="1"
				gridColumn="1/5"
				stretch
				value={step}
				updateValue={(distance) => setStep(distance)}
				options={babyStepDistances.map((distance) => ({
					label: <LabelWithUnits label={distance} units="mm" />,
					value: distance,
				}))}
			/>

			<Text
				gridRow="2"
				gridColumn="1/5"
				alignSelf="center"
				textAlign="center"
				width="100%"
				fontSize="lg"
			>
				Z Offset: {gcodeOffsets[2].toFixed(2)}
			</Text>

			<Flex
				gridRow="1/3"
				gridColumn="5"
				flexDirection="column"
				height="100%"
			>
				<StackButton onClick={() => printer.adjustOffset(step, "Z")}>
					<FiChevronsUp />
				</StackButton>
				<StackButton onClick={() => printer.adjustOffset(-step, "Z")}>
					<FiChevronsDown />
				</StackButton>
			</Flex>
		</Grid>
	)
}

const CrossMove = () => {
	const printer = usePrinter()
	const homed = useHomed()
	const { init } = useAvailableMacros()

	const [stepSize, setStepSize] = useState(0)

	const distances = [
		[100, 10],
		[1, 0.1],
		[0.1, ".01"],
	]

	const fontSizes = ["md", "sm", "md"]

	useEffect(() => logger.info("crossmove"))

	return (
		<CrossMoveWrapper className="Move CrossMove">
			<ControlButton
				onClick={() => (init ? printer.init() : printer.home())}
			>
				<Icon as={RiHomeLine} />
			</ControlButton>
			<ControlButton
				gridRow={1}
				gridColumn={4}
				fontSize={fontSizes[stepSize]}
				onClick={() => setStepSize(rotateSizes)}
			>
				<Icon as={stepSize === 2 ? FiMaximize2 : FiMinimize2} />
			</ControlButton>

			<YButton
				disabled={!homed.y}
				onClick={() => printer.moveBy(distances[stepSize][0], "Y")}
			>
				{distances[stepSize][0]}
			</YButton>
			<DownButton
				disabled={!homed.y}
				onClick={() => printer.moveBy(distances[stepSize][1], "Y")}
			>
				{distances[stepSize][1]}
			</DownButton>

			<XButton
				disabled={!homed.x}
				onClick={() => printer.moveBy(-distances[stepSize][0], "X")}
			>
				{distances[stepSize][0]}
			</XButton>
			<RightButton
				disabled={!homed.x}
				onClick={() => printer.moveBy(-distances[stepSize][1], "X")}
			>
				{distances[stepSize][1]}
			</RightButton>

			<UpButton
				disabled={!homed.y}
				onClick={() => printer.moveBy(-distances[stepSize][1], "Y")}
			>
				{distances[stepSize][1]}
			</UpButton>
			<YButton
				disabled={!homed.y}
				onClick={() => printer.moveBy(-distances[stepSize][0], "Y")}
			>
				{distances[stepSize][0]}
			</YButton>

			<LeftButton
				disabled={!homed.x}
				onClick={() => printer.moveBy(distances[stepSize][1], "X")}
			>
				{distances[stepSize][1]}
			</LeftButton>
			<XButton
				disabled={!homed.x}
				onClick={() => printer.moveBy(distances[stepSize][0], "X")}
			>
				{distances[stepSize][0]}
			</XButton>

			<Zeds>
				{distances[stepSize].map((distance) => (
					<ControlButton
						key={distance}
						disabled={!homed.z}
						onClick={() => printer.moveBy(-distance, "Z")}
					>
						{distance}
					</ControlButton>
				))}
				{distances[stepSize]
					.slice()
					.reverse()
					.map((distance) => (
						<ControlButton
							key={distance}
							disabled={!homed.z}
							onClick={() => printer.moveBy(distance, "Z")}
						>
							{distance}
						</ControlButton>
					))}
			</Zeds>

			<ControlButton onClick={() => printer.turnOffMotors()}>
				M84
			</ControlButton>
		</CrossMoveWrapper>
	)
}

const CrossMoveWrapper = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr 2vmin 1fr;
	grid-template-rows: 1fr 0.6fr 1fr 0.6fr 1fr;
	width: calc(100vmin - 0.5rem);
	max-width: min(15rem, 100%);
	margin: 0 auto;
	aspect-ratio: 1.2;
	gap: 2vmin;
`

const Zeds = styled.div`
	display: flex;
	grid-column: 6;
	grid-row: 1/6;
	flex-direction: column;
	gap: 2vmin;
`

const ControlButton: FC<ButtonProps> = (props) => (
	<Button
		variant="depthDrop"
		zIndex="10"
		minWidth="0"
		height="100%"
		padding="0"
		{...props}
	/>
)

const XButton = styled(ControlButton)`
	grid-row: 3;
`

const YButton = styled(ControlButton)`
	grid-column: 2/4;
	width: 50%;
	margin: 0 auto;
`

const arrow = css`
	&::after {
		content: "";

		position: absolute;
		z-index: -1;
		width: 75%;
		height: auto;

		border-radius: var(--chakra-radii-md);

		/* background: lightgray; */
		background: inherit;
		aspect-ratio: 1;
	}
`

const DownButton = styled(YButton)`
	align-items: flex-end;
	height: 100%;

	line-height: 0.65;

	${arrow}

	&::after {
		transform: translate(0, 37%) rotate(45deg);

		border-top-left-radius: 100%;
	}
`

const UpButton = styled(YButton)`
	align-items: flex-start;
	height: 100%;

	line-height: 0.65;

	${arrow}

	&::after {
		transform: translate(0, -37%) rotate(45deg);

		border-bottom-right-radius: 100%;
	}
`

const RightButton = styled(XButton)`
	justify-content: flex-end;
	width: 60%;
	margin-right: 40%;
	padding: 0;

	${arrow}

	&::after {
		width: auto;
		height: 75%;

		transform: translate(37%, 0) rotate(45deg);

		border-bottom-left-radius: 100%;
	}
`

const LeftButton = styled(XButton)`
	justify-content: flex-start;
	width: 60%;
	margin-left: 40%;
	padding: 0;

	${arrow}

	&::after {
		width: auto;
		height: 75%;

		transform: translate(-37%, 0) rotate(45deg);

		border-top-right-radius: 100%;
	}
`

export default memo(Move)
