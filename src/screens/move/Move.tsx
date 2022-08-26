import { memo, useEffect } from "react"

import { usePrintingOrPaused } from "../../hooks/usePrinterStatus"
import { logger } from "../../utilities/logger"
import BabyStepping from "./BabyStepping"
import CrossMove from "./CrossMove"

/**
 * Manual movement and homing controls
 *
 * During printing displays Z axis baby stepping controls
 */
const Move = () => {
	const { printingOrPaused } = usePrintingOrPaused()

	useEffect(() => logger.info("move"))

	return !printingOrPaused ? <CrossMove /> : <BabyStepping />
}

export default memo(Move)
