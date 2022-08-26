import { Story } from "@storybook/react/types-6-0"

import { heaterArgTypes, HeatersDecorator } from "../../storybook/decorators"
import { pausedStatus } from "../../storybook/mockdata"
import { UpdateStore } from "../../storybook/mocks"
import Tools from "./Tools"

export default {
	title: "Screens/Tools",
	component: Tools,
	decorators: [HeatersDecorator],
	argTypes: heaterArgTypes,
	// parameters: { ...canvasParameters },
}

const Template: Story = (args) => <Tools {...args} />

export const Default = Template.bind({})

export const PrintingInProgress = Template.bind({})
PrintingInProgress.decorators = [
	(Story) => (
		<UpdateStore status={pausedStatus}>
			<Story />
		</UpdateStore>
	),
]

export const NotHomed = Template.bind({})
NotHomed.decorators = [
	(Story) => (
		<UpdateStore
			status={{
				toolhead: {
					homed_axes: "",
				},
			}}
		>
			<Story />
		</UpdateStore>
	),
]
