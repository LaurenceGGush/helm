import { FC, ReactNode } from "react"

import { Text } from "@chakra-ui/react"

const LabelWithUnits: FC<{ label: ReactNode; units: string }> = ({
	label,
	units,
}) => (
	<>
		<Text as="span" lineHeight="0.75">
			{label}
		</Text>
		<Text as="span" lineHeight="0.75" fontSize="xs" color="gray.500">
			{units}
		</Text>
	</>
)

export default LabelWithUnits
