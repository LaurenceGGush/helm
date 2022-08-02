import { FC, memo, useEffect, useState } from "react"

import {
	Alert,
	AlertDescription,
	AlertIcon,
	AlertTitle,
	Button,
	ButtonProps,
	Flex,
	Stack,
	Tag,
} from "@chakra-ui/react"
import { selectAtom, useAtomValue } from "jotai/utils"
import { AiOutlineStop } from "react-icons/ai"

import QueryEndstops from "../../components/endstops"
import usePrinter from "../../hooks/usePrinter"
import { usePrinterReady } from "../../hooks/usePrinterInfo"
import { infoAtom } from "../../store"
import type { PrinterInfo } from "../../store/types"
import { logger } from "../../utilities/logger"

const selectMessage = (info: PrinterInfo) => {
	const message = info?.state_message || ""
	const parts = message.trim().split(/\n/)

	return [parts.shift() || "", parts.join(" ")]
}
const messageAtom = selectAtom(infoAtom, selectMessage)
const versionAtom = selectAtom(infoAtom, (info) => info?.software_version || "")

const Klippy = () => {
	const printer = usePrinter()

	const message = useAtomValue(messageAtom)
	const software_version = useAtomValue(versionAtom)
	const { printerStarting, printerReady } = usePrinterReady()

	const alertStatus = printerReady
		? "info"
		: printerStarting
		? "warning"
		: "error"

	const [expanded, setExpanded] = useState(false)
	const toggleExpanded = () => setExpanded(!expanded)

	useEffect(() => logger.log("klippy"))

	return (
		<Flex className="Klippy" flexDirection="column" height="100%">
			<Alert
				status={alertStatus}
				flexDirection="column"
				alignItems="start"
				justifyContent="center"
				mb={2}
				borderRadius="sm"
				onClick={toggleExpanded}
			>
				<AlertIcon position="absolute" top={1} right={-1} />
				<AlertTitle fontSize="xs" fontWeight="normal" lineHeight="1">
					{message[0]}
					{message[1] && !expanded && <> &hellip;</>}
				</AlertTitle>

				{message[1] && expanded && (
					<AlertDescription fontSize="3xs" lineHeight="1.3" mt={1}>
						{message[1]}
					</AlertDescription>
				)}
			</Alert>

			<Flex justifyContent="space-between" height="100%">
				<Flex flexDirection="column" justifyContent="space-between">
					<Stack maxWidth="fit-content">
						<KlippyButton onClick={() => printer.reallyRestart()}>
							Restart
						</KlippyButton>

						<KlippyButton onClick={() => printer.reboot()}>
							Reboot
						</KlippyButton>
						<KlippyButton onClick={() => printer.shutdown()}>
							Shutdown
						</KlippyButton>
					</Stack>

					{software_version && (
						<Tag mt={2} size="sm">
							{software_version}
						</Tag>
					)}
				</Flex>

				<Stack>
					<KlippyButton
						colorScheme="red"
						rightIcon={<AiOutlineStop color="red" />}
						onClick={() => printer.estop()}
					>
						Emergency
					</KlippyButton>

					<QueryEndstops />
				</Stack>
			</Flex>
		</Flex>
	)
}

const KlippyButton: FC<ButtonProps> = (props) => (
	<Button className="KlippyButton" size="sm" mt={1} {...props} />
)

export default memo(Klippy)
