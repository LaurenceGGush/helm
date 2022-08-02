import { Story } from "@storybook/react/types-6-0"
import { BiTachometer } from "react-icons/bi"

import Rate, { RateProps } from "./Rate"

export default {
	title: "Components/Rate",
	component: Rate,
	argTypes: {
		icon: { control: "none" },
		highlight: { control: "color" },
		rate: { control: { type: "range", min: 0, max: 1, step: 0.01 } },
		nominal: { control: { type: "range", min: 0, max: 1, step: 0.01 } },
	},
}

const Template: Story<RateProps> = (args) => <Rate {...args} />

export const Default = Template.bind({})

export const SalmonTacho = Template.bind({})
SalmonTacho.args = {
	icon: BiTachometer,
	highlight: "#ffa07a",
	rate: 0.2,
	nominal: 1,
}

export const Smallable = Template.bind({})
Smallable.args = {
	icon: BiTachometer,
	highlight: "#DAA520",
	rate: 0.66,
	nominal: 1,
	smallable: true,
}
