import { Story } from "@storybook/react/types-6-0"
import { RESET } from "jotai/utils"

import { AppRootDecorator } from "../../storybook/decorators"
import {
	baseFluidd,
	emptyInfo,
	printingStatus,
	resetStatus,
} from "../../storybook/mockdata"
import { UpdateStore } from "../../storybook/mocks"
import Header, { HeaderProps } from "./Header"

export default {
	title: "Sections/Header",
	component: Header,
	decorators: [AppRootDecorator],
}

const Template: Story<HeaderProps> = (args) => <Header {...args} />

export const Default = Template.bind({})

export const LongName = Template.bind({})
const longNameFluidd = {
	...baseFluidd,
	uiSettings: { general: { instanceName: "Long Long Name" } },
}
LongName.decorators = [
	(Story) => (
		<UpdateStore fluidd={longNameFluidd}>
			<Story />
		</UpdateStore>
	),
]

export const ShortName = Template.bind({})
const shortNameFluidd = {
	...baseFluidd,
	uiSettings: { general: { instanceName: "Sys" } },
}
ShortName.decorators = [
	(Story) => (
		<UpdateStore fluidd={shortNameFluidd}>
			<Story />
		</UpdateStore>
	),
]

export const Printing = Template.bind({})
Printing.decorators = [
	(Story) => (
		<UpdateStore status={printingStatus}>
			<Story />
		</UpdateStore>
	),
]

export const NotReady = Template.bind({})
NotReady.decorators = [
	(Story) => (
		<UpdateStore info={emptyInfo}>
			<Story />
		</UpdateStore>
	),
]

export const Loading = Template.bind({})
Loading.decorators = [
	(Story) => (
		<UpdateStore info={emptyInfo} fluidd={{}} status={resetStatus}>
			<Story />
		</UpdateStore>
	),
]

const noCamFluidd = {
	uiSettings: { general: { instanceName: "NoCam" } },
}
export const NoCamera = Template.bind({})
NoCamera.decorators = [
	(Story) => (
		<UpdateStore fluidd={noCamFluidd}>
			<Story />
		</UpdateStore>
	),
]

export const NoLeds = Template.bind({})
NoLeds.decorators = [
	(Story) => (
		<UpdateStore status={RESET}>
			<Story />
		</UpdateStore>
	),
]