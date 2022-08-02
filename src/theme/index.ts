import { extendTheme } from "@chakra-ui/react"

import button from "./button"
import colors from "./colors"
import fonts from "./fonts"
import global from "./global"
import input from "./input"
import semanticTokens from "./semanticTokens"
import shadows from "./shadows"
import tag from "./tag"

const theme = extendTheme({
	config: { initialColorMode: "light", disableTransitionOnChange: true },
	components: { Button: button, Tag: tag, Input: input },
	...fonts,
	semanticTokens,
	colors,
	shadows,
	styles: { global },
})

export default theme
