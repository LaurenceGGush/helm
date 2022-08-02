import { ComponentStyleConfig } from "@chakra-ui/react"

const input: ComponentStyleConfig = {
	variants: {
		outline: {
			field: {
				borderColor: "input-b",
				_focus: {
					borderColor: "input-focus-b",
					boxShadow: "none",
				},
				_focusVisible: {
					borderColor: "input-focus-b",
					boxShadow: "none",
				},
			},
			addon: {
				borderColor: "input-b",
			},
		},
	},
}

export default input
