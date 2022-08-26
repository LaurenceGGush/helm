import { Story } from "@storybook/react/types-6-0"

import { axesArgTypes, AxesDecorator } from "../../storybook/decorators"
import { homingList, printingStatus } from "../../storybook/mockdata"
import { UpdateStore } from "../../storybook/mocks"
import Move from "./Move"

export default {
	title: "Screens/Move",
	component: Move,
	args: { homed: ["x", "y", "z"] },
}

const Template: Story = (args) => <Move {...args} />

export const Default = Template.bind({})
Default.decorators = [AxesDecorator]
Default.argTypes = axesArgTypes

export const Homing = Template.bind({})
Homing.decorators = [
	(Story) => (
		<UpdateStore objectList={homingList}>
			<Story />
		</UpdateStore>
	),
]

export const PrintingInProgress = Template.bind({})
PrintingInProgress.decorators = [
	(Story) => (
		<UpdateStore status={printingStatus}>
			<Story />
		</UpdateStore>
	),
]
