import { memo, useCallback, useEffect, useMemo, useState } from "react"

import { Box, Button, Flex } from "@chakra-ui/react"
import styled from "@emotion/styled"
import { FiChevronsDown, FiChevronsUp } from "react-icons/fi"

import LabelWithUnits from "../../components/labelWithUnits"
import type { PushButtonOption } from "../../components/pushButtons"
import PushButtons from "../../components/pushButtons"
import StackButton from "../../components/stackButton"
import { useMultiExtruder, useNumExtruders } from "../../hooks/useHeaters"
import { useAvailableMacros } from "../../hooks/useMacros"
import usePrinter from "../../hooks/usePrinter"
import {
	useActiveExtruder,
	useCanExtrude,
	useHomed,
	usePrintingOrPaused,
	useSelectedTool,
} from "../../hooks/usePrinterStatus"
import { useSendGcode } from "../../hooks/useSendGcodes"
import { Moonraker } from "../../moonraker/moonraker"
import { logger } from "../../utilities/logger"

/**
 * Manual tool swap and extrude / retract controls
 */
const Tools = () => {
	const printer = usePrinter()
	const { printingOrPaused } = usePrintingOrPaused()
	const homed = useHomed()
	const numExtruders = useNumExtruders()
	const multiExtruder = useMultiExtruder()
	const currentExtruder = useActiveExtruder()
	const canExtrude = useCanExtrude()
	const selectedTool = useSelectedTool()
	const { nozzle_scrub } = useAvailableMacros()
	const sendGcode = useSendGcode()

	const activateExtruderOptions = useMemo(
		() =>
			[...Array(numExtruders).keys()].map((extruder) => ({
				label: `E${extruder}`,
				value: extruder,
			})),
		[numExtruders],
	)

	const selectToolOptions = useMemo(() => {
		const options = [...Array(numExtruders).keys()].map(
			(tool): PushButtonOption<number | undefined> => ({
				label: `T${tool}`,
				value: tool,
			}),
		)
		options.push({
			label: "D T",
			value: undefined,
		})

		return options
	}, [numExtruders])

	const disableToolChanging = useMemo(
		() => printingOrPaused || !homed.y || !homed.x,
		[homed, printingOrPaused],
	)

	const handleActivateExtruder = useCallback(
		(extruder: number) => printer.extruder(extruder.toString()),
		[printer],
	)

	const handleSelectTool = useCallback(
		(tool: number | undefined) => {
			if (typeof tool === "number") {
				printer.tool(tool.toString())
			} else {
				printer.dropOffTool()
			}
		},
		[printer],
	)

	useEffect(() => logger.info("tools"))

	return (
		<ToolsWrapper className="Tools">
			{multiExtruder && (
				<>
					<PushButtons<number>
						stretch
						size="sm"
						fontSize="md"
						isDisabled={printingOrPaused}
						value={currentExtruder}
						updateValue={handleActivateExtruder}
						options={activateExtruderOptions}
					/>

					<PushButtons<number | undefined>
						stretch
						size="sm"
						fontSize="md"
						mt={2}
						mb={2}
						isDisabled={disableToolChanging}
						value={selectedTool}
						updateValue={handleSelectTool}
						options={selectToolOptions}
					></PushButtons>
				</>
			)}

			<Extrude printer={printer} />

			{nozzle_scrub && (
				<Button
					colorScheme="blue"
					size="sm"
					fontSize="md"
					mt="3vh"
					disabled={!canExtrude}
					onClick={() => sendGcode("NOZZLE_SCRUB")}
				>
					Scrub
				</Button>
			)}
		</ToolsWrapper>
	)
}

const speeds = [1, 2, 5, 10]
const amounts = [1, 5, 10, 50]

/**
 * Distance, speed, extrude and retract controls
 */
const Extrude = memo(({ printer }: { printer: Moonraker }) => {
	const { printingOrPaused } = usePrintingOrPaused()
	const canExtrude = useCanExtrude()
	const [feed, setFeed] = useState(speeds[1])
	const [amount, setAmount] = useState(amounts[1])

	const disableManualExtrude = printingOrPaused || !canExtrude

	const feedOptions = useMemo(
		() =>
			speeds.map((speed) => ({
				label: <LabelWithUnits label={speed} units="mm/s" />,
				value: speed,
			})),
		[],
	)

	const amountOptions = useMemo(
		() =>
			amounts.map((amount) => ({
				label: <LabelWithUnits label={amount} units="mm" />,
				value: amount,
			})),
		[],
	)

	return (
		<>
			<Flex className="Extrude" gap={2}>
				<Box width="50%" flexGrow="1">
					<PushButtons
						stretch
						isDisabled={printingOrPaused}
						value={feed}
						updateValue={setFeed}
						options={feedOptions}
					/>

					<PushButtons
						mt="2vh"
						stretch
						isDisabled={printingOrPaused}
						value={amount}
						updateValue={setAmount}
						options={amountOptions}
					/>
				</Box>

				<Flex flexDirection="column">
					<StackButton
						aria-label="retract"
						isDisabled={disableManualExtrude}
						onClick={() => printer.extrude(-amount, feed)}
					>
						<FiChevronsUp />
					</StackButton>
					<StackButton
						aria-label="extrude"
						isDisabled={disableManualExtrude}
						onClick={() => printer.extrude(amount, feed)}
					>
						<FiChevronsDown />
					</StackButton>
				</Flex>
			</Flex>
		</>
	)
})
Extrude.displayName = "Extrude"

const ToolsWrapper = styled.div`
	max-width: min(15rem, 100%);
	margin: 0 auto;
`

export default memo(Tools)
