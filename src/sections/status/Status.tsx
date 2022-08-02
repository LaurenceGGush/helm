import { CSSProperties, FC, memo, useEffect } from "react"

import { Box, BoxProps, Flex } from "@chakra-ui/react"
import { css } from "@emotion/react"
import styled from "@emotion/styled"
import { BiTachometer } from "react-icons/bi"
import { FiSquare } from "react-icons/fi"
import { RiRefreshLine } from "react-icons/ri"
import { WiStrongWind } from "react-icons/wi"

import Rate from "../../components/rate"
import Temperature from "../../components/temperature"
import useAdjustMachine from "../../hooks/useAdjustMachine"
import useHeaters from "../../hooks/useHeaters"
import { usePrinterReady } from "../../hooks/usePrinterInfo"
import { useSpeedsAndFeeds } from "../../hooks/usePrinterStatus"
import {
	useBedTemperature,
	useExtruderTemperature,
	useFanSpeed,
	useFeedRate,
	useFlowRate,
} from "../../hooks/useSendGcodes"
import Nozzle from "../../icons/Nozzle"
import { landscape } from "../../theme/medias"
import { logger } from "../../utilities/logger"

/**
 * Displays printer temperature and speeds and feeds status.
 *
 * Buttons open adjustments.
 */
const Status: FC<BoxProps> = (props) => {
	const { extruders } = useHeaters()
	const customProperties = {
		"--stat-height": extruders.length < 4 ? "12vh" : "9.5vh",
	} as CSSProperties

	return (
		<StatusWrapper className="Status" sx={customProperties} {...props}>
			<HeatersStatus />
			<SpeedsAndFeedsStatus />
		</StatusWrapper>
	)
}

export const HeatersStatus: FC<BoxProps> = (props) => {
	const { printerReady } = usePrinterReady()
	const { extruders, beds } = useHeaters()
	const setExtruderTemp = useExtruderTemperature()
	const setBedTemp = useBedTemperature()
	const bed = beds[0]
	const { adjuster, updateAdjuster, closeAdjuster } = useAdjustMachine()

	const handleExtruderTemp = (extruder: number) => (temperature: number) => {
		setExtruderTemp(temperature, extruder)
		closeAdjuster()
	}

	const handleBedTemp = (temperature: number) => {
		setBedTemp(temperature)
		closeAdjuster()
	}

	const statusItemDisabled = (id: string) =>
		!printerReady || (!!adjuster?.id && adjuster?.id !== id)

	useEffect(() => logger.info("heaters"))

	if (extruders.length && bed) {
		return (
			<StatusRow className="HeatersStatus" {...props}>
				{extruders.map((heater, extruder) => (
					<Temperature
						key={heater.id}
						icon={Nozzle}
						current={heater.temperature}
						range={{ min: 30, max: 260 }}
						target={heater.target}
						power={heater.power}
						isDisabled={statusItemDisabled(heater.id)}
						onClick={() =>
							updateAdjuster({
								id: heater.id,
								props: {
									name: `E${extruder}`,
									placeholder: heater.target,
									min: 180,
									max: 300,
									nominalTitle: "Cool",
									// extruder or array index, same same
									onUpdate: handleExtruderTemp(extruder),
								},
							})
						}
						minHeight="0"
						maxHeight="var(--stat-height)"
					/>
				))}

				<BedWrapper>
					<Temperature
						key={bed.id}
						mt={1}
						icon={FiSquare}
						current={bed.temperature}
						range={{ min: 30, max: 100 }}
						target={bed.target}
						power={bed.power}
						isDisabled={statusItemDisabled(bed.id)}
						onClick={() =>
							updateAdjuster({
								id: bed.id,
								props: {
									name: `HB`,
									placeholder: bed.target,
									min: 20,
									max: 123,
									nominalTitle: "Cool",
									onUpdate: handleBedTemp,
								},
							})
						}
						minHeight="0"
						maxHeight="var(--stat-height)"
					/>
				</BedWrapper>
			</StatusRow>
		)
	}

	return <></>
}

const SpeedsAndFeedsStatus = memo(() => {
	const { printerReady } = usePrinterReady()
	const { speed_factor, extrude_factor, fan_speed } = useSpeedsAndFeeds()
	const { adjuster, closeAdjuster, updateAdjuster } = useAdjustMachine()

	const setFeedRate = useFeedRate()
	const setFlowRate = useFlowRate()
	const setFanSpeed = useFanSpeed()

	const handleFeedRate = (rate: number) => {
		setFeedRate(rate)
		closeAdjuster()
	}

	const handleFlowRate = (rate: number) => {
		setFlowRate(rate)
		closeAdjuster()
	}
	const handleFanSpeed = (speed: number) => {
		setFanSpeed(speed)
	}

	const statusItemDisabled = (id: string) =>
		!printerReady || (!!adjuster?.id && adjuster?.id !== id)

	useEffect(() => logger.info("speeds"))

	if (!speed_factor || !extrude_factor) {
		return <></>
	}

	return (
		<FeedsAndSpeedsRow className="SpeedsAndFeedsStatus" mt={1}>
			<Rate
				icon={BiTachometer}
				highlight="#ffa07a"
				rate={speed_factor}
				nominal={1}
				isDisabled={statusItemDisabled("speed")}
				smallable
				onClick={() =>
					updateAdjuster({
						id: "speed",
						props: {
							name: "Feed",
							placeholder: speed_factor * 100,
							min: 5,
							max: 200,
							nominal: 100,
							onUpdate: handleFeedRate,
						},
					})
				}
				css={rateCss}
			/>

			<Rate
				icon={WiStrongWind}
				highlight="#5f9ea0"
				rate={extrude_factor}
				nominal={1}
				isDisabled={statusItemDisabled("extrude")}
				smallable
				onClick={() =>
					updateAdjuster({
						id: "extrude",
						props: {
							name: "Flow",
							placeholder: extrude_factor * 100,
							min: 5,
							max: 200,
							nominal: 100,
							onUpdate: handleFlowRate,
						},
					})
				}
				css={rateCss}
			/>

			<Rate
				icon={RiRefreshLine}
				rate={fan_speed}
				nominal={0}
				isDisabled={statusItemDisabled("fan")}
				onClick={() =>
					updateAdjuster({
						id: "fan",
						props: {
							name: "Fan",
							placeholder: Math.round(fan_speed * 100),
							max: 100,
							onUpdate: handleFanSpeed,
							updateOnChange: true,
						},
					})
				}
				css={rateCss}
			/>
		</FeedsAndSpeedsRow>
	)
})
SpeedsAndFeedsStatus.displayName = "SpeedsAndFeedsStatus"

const rateCss = css`
	${landscape} {
		min-height: min(1.5rem, var(--stat-height));
		max-height: var(--stat-height);
	}
`

const StatusWrapper = styled(Box)`
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: space-between;
`

const StatusRow = styled(Box)`
	display: flex;
	position: relative;
	z-index: 100;
	flex-wrap: wrap;
	align-content: flex-start;
	justify-content: space-between;
	width: 100%;
	gap: var(--chakra-sizes-1);

	${landscape} {
		justify-content: end;
	}
`

const FeedsAndSpeedsRow = styled(StatusRow)`
	${landscape} {
		flex-wrap: wrap-reverse;
	}
`

const BedWrapper = styled(Flex)`
	justify-content: center;

	&:nth-child(odd) {
		flex-grow: 1;
	}

	${landscape} {
		&:nth-child(odd) {
			flex-grow: 0;
		}
	}
`

export default Status
