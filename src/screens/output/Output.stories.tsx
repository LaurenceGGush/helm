import { Story } from "@storybook/react/types-6-0"

import Output from "."

export default {
	title: "Screens/Output",
	component: Output,
}

export const Default: Story<{ isSelected: boolean }> = (args) => (
	<Output {...args} />
)
