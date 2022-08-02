import { Story } from "@storybook/react/types-6-0"

import { canvasParameters } from "../../storybook/decorators"
import Tabs, { TabsProps } from "./Tabs"

export default {
	title: "Sections/Tabs",
	component: Tabs,
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	args: { showCam: false, closeCam: () => {} },
	parameters: { ...canvasParameters, layout: "padded" },
}

const Template: Story<TabsProps> = (args) => <Tabs {...args} />
export const Default = Template.bind({})

export const Camera = Template.bind({})
Camera.args = { showCam: true }
