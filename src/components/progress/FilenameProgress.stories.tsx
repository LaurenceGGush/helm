import { Story } from "@storybook/react/types-6-0"

import { printingStatus } from "../../storybook/mockdata"
import { UpdateStore } from "../../storybook/mocks"
import FilenameProgress from "./FilenameProgress"

export default {
	title: "Components/Filename Progress",
	component: FilenameProgress,
}

const Template: Story = (args) => <FilenameProgress {...args} />

export const Printing = Template.bind({})
Printing.decorators = [
	(Story) => (
		<UpdateStore status={printingStatus}>
			<Story />
		</UpdateStore>
	),
]

export const NotPrinting = Template.bind({})
