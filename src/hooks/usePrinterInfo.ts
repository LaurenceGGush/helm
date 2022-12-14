import equal from "fast-deep-equal"
import { useAtomValue } from "jotai"
import { selectAtom } from "jotai/utils"

import { infoAtom, serverSettingsAtom } from "../store"
import type { PrinterInfo, ServerSettings } from "../store/types"

const usePrinterInfo = () => useAtomValue(infoAtom)
export default usePrinterInfo

const selectPrinterReady = (info: PrinterInfo) => {
	const state = info?.state

	return {
		printerStarting: state === "startup" || state === "opening",
		printerReady: state === "ready",
		printerError:
			state === "error" || state === "closed" || state === "shutdown",
	}
}
const readyAtom = selectAtom(infoAtom, selectPrinterReady, equal)
export const usePrinterReady = () => useAtomValue(readyAtom)

const selectHostname = (info: PrinterInfo) => info?.hostname
const hostnameAtom = selectAtom(infoAtom, selectHostname)
export const useHostname = () => useAtomValue(hostnameAtom)

const selectName = (serverSettings: ServerSettings) => serverSettings?.name
const nameAtom = selectAtom(serverSettingsAtom, selectName)
export const usePrintername = () => {
	const name = useAtomValue(nameAtom)
	const hostname = useHostname()

	return name || hostname
}
