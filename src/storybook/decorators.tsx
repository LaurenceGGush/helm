/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useMemo } from "react"

import "@fontsource/open-sans/latin-400.css"
import "@fontsource/solway/latin-400.css"
import "@fontsource/pragati-narrow/latin-400.css"
import "@fontsource/m-plus-rounded-1c/latin-700.css"
import "@fontsource/league-mono-condensed/latin-ext-300.css"

import { Box } from "@chakra-ui/react"
import createCache from "@emotion/cache"
import { CacheProvider } from "@emotion/react"
import { Story } from "@storybook/react/types-6-0"
import { Provider as JotaiProvider } from "jotai"
import { useUpdateAtom } from "jotai/utils"

import { Moonraker } from "../moonraker/moonraker"
import { statusAtom } from "../store"
import { Heaters } from "../store/types"
import noopObj from "../utilities/noopProxy"
import {
	baseStatus,
	heatersOff,
	heatersOn,
	heatersOnRandomTemps,
	readyInfo,
} from "./mockdata"
import { baseMockPrinter, MockStore, UpdateStore, useInit } from "./mocks"

export const eCache = createCache({
	// arbitrary key
	key: "k",
	// providing an empty stylis plugins array removes the css prefixing
	stylisPlugins: [],
})

export const ProvidersDecorator = (Story: Story) => {
	// Storybook is creating a fixed height only in Firefox, so unset it to fix the display issue
	useEffect(() => {
		Array.from(
			document.querySelectorAll(".innerZoomElementWrapper"),
		).forEach((element) => {
			const container = element.parentNode
			if (container instanceof HTMLDivElement) {
				container.style.height = "unset"
				container.removeAttribute("scale")
				container.removeAttribute("height")
				container.className = ""
			}
		})
	})

	return (
		<JotaiProvider>
			<CacheProvider value={eCache}>
				<MockStore info={readyInfo} status={baseStatus}>
					<Story />
				</MockStore>
			</CacheProvider>
		</JotaiProvider>
	)
}

export const AppRootDecorator = (Story: Story) => (
	<Box className="app-root" background="background">
		<Story />
	</Box>
)

export const HeatersDecorator = (Story: Story, context: any) => {
	const heating =
		typeof context.args.heating === "boolean"
			? context.args.heating
			: context.args.heating === "true"
	const heatingStatus = heating ? heatersOn : heatersOff

	const extruders: Heaters = Array(context.args.extruders)
		.fill("extruder")
		.map((e, i) => (i ? e + i : e))

	const heaters: Heaters = useMemo(
		() => [...extruders, "heater_bed"],
		[extruders],
	)

	const updateStatus = useUpdateAtom(statusAtom)

	useEffect(() => {
		let interval: number
		if (heating) {
			interval = window.setInterval(() => {
				updateStatus(heatersOnRandomTemps())
			}, 250)
		}

		return () => {
			if (interval) {
				clearInterval(interval)
			}
		}
	}, [heating, updateStatus])

	// logger.log(context.args, heatingStatus)

	return (
		<UpdateStore
			status={{
				...heatingStatus,
				heaters: {
					available_heaters: heaters,
				},
			}}
		>
			<Story />
		</UpdateStore>
	)
}

export const heaterArgTypes = {
	heating: {
		control: { type: "boolean" },
		defaultValue: true,
		description: "Mock arg to set heating status",
	},
	extruders: {
		control: { type: "range", min: 1, max: 4 },
		defaultValue: 3,
		description: "Mock arg to set number of extruders",
	},
}

export const AxesDecorator = (Story: Story, context: any) => {
	const axes = context?.args?.homed?.join() || ""

	return (
		<UpdateStore
			status={{
				toolhead: {
					homed_axes: axes,
				},
			}}
		>
			<Story />
		</UpdateStore>
	)
}

export const axesArgTypes = {
	homed: {
		options: ["x", "y", "z"],
		control: { type: "inline-check" },
		description: "Mock arg to select homed axis",
	},
}

export const ToolsDecorator: FC<Story> = (Story: Story) => {
	const init = useInit()

	const updateStatus = useUpdateAtom(statusAtom)
	const noopPrinter = noopObj({
		...baseMockPrinter,
		init,
		extruder: async (extruder: string) => {
			const extruderNumber = parseInt(extruder, 10)

			updateStatus({
				toolhead: {
					extruder: `extruder${extruderNumber}`,
				},
			})
		},
		tool: async (tool: string) => {
			const toolNumber = parseInt(tool, 10)

			updateStatus({
				toolhead: {
					extruder: `extruder${toolNumber}`,
				},
				dock: {
					tool_number: `${parseInt(tool, 10) + 1}`,
				},
			})
		},
		dropoff: async () =>
			updateStatus({
				dock: {
					tool_number: undefined,
				},
			}),
	}) as Moonraker

	return (
		<UpdateStore printer={noopPrinter}>
			<Story />
		</UpdateStore>
	)
}

export const canvasParameters = {
	layout: "fullscreen",
	viewMode: "story",
	previewTabs: {
		"storybook/docs/panel": { hidden: true },
		canvas: { hidden: false },
	},
}
