import { useAtomValue } from "jotai"

import { gcodeResponsesAtom } from "../store"

export const useOutput = () => useAtomValue(gcodeResponsesAtom)
