import { Story } from "@storybook/react/types-6-0"

import { Moonraker } from "../../moonraker/moonraker"
import { UpdateStore } from "../../storybook/mocks"
import noopObj from "../../utilities/noopProxy"
import Gcodes from "./Gcodes"

export default {
	title: "Components/Gcodes",
	component: Gcodes,
}

const noGcodesNoopPrinter = noopObj({
	listGcodes: () => [],
}) as Moonraker

const Template: Story = (args) => <Gcodes {...args} />

export const Default = Template.bind({})

export const NoGcodes = Template.bind({})
NoGcodes.decorators = [
	(Story) => (
		<UpdateStore printer={noGcodesNoopPrinter}>
			<Story />
		</UpdateStore>
	),
]
