import { memo, useEffect } from "react"

import { Box } from "@chakra-ui/react"

import Gcodes from "../../components/gcodes"
import Printing from "../../components/printing"
import { useFilename } from "../../hooks/usePrinterStatus"
import { logger } from "../../utilities/logger"

/**
 * Print screen
 *
 * Shows gcode list and printing overview
 */
const Print = () => {
	const filename = useFilename()

	useEffect(() => logger.info("print"))

	return (
		<Box
			className="Print"
			height="100%"
			overflowY={filename ? "initial" : "scroll"}
		>
			{filename ? <Printing /> : <Gcodes />}
		</Box>
	)
}

export default memo(Print)
