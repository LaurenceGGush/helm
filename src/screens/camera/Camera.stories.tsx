import { Story } from "@storybook/react/types-6-0"

import Camera from "./Camera"

export default {
	title: "Screens/Camera",
	component: Camera,
}

export const Default: Story = (args) => <Camera {...args} />
