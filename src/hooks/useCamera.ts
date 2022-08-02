import { selectAtom, useAtomValue } from "jotai/utils"

import { serverSettingsAtom } from "../store"
import type { ServerSettings } from "../store/types"

// Extract camera settings
const selectCamera = (serverSettings: ServerSettings) => serverSettings?.camera
const cameraAtom = selectAtom(serverSettingsAtom, selectCamera)

export const useCamera = () => useAtomValue(cameraAtom)
