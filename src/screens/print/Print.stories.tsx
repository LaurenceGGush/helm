import { Story } from "@storybook/react/types-6-0"

import { Moonraker } from "../../moonraker/moonraker"
import {
	fileMeta,
	gcodes,
	pausedStatus,
	printingStatus,
	printLoadedStatus,
} from "../../storybook/mockdata"
import { UpdateStore } from "../../storybook/mocks"
import noopObj from "../../utilities/noopProxy"
import Print from "./Print"

export default {
	title: "Screens/Print",
	component: Print,
}

const Template: Story = (args) => <Print {...args} />

export const SelectingFile = Template.bind({})

let freshGcodes = true
const updatingPrinter = noopObj({
	fileMeta: () => fileMeta,
	listGcodes: () => {
		freshGcodes = !freshGcodes

		if (freshGcodes) {
			return [
				{
					...gcodes[0],
					modified: new Date().getTime() / 1000,
					size: 8198190,
				},
				...gcodes.slice(1),
			]
		}

		return gcodes
	},
	subscribeGcodesUpdates: (callback: () => void) => {
		const interval = setInterval(() => {
			callback()
		}, 2000)

		return () => {
			clearInterval(interval)
		}
	},
}) as Moonraker

export const UpdatingFiles = Template.bind({})
UpdatingFiles.decorators = [
	(Story) => (
		<UpdateStore printer={updatingPrinter}>
			<Story />
		</UpdateStore>
	),
]

const emptyListPrinter = noopObj({
	listGcodes: () => [],
}) as Moonraker

export const EmptyList = Template.bind({})
EmptyList.decorators = [
	(Story) => (
		<UpdateStore printer={emptyListPrinter}>
			<Story />
		</UpdateStore>
	),
]

export const Ready = Template.bind({})
Ready.decorators = [
	(Story) => (
		<UpdateStore status={printLoadedStatus}>
			<Story />
		</UpdateStore>
	),
]

export const InProgress = Template.bind({})
InProgress.decorators = [
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
