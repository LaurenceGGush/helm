import { forwardRef } from "react"

import { Button, ButtonGroup, Flex, Icon } from "@chakra-ui/react"
import styled from "@emotion/styled"
import { BsCheckCircle } from "react-icons/bs"

import useFileMeta from "../../hooks/useFileMeta"
import useHeaters from "../../hooks/useHeaters"
import usePrinter from "../../hooks/usePrinter"
import {
	useBedTemperature,
	useExtruderTemperature,
} from "../../hooks/useSendGcodes"
import { GcodeProps } from "./Gcode"
import GcodeImage from "./GcodeImage"

/**
 * Gcode preheat, print, and thumbnail
 */
const GcodePop = forwardRef<HTMLButtonElement, GcodeProps>(({ gcode }, ref) => {
	const printer = usePrinter()
	const heaters = useHeaters()
	const setExtruderTemp = useExtruderTemperature()
	const setBedTemp = useBedTemperature()

	const {
		first_layer_bed_temp = 0,
		first_layer_extr_temp = 0,
		thumbnails,
	} = useFileMeta(gcode.path)
	const thumb = thumbnails && thumbnails[0]

	const handlePreheatBed = () => {
		setBedTemp(first_layer_bed_temp)
	}

	const handlePreheatExtruder = (extruder: number) => {
		setExtruderTemp(first_layer_extr_temp, extruder)
	}

	const onTargetColor = "red.400"

	return (
		<Flex className="GcodePop" gap={1} width="100%">
			<PopButtons>
				{heaters?.extruders?.length > 1 ? (
					<PreheatGroup>
						{heaters?.extruders?.map((heater, extruder) => (
							<PreheatButton
								key={extruder}
								size="xs"
								onClick={() => handlePreheatExtruder(extruder)}
							>
								E{extruder}-{first_layer_extr_temp}
								<Icon
									ml={1}
									as={BsCheckCircle}
									color={
										heater.target === first_layer_extr_temp
											? onTargetColor
											: "inherit"
									}
								/>
							</PreheatButton>
						))}

						<PreheatButton size="xs" onClick={handlePreheatBed}>
							B-{first_layer_bed_temp}
							<Icon
								ml={1}
								as={BsCheckCircle}
								color={
									heaters.beds[0].target ===
									first_layer_bed_temp
										? onTargetColor
										: "inherit"
								}
							/>
						</PreheatButton>
					</PreheatGroup>
				) : (
					<Button maxWidth="100%" size="sm">
						E-{first_layer_extr_temp}
						<Icon
							ml={1}
							as={BsCheckCircle}
							color={
								heaters?.extruders?.pop()?.target ===
								first_layer_extr_temp
									? onTargetColor
									: "inherit"
							}
						/>
						&nbsp; B-{first_layer_bed_temp}
						<Icon
							ml={1}
							as={BsCheckCircle}
							color={
								heaters?.beds?.pop()?.target ===
								first_layer_bed_temp
									? onTargetColor
									: "inherit"
							}
						/>
					</Button>
				)}

				<Button
					ref={ref}
					display="block"
					fontFamily="heading"
					mt={2}
					mb={1}
					onClick={() => printer.start(gcode.path)}
				>
					Print
				</Button>
			</PopButtons>

			<PreviewImage path={thumb?.relative_path} />
		</Flex>
	)
})
GcodePop.displayName = "GcodePop"

const PopButtons = styled.div`
	width: 50%;
`

const PreviewImage = styled(GcodeImage)`
	flex-grow: 1;
	height: 100%;

	margin: 0;
`

const PreheatGroup = styled(ButtonGroup)`
	display: flex;
	flex-wrap: wrap;
	gap: var(--chakra-space-0-5);
`

const PreheatButton = styled(Button)`
	flex-grow: 1;
	width: 33%;

	margin: 0 !important;
`

export default GcodePop
