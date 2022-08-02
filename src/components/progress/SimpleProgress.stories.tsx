import { Story } from "@storybook/react/types-6-0"

import { printingStatus } from "../../storybook/mockdata"
import { UpdateStore } from "../../storybook/mocks"
import SimpleProgress from "./SimpleProgress"

export default {
	title: "Components/Progress",
	component: SimpleProgress,
}

const Template: Story = (args) => <SimpleProgress {...args} />

export const Printing = Template.bind({})
Printing.decorators = [
	(Story) => (
		<UpdateStore status={printingStatus}>
			<Story />
		</UpdateStore>
	),
]

export const NotPrinting = Template.bind({})
