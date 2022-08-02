import { Story } from "@storybook/react/types-6-0"

import Spinner from "./Spinner"

export default {
	title: "Components/Spinner",
	component: Spinner,
}

const Template: Story = (args) => <Spinner {...args} />

export const Default = Template.bind({})
