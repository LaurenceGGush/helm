import { Story } from "@storybook/react/types-6-0"

import { GcodeFile } from "../../hooks/useGcodes"
import { heaterArgTypes, HeatersDecorator } from "../../storybook/decorators"
import { gcodes } from "../../storybook/mockdata"
import GcodePop from "./GcodePop"

export default {
	title: "Components/Gcode Pop",
	component: GcodePop,
	parameters: { controls: { include: ["heating", "extruders"] } },
}

// meh close enough
const gcode = gcodes.pop() as unknown as GcodeFile

const Template: Story = (args) => <GcodePop gcode={gcode} {...args} />

export const Default = Template.bind({})
Default.decorators = [HeatersDecorator]
Default.argTypes = heaterArgTypes
