import { Story } from "@storybook/react/types-6-0"
import { FiSquare } from "react-icons/fi"

import Nozzle from "../../icons/Nozzle"
import Temperature, { TemperatureProps } from "./Temperature"

export default {
	title: "Components/Temperature",
	component: Temperature,
	argTypes: {
		icon: { control: "none" },
		current: { control: { type: "range", min: 0, max: 300, step: 1 } },
		target: { control: { type: "range", min: 0, max: 300, step: 1 } },
		power: { control: { type: "range", min: 0, max: 1, step: 0.1 } },
		range: { control: "none" },
	},
}

const Template: Story<TemperatureProps> = (args) => <Temperature {...args} />

export const Default = Template.bind({})

export const Heating = Template.bind({})
Heating.args = {
	icon: Nozzle,
	current: 200,
	target: 250,
	power: 0.7,
}

export const AtTemperature = Template.bind({})
AtTemperature.args = {
	icon: Nozzle,
	current: 250,
	target: 250,
	power: 0.65,
}

export const Disabled = Template.bind({})
Disabled.args = {
	isDisabled: true,
	icon: Nozzle,
	current: 200,
	target: 250,
	power: 0.57,
}

export const Cooling = Template.bind({})
Cooling.args = {
	icon: Nozzle,
	current: 200,
	target: 0,
	power: 0,
}

export const HotHotHot = Template.bind({})
HotHotHot.args = {
	icon: Nozzle,
	current: 301,
	power: 0,
}

export const HeatedBed = Template.bind({})
HeatedBed.args = {
	icon: FiSquare,
	current: 82,
	target: 80,
	power: 0,
	range: { min: 30, max: 100 },
}

export const HotHotBed = Template.bind({})
HotHotBed.args = {
	icon: FiSquare,
	current: 109.2,
	target: 110,
	power: 0.1,
	range: { min: 30, max: 100 },
}
