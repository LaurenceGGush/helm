import { useEffect } from "react"

import { Story } from "@storybook/react/types-6-0"
import { useAtom } from "jotai"

import Printer from "./Printer"
import { infoAtom } from "./store"
import {
	AppRootDecorator,
	axesArgTypes,
	AxesDecorator,
	canvasParameters,
	heaterArgTypes,
	HeatersDecorator,
} from "./storybook/decorators"
import {
	disconnectedInfo,
	emptyInfo,
	pausedStatus,
	printingStatus,
	readyInfo,
	resetStatus,
	startupInfo,
} from "./storybook/mockdata"
import { UpdateStore } from "./storybook/mocks"

export default {
	title: "Printer",
	component: Printer,
	decorators: [AppRootDecorator],
	parameters: { ...canvasParameters },
}

const Template: Story = (args) => <Printer {...args} />

export const Ready = Template.bind({})
Ready.decorators = [HeatersDecorator, AxesDecorator]
Ready.argTypes = { ...heaterArgTypes, ...axesArgTypes }

export const Printing = Template.bind({})
Printing.decorators = [
	(Story) => (
		<UpdateStore status={printingStatus}>
			<Story />
		</UpdateStore>
	),
]

export const Paused = Template.bind({})
Paused.decorators = [
	(Story) => (
		<UpdateStore status={pausedStatus}>
			<Story />
		</UpdateStore>
	),
]
export const DisconnectReconnect = Template.bind({})
DisconnectReconnect.decorators = [
	(Story) => {
		const [info, updateInfo] = useAtom(infoAtom)

		useEffect(() => {
			if (!info.hostname) {
				return
			}

			setTimeout(() => {
				info.state !== "ready"
					? updateInfo(readyInfo)
					: updateInfo(disconnectedInfo)
			}, 2000)
		}, [info, updateInfo])

		return <Story />
	},
]

export const Restarter = Template.bind({})
Restarter.decorators = [
	(Story) => {
		const [info, updateInfo] = useAtom(infoAtom)

		useEffect(() => {
			if (!info.hostname) {
				return
			}

			setTimeout(() => {
				info.state !== "ready"
					? updateInfo(readyInfo)
					: updateInfo(startupInfo)
			}, 2000)
		}, [info, updateInfo])

		return <Story />
	},
]

export const Loading = Template.bind({})
Loading.decorators = [
	(Story) => (
		<UpdateStore info={emptyInfo} fluidd={{}} status={resetStatus}>
			<Story />
		</UpdateStore>
	),
]
