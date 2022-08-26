import { Story } from "@storybook/react/types-6-0"

import { homingList } from "../../storybook/mockdata"
import { UpdateStore } from "../../storybook/mocks"
import Output from "./Output"

export default {
	title: "Screens/Output",
	component: Output,
}

export const Default: Story<{ isSelected: boolean }> = (args) => (
	<Output {...args} />
)
Default.decorators = [
	(Story) => (
		<UpdateStore objectList={homingList}>
			<Story />
		</UpdateStore>
	),
]
