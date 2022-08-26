import { useAtomValue } from "jotai"

import { printerAtom } from "../store"

const usePrinter = () => useAtomValue(printerAtom)

export default usePrinter
