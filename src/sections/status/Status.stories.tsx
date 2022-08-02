import { Story } from "@storybook/react/types-6-0"

import {
	AppRootDecorator,
	heaterArgTypes,
	HeatersDecorator,
} from "../../storybook/decorators"
import { errorInfo } from "../../storybook/mockdata"
import { UpdateStore } from "../../storybook/mocks"
import Status from "./Status"

export default {
	title: "Sections/Status",
	component: Status,
	decorators: [AppRootDecorator, HeatersDecorator],
	argTypes: heaterArgTypes,
}

const Template: Story = () => <Status />

export const Default = Template.bind({})

export const NotReady = Template.bind({})
NotReady.decorators = [
	(Story) => (
		<UpdateStore info={errorInfo}>
			<Story />
		</UpdateStore>
	),
]
