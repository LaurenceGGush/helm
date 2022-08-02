import { FC } from "react"

import { Progress, ProgressProps } from "@chakra-ui/react"

import { usePrintingOrPaused } from "../../hooks/usePrinterStatus"
import usePrintStats from "../../hooks/usePrintStats"

/**
 * Display current print progress
 */
const SimpleProgress: FC<ProgressProps> = (props) => {
	const { printingOrPaused } = usePrintingOrPaused()
	const { progress } = usePrintStats()

	if (!printingOrPaused) {
		return null
	}

	return <Progress value={progress * 100} {...props} />
}

export default SimpleProgress
