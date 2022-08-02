import { FC, SyntheticEvent } from "react"

import {
	Button,
	Flex,
	IconButton,
	Input,
	InputGroup,
	InputLeftAddon,
} from "@chakra-ui/react"
import { IoClose } from "react-icons/io5"
import { TiDelete, TiTick } from "react-icons/ti"

import { SetAdjustValue } from "./Adjust"

interface AdjusterIOProps {
	name: string
	placeholder: number
	value?: number
	setValue: SetAdjustValue
	nominal: number
	nominalTitle: string
	updateOnChange?: boolean
	handleTick?: () => void
	handleClose: () => void
	handleNominal: () => void
}
const AdjusterIO: FC<AdjusterIOProps> = ({
	name,
	placeholder,
	value,
	setValue,
	nominal,
	nominalTitle,
	updateOnChange,
	handleTick,
	handleClose,
	handleNominal,
}) => {
	const handleChange = (event: SyntheticEvent<HTMLInputElement>) => {
		setValue(parseInt(event?.currentTarget?.value))
	}

	const handleClear = () => setValue(NaN)

	return (
		<Flex gap={1}>
			<InputGroup size="sm">
				<InputLeftAddon fontSize="xl" color="low-colour" bg="button-bg">
					{name}
				</InputLeftAddon>

				<Input
					fontSize="xl"
					borderLeftStyle="none"
					value={typeof value === "number" ? value : ""}
					placeholder={placeholder.toFixed(0)}
					onChange={handleChange}
				/>

				{!updateOnChange && value && (
					<IconButton
						aria-label="clear"
						position="absolute"
						right="0"
						variant=""
						size="sm"
						onClick={handleClear}
						icon={<IoClose />}
					/>
				)}
			</InputGroup>

			{!updateOnChange ? (
				value ? (
					<Button
						aria-label="apply"
						size="md"
						fontSize="xl"
						height={8}
						width={24}
						colorScheme="green"
						onClick={handleTick}
					>
						<TiTick />
					</Button>
				) : (
					<Button
						size="md"
						fontSize="md"
						height={8}
						width={24}
						colorScheme="blue"
						fontFamily="'M PLUS Rounded 1c', sans-serif;"
						letterSpacing="-0.05rem"
						disabled={(placeholder || 0) === nominal}
						onClick={handleNominal}
					>
						{nominalTitle}
					</Button>
				)
			) : null}

			<IconButton
				aria-label="close"
				icon={<TiDelete />}
				size="md"
				fontSize="lg"
				height={8}
				width={20}
				colorScheme="gray"
				onClick={handleClose}
			/>
		</Flex>
	)
}

export default AdjusterIO
