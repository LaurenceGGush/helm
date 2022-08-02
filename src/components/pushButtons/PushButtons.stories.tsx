import { useState } from "react"

import { Tag } from "@chakra-ui/react"
import { Story } from "@storybook/react/types-6-0"

import PushButtons, { PushButtonsProps } from "./PushButtons"

export default {
	title: "Components/Push Buttons",
	component: PushButtons,
	args: {
		stretch: false,
		vertical: false,
	},
	parameters: { controls: { include: ["stretch", "vertical"] } },
}

const Template: Story<PushButtonsProps<number>> = (args) => {
	const [value, setValue] = useState(args.options[0].value)
	args = { ...args, value, updateValue: setValue }

	return (
		<>
			<PushButtons {...args} />

			<div>
				<Tag mt={2} size="sm">
					Value: {value}
				</Tag>
			</div>
		</>
	)
}

export const Default = Template.bind({})
Default.args = {
	size: "sm",
	stretch: false,
	options: [
		{
			label: "one",
			value: 1,
		},
		{
			label: "two",
			value: 2,
		},
	],
}

export const Stretched = Template.bind({})
Stretched.args = {
	size: "sm",
	stretch: true,
	options: [
		{
			label: "a",
			value: 1,
		},
		{
			label: "b",
			value: 2,
		},
		{
			label: "c",
			value: 3,
		},
	],
}

export const Vertical = Template.bind({})
Vertical.args = {
	size: "sm",
	stretch: false,
	vertical: true,
	options: [
		{
			label: "a",
			value: 1,
		},
		{
			label: "b",
			value: 2,
		},
		{
			label: "c",
			value: 3,
		},
	],
}
