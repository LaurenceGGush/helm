import { ComponentStyleConfig } from "@chakra-ui/theme"
import { mode, StyleFunctionProps } from "@chakra-ui/theme-tools"

import { dropShadow, shadow } from "./shadows"

const schemeColour = (props: StyleFunctionProps, light = 500, dark = 500) =>
	mode(
		`${props.colorScheme}.${props.colorScheme === "gray" ? 700 : light}`,
		`${props.colorScheme}.${props.colorScheme === "gray" ? 300 : dark}`,
	)(props)

const schemeDepth = (props: StyleFunctionProps) =>
	mode(
		`--chakra-colors-${props.colorScheme}-${
			props.colorScheme === "gray" ? 300 : 300
		}`,
		`--chakra-colors-${props.colorScheme}-${
			props.colorScheme === "gray" ? 800 : 700
		}`,
	)(props) as `--${string}`

const button: ComponentStyleConfig = {
	baseStyle: {
		// background: "button-bg",
		fontWeight: "normal",
		transitionDuration: "faster",
	},
	variants: {
		solid: { bg: "button-bg" },
		ghost: { bg: "none" },
		depth: (props) => {
			const depth = shadow(schemeDepth(props))
			const depthShallow = "depth-shallow" //shadow(schemeDepth(props), true, 0)

			return {
				bg: "button-bg",
				color: schemeColour(props),
				boxShadow: depth,
				transform: "translateY(var(--chakra-space-depth-minus))",
				_hover: {
					bg: "hover-bg",
					_disabled: {
						bg: "disabled-bg",
					},
				},
				_focus: { boxShadow: depth },
				_active: {
					boxShadow: depthShallow,
					transform: "translateY(0)",
				},
				_disabled: {
					bg: "disabled-bg",
					color: "disabled-colour",
					boxShadow: "minimal",
					transform: "translateY(0)",
					opacity: 1,
				},
			}
		},
		depthDrop: (props) => {
			const depth = dropShadow(schemeDepth(props))
			const depthShallow = dropShadow(schemeDepth(props), true, 0)

			return {
				bg: "button-bg",
				color: schemeColour(props),
				filter: depth,
				transform: "translateY(var(--chakra-space-depth-minus))",
				transitionProperty:
					"filter, transform, color, background-color",
				// zIndex: "docked",
				_hover: {
					bg: "hover-bg",
					_disabled: {
						bg: "disabled-bg",
					},
				},
				_focus: {
					filter: depth,
				},
				_active: {
					filter: depthShallow,
					transform: "translateY(0)",
				},
				_disabled: {
					bg: "disabled-bg",
					color: "disabled-colour",
					filter: "var(--chakra-shadows-minimal-drop)",
					transform: "translateY(0)",
					opacity: 1,
				},
			}
		},
	},
	defaultProps: { variant: "depth" },
}

export default button
