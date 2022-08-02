import { FC, useEffect } from "react"

import {
	BoxProps,
	Text,
	useColorMode,
	useColorModeValue,
} from "@chakra-ui/react"
import { Box, Heading, IconButton } from "@chakra-ui/react"
import styled from "@emotion/styled"
import { FaMoon, FaSun } from "react-icons/fa"
import { FiSun } from "react-icons/fi"
import { RiCamera2Fill } from "react-icons/ri"

import { SimpleProgress } from "../../components/progress"
import { useCamera } from "../../hooks/useCamera"
import useCurrentTime from "../../hooks/useCurrentTime"
import { usePrintername, usePrinterReady } from "../../hooks/usePrinterInfo"
import { useAvailableMacros } from "../../hooks/usePrinterStatus"
import { useLeds } from "../../hooks/useSendGcodes"
import { landscape } from "../../theme/medias"
import { logger } from "../../utilities/logger"

export interface HeaderProps extends BoxProps {
	/**
	 * Show debug printer status json
	 */
	toggleDebug: () => void
	/**
	 * Show camera feed
	 */
	toggleCam: () => void
}

/**
 * App header, displays printer name, time, and camera, leds and dark mode switches.
 *
 * Printer name size adjusts to fit.
 */
const Header: FC<HeaderProps> = ({ toggleDebug, toggleCam, ...rest }) => {
	const printername = usePrintername()
	const { printerReady } = usePrinterReady()
	const currentTime = useCurrentTime()
	const camera = useCamera()
	const { leds } = useAvailableMacros()
	const toggleLeds = useLeds()

	const { toggleColorMode } = useColorMode()
	const SwitchIcon = useColorModeValue(FaMoon, FaSun)
	const nextMode = useColorModeValue("dark", "light")

	useEffect(() => logger.info("header"))

	const fitLength = printername?.length || 3

	return (
		<Greader className="Header" as="header" {...rest}>
			<SimpleProgress
				position="absolute"
				height="2px"
				width="100%"
				zIndex="hide"
			/>

			<PrinterName as="h1">
				<PrinterNameText
					as="span"
					onClick={toggleDebug}
					sx={{ "--fitLength": fitLength.toString() }}
				>
					{printername || "..."}
				</PrinterNameText>
			</PrinterName>

			<Time onClick={() => document.location.reload()}>
				<TimeText>{currentTime}</TimeText>
			</Time>

			<Box textAlign="right">
				{camera && (
					<IconButton
						aria-label="camera"
						icon={<RiCamera2Fill />}
						variant="ghost"
						size="xs"
						mr={1}
						onClick={toggleCam}
					/>
				)}

				{leds && (
					<IconButton
						aria-label="Toggle LEDs"
						icon={<FiSun />}
						variant="ghost"
						size="xs"
						mr={1}
						onClick={() => toggleLeds()}
						isDisabled={!printerReady}
					/>
				)}

				<IconButton
					aria-label={`Switch to ${nextMode} mode`}
					icon={<SwitchIcon />}
					variant="ghost"
					size="xs"
					onClick={toggleColorMode}
				/>
			</Box>
		</Greader>
	)
}

const Greader = styled(Box)`
	position: relative;
	display: grid;
	grid-template-columns: 1fr 0.6fr 1fr;

	z-index: 1000;

	${landscape} {
		grid-template-columns: 1fr 0.5fr 1fr;
	}
`

const PrinterName = styled(Heading)`
	display: inline-flex;
	align-items: stretch;
	overflow: visible;

	min-width: 0;
	height: 1.5rem;
	line-height: 1;

	padding-left: var(--chakra-space-1);
`

const PrinterNameText = styled(Text)`
	display: inline-block;
	overflow-x: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;

	width: 100%;
	height: 1.75rem;
	line-height: 1.5rem;

	font-size: clamp(0.75rem, calc(98vmin / var(--fitLength) - 6vmin), 1.5rem);
`

const Time = styled.div`
	text-align: center;
`
const TimeText = styled.span`
	vertical-align: middle;
`

export default Header
