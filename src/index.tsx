import { StrictMode, Suspense } from "react"

import "@fontsource/open-sans/latin-400.css"
import "@fontsource/solway/latin-400.css"
import "@fontsource/pragati-narrow/latin-400.css"
import "@fontsource/m-plus-rounded-1c/latin-500.css"
import "@fontsource/league-mono-condensed/latin-ext-300.css"

import { ChakraProvider, ColorModeScript } from "@chakra-ui/react"
import createCache from "@emotion/cache"
import { CacheProvider } from "@emotion/react"
import { Provider as JotaiProvider } from "jotai"
import { createRoot } from "react-dom/client"

import Printer from "./Printer"
import theme from "./theme"

export const eCache = createCache({
	// arbitrary key
	key: "k",
	// providing an empty stylis plugins array removes the css prefixing
	stylisPlugins: [],
})

const rootElement = document.getElementById("root")
if (!rootElement) {
	throw new Error("Failed to find the root element")
}

const root = createRoot(rootElement)
root.render(
	<StrictMode>
		<JotaiProvider>
			<CacheProvider value={eCache}>
				<ChakraProvider theme={theme}>
					<ColorModeScript initialColorMode="light" />

					<Suspense fallback="SHOULD NEVER BE HIT, ONLY HERE FOR SAFETY">
						<Printer />
					</Suspense>
				</ChakraProvider>
			</CacheProvider>
		</JotaiProvider>
	</StrictMode>,
)
