import { useState } from "react"

import { Flex, Grid, Text } from "@chakra-ui/react"
import { FiChevronsDown, FiChevronsUp } from "react-icons/fi"

import LabelWithUnits from "../../components/labelWithUnits"
import PushButtons from "../../components/pushButtons"
import StackButton from "../../components/stackButton"
import usePrinter from "../../hooks/usePrinter"
import { useGcodeOffsets } from "../../hooks/usePrinterStatus"

const distances = [0.01, 0.05, 0.1, 0.5]

const BabyStepping = () => {
	const printer = usePrinter()
	const gcodeOffsets = useGcodeOffsets()

	const [distance, setDistance] = useState<number>(distances[1])

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
				value={distance}
				updateValue={(distance) => setDistance(distance)}
				options={distances.map((distance) => ({
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
				<StackButton
					onClick={() => printer.adjustOffset(distance, "Z")}
				>
					<FiChevronsUp />
				</StackButton>
				<StackButton
					onClick={() => printer.adjustOffset(-distance, "Z")}
				>
					<FiChevronsDown />
				</StackButton>
			</Flex>
		</Grid>
	)
}

export default BabyStepping
