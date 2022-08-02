import "@emotion/react"

import { Theme as ChakraTheme } from "@chakra-ui/react"

declare module "@emotion/react" {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	export interface Theme extends ChakraTheme {}
}
