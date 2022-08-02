import { useAtom } from "jotai"

import { Moonraker } from "../moonraker/moonraker"
import { printerAtom } from "../store"

const usePrinter = () => {
	const [printer] = useAtom(printerAtom)

	// logger.trace({ printer })

	// Might be populated when we get here :fingerscrossed:
	return printer as unknown as Moonraker
}

export default usePrinter
