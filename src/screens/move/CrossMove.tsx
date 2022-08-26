import {
	FC,
	memo,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react"

import {
	Box,
	Button,
	ButtonProps,
	Icon,
	Text,
	useOutsideClick,
} from "@chakra-ui/react"
import { css } from "@emotion/react"
import styled from "@emotion/styled"
import { useAtom } from "jotai"
import { IconType } from "react-icons"
import { FiMaximize2, FiMinimize2 } from "react-icons/fi"
import { RiHomeLine } from "react-icons/ri"
import { useLongPress } from "use-long-press"

import PushButtons, { PushButtonOption } from "../../components/pushButtons"
import { useHomingMacros } from "../../hooks/useMacros"
import usePrinter from "../../hooks/usePrinter"
import { useHomed } from "../../hooks/usePrinterStatus"
import { useSendGcode } from "../../hooks/useSendGcodes"
import { homeIsAtom } from "../../store"
import { HomeIs } from "../../store/types"
import { logger } from "../../utilities/logger"

const distances = [
	[100, 10],
	[1, 0.1],
	[0.1, ".01"],
]
const distanceFontSizes = ["md", "sm", "md"]

const CrossMove = () => {
	const printer = usePrinter()
	const sendGcode = useSendGcode()
	const homed = useHomed()
	const homingMacros = useHomingMacros()

	const [homeIs, setHomeIs] = useAtom(homeIsAtom)
	const [selecting, setSelecting] = useState(false)
	const dropDownRef = useRef<HTMLDivElement>(null)

	useOutsideClick({
		ref: dropDownRef,
		handler: () => setSelecting(false),
	})

	const longPress = useLongPress(() => setSelecting(true), {
		onCancel: (event) => {
			if (event.type === "mouseup") {
				sendGcode(homeIs)
			}
		},
		threshold: 250,
	})

	const [stepSize, setStepSize] = useState(0)

	const homingOptions = useMemo(
		() =>
			homingMacros.map((macro) => ({
				label: <HomeLabel macro={macro} />,
				value: macro,
			})),
		[homingMacros],
	) as PushButtonOption<HomeIs>[]

	const handleUpdateHomeIs = useCallback(
		(value: HomeIs) => {
			setHomeIs(value)
			setSelecting(false)
		},
		[setHomeIs],
	)

	useEffect(() => logger.info("crossmove"))

	return (
		<CrossMoveGrid className="Move CrossMove">
			{homingMacros.length > 1 ? (
				<Box
					ref={dropDownRef}
					position="relative"
					gridRow={1}
					gridColumn={1}
				>
					<ControlButton
						display={selecting ? "none" : undefined}
						disabled={selecting}
						width="100%"
						{...longPress()}
					>
						<HomeLabel macro={homeIs} />

						<Box
							position="absolute"
							top={-1}
							right={1}
							lineHeight="1"
							fontSize="sm"
						>
							&hellip;
						</Box>
					</ControlButton>

					{selecting && (
						<PushButtons<HomeIs>
							isAttached
							position="absolute"
							top="0"
							left="0"
							width="100%"
							height="100%"
							options={homingOptions}
							value={homeIs}
							updateValue={handleUpdateHomeIs}
						/>
					)}
				</Box>
			) : (
				<ControlButton onClick={() => sendGcode(homeIs)}>
					<Icon as={RiHomeLine} />
				</ControlButton>
			)}

			{!selecting && (
				<>
					<ControlButton
						gridRow={1}
						gridColumn={4}
						fontSize={distanceFontSizes[stepSize]}
						onClick={() => setStepSize(rotateSizes)}
					>
						<Icon as={stepSize === 2 ? FiMaximize2 : FiMinimize2} />
					</ControlButton>

					<YButton
						disabled={!homed.y}
						onClick={() =>
							printer.moveBy(distances[stepSize][0], "Y")
						}
					>
						{distances[stepSize][0]}
					</YButton>
					<DownButton
						disabled={!homed.y}
						onClick={() =>
							printer.moveBy(distances[stepSize][1], "Y")
						}
					>
						{distances[stepSize][1]}
					</DownButton>

					<XButton
						disabled={!homed.x}
						onClick={() =>
							printer.moveBy(-distances[stepSize][0], "X")
						}
					>
						{distances[stepSize][0]}
					</XButton>
					<RightButton
						disabled={!homed.x}
						onClick={() =>
							printer.moveBy(-distances[stepSize][1], "X")
						}
					>
						{distances[stepSize][1]}
					</RightButton>

					<UpButton
						disabled={!homed.y}
						onClick={() =>
							printer.moveBy(-distances[stepSize][1], "Y")
						}
					>
						{distances[stepSize][1]}
					</UpButton>
					<YButton
						disabled={!homed.y}
						onClick={() =>
							printer.moveBy(-distances[stepSize][0], "Y")
						}
					>
						{distances[stepSize][0]}
					</YButton>

					<LeftButton
						disabled={!homed.x}
						onClick={() =>
							printer.moveBy(distances[stepSize][1], "X")
						}
					>
						{distances[stepSize][1]}
					</LeftButton>
					<XButton
						disabled={!homed.x}
						onClick={() =>
							printer.moveBy(distances[stepSize][0], "X")
						}
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
									onClick={() =>
										printer.moveBy(distance, "Z")
									}
								>
									{distance}
								</ControlButton>
							))}
					</Zeds>

					<ControlButton onClick={() => printer.turnOffMotors()}>
						M84
					</ControlButton>
				</>
			)}
		</CrossMoveGrid>
	)
}

const HomeLabel = memo(({ macro }: { macro: HomeIs }) => {
	if (macro === "G28") {
		return <Icon as={RiHomeLine} />
	}

	if (macro.includes("_")) {
		return (
			<IconWithLabel
				icon={RiHomeLine}
				label={macro
					.split("_")
					.map((p) => p[0])
					.join("")
					.toLocaleUpperCase()}
			/>
		)
	}

	return (
		<IconWithLabel
			icon={RiHomeLine}
			label={macro.slice(0, 2).toLocaleUpperCase()}
		/>
	)
})
HomeLabel.displayName = "HomeLabel"

const CrossMoveGrid = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr 2vmin 1fr;
	grid-template-rows: 1fr 0.6fr 1fr 0.6fr 1fr;
	gap: 2vmin;

	aspect-ratio: 1.2;
	width: calc(100vmin - 0.5rem);
	max-width: min(15rem, 100%);

	margin: 0 auto;
`

const Zeds = styled.div`
	grid-column: 6;
	grid-row: 1/6;

	display: flex;
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
		aspect-ratio: 1;

		background: inherit;

		border-radius: var(--chakra-radii-md);
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

const IconWithLabel: FC<{ icon: IconType; label: string }> = ({
	icon,
	label,
}) => (
	<>
		<Icon as={icon} />
		<Text
			as="span"
			position="absolute"
			width="100%"
			left="0"
			top="65%"
			fontSize="3xs"
			color="gray.500"
		>
			{label}
		</Text>
	</>
)

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

export default CrossMove
