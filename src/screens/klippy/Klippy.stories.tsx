import { Story } from "@storybook/react/types-6-0"

import { bigErrorInfo, errorInfo, startupInfo } from "../../storybook/mockdata"
import { UpdateStore } from "../../storybook/mocks"
import Klippy from "./Klippy"

export default {
	title: "Screens/Klippy",
	component: Klippy,
}

const Template: Story = (args) => <Klippy {...args} />

export const Ready = Template.bind({})

export const Starting = Template.bind({})
Starting.decorators = [
	(Story) => (
		<UpdateStore info={startupInfo}>
			<Story />
		</UpdateStore>
	),
]

export const Error = Template.bind({})
Error.decorators = [
	(Story) => (
		<UpdateStore info={errorInfo}>
			<Story />
		</UpdateStore>
	),
]

export const BigError = Template.bind({})
BigError.decorators = [
	(Story) => (
		<UpdateStore info={bigErrorInfo}>
			<Story />
		</UpdateStore>
	),
]
