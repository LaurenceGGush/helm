import { Box } from "@chakra-ui/react"
import { Story } from "@storybook/react/types-6-0"

import Adjust, { AdjustProps } from "./Adjust"

const AdjustDecorator = (Story: Story) => (
	<Box height="15rem">
		<Story />
	</Box>
)

export default {
	title: "Components/Adjust",
	component: Adjust,
	decorators: [AdjustDecorator],
	argTypes: {
		min: {
			control: { type: "range", min: 0, max: 500 },
		},
		max: {
			control: { type: "range", min: 0, max: 500 },
		},
		placeholder: {
			control: { type: "range", min: 0, max: 500 },
		},
		updateOnChange: { control: { type: "boolean" }, defaultValue: false },
	},
	parameters: { controls: { exclude: ["onClose", "onUpdate"] } },
	args: {
		onUpdate: (v: number) => console.log("adjust", v),
	},
}

const Template: Story<AdjustProps> = (args) => <Adjust {...args} />

export const Default = Template.bind({})
Default.args = {
	name: "E0",
	placeholder: 220,
	min: 180,
	max: 300,
	nominalTitle: "Cool",
}

export const Rate = Template.bind({})
Rate.args = {
	name: "Rate",
	placeholder: 55,
	min: 5,
	max: 200,
	nominal: 100,
}

export const NominalRate = Template.bind({})
NominalRate.args = {
	name: "Rate",
	placeholder: 100,
	min: 5,
	max: 200,
	nominal: 100,
}

export const UpdateOnChange = Template.bind({})
UpdateOnChange.args = {
	name: "Fan",
	placeholder: 50,
	min: 0,
	max: 100,
	updateOnChange: true,
	type: "knob",
}
