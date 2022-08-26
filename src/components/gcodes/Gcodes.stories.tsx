import { Story } from "@storybook/react/types-6-0"

import { UpdateStore } from "../../storybook/mocks"
import Gcodes from "./Gcodes"

export default {
	title: "Components/Gcodes",
	component: Gcodes,
}

const Template: Story = (args) => <Gcodes {...args} />

export const Default = Template.bind({})

export const NoGcodes = Template.bind({})
NoGcodes.decorators = [
	(Story) => (
		<UpdateStore gcodeList={[]}>
			<Story />
		</UpdateStore>
	),
]
