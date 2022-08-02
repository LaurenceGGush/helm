import { Button } from "@chakra-ui/react"
import { Story } from "@storybook/react/types-6-0"

export default {
	title: "Components/Button Shadows",
	component: "Button",
	parameters: {
		docs: {
			description: {
				component:
					"Side by side to visually compare box-shadow and drop-shadow",
			},
		},
	},
}

const Template: Story = (args) => (
	<>
		<Button variant="depthDrop" size="md" width="3.5rem" {...args}>
			drop
		</Button>
		<Button
			variant="depth"
			size="md"
			width="3.5rem"
			marginLeft="2"
			{...args}
		>
			box
		</Button>
	</>
)

export const Default = Template.bind({})

export const Active = Template.bind({})
Active.parameters = { pseudo: { active: true } }

export const Disabled = Template.bind({})
Disabled.args = { disabled: true }

export const Primary = Template.bind({})
Primary.args = { colorScheme: "blue" }
