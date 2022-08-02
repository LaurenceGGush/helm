import { ComponentStyleConfig } from "@chakra-ui/theme"

const tag: ComponentStyleConfig = {
	parts: ["container", "label", "icon", "highlight"],
	baseStyle: {
		container: {
			borderRadius: "sm",
			borderLeftRadius: "sm",
			borderRightRadius: "sm",
			transitionProperty: "common",
			transitionDuration: "faster",
		},
		highlight: {
			bg: "highlight-bg",
			color: "high-colour",
			borderRadius: "sm",
			borderLeftRadius: "none",
			transitionProperty: "common",
			transitionDuration: "faster",
		},
	},
	variants: {
		solid: {
			container: {
				bg: "button-bg",
			},
		},
		subtle: {
			container: {
				bg: "tag-bg",
			},
		},
		depth: {
			container: {
				bg: "button-bg",
				boxShadow: "depth",
				transform: "translateY(var(--chakra-space-depth-minus))",
				_hover: { bg: "hover-bg" },
				_focus: { boxShadow: "depth" },
				_active: {
					boxShadow: "depth-shallow",
					transform: "translateY(0)",
				},
				_disabled: {
					boxShadow: "minimal",
					transform: "translateY(0)",
				},
			},
			highlight: {
				boxShadow: "depth-highlight",
			},
		},
	},
}
export default tag
