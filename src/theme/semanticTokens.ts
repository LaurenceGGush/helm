import { depth } from "./shadows"

const semanticTokens = {
	colors: {
		// Base colours
		colour: {
			default: "gray.800",
			_dark: "whiteAlpha.900",
		},
		background: {
			default: "#fafcfc",
			_dark: "gray.800",
		},
		// Button / buttony things
		"button-bg": {
			default: "gray.100",
			_dark: "gray.700",
		},
		"hover-bg": {
			default: "gray.50",
			_dark: "gray.700",
		},
		"active-bg": {
			default: "gray.50",
			_dark: "gray.750",
		},
		"disabled-colour": {
			default: "gray.500",
			_dark: "whiteAlpha.500",
		},
		"disabled-bg": { default: "gray.100", _dark: "gray.850" },
		"highlight-bg": {
			default: "gray.200",
			_dark: "gray.650",
		},
		"low-colour": {
			default: "gray.600",
			_dark: "whiteAlpha.700",
		},
		"high-colour": {
			default: "gray.700",
			_dark: "gray.800",
		},
		"shadow-depth": {
			default: "gray.300",
			_dark: "gray.800",
		},
		"shadow-contact": {
			default: "gray.400",
			_dark: "blackAlpha.500",
		},
		"shadow-contact-drop": {
			default: "gray.400",
			_dark: "blackAlpha.600",
		},
		"shadow-high": {
			default: "gray.400",
			_dark: "gray.700",
		},
		// Tag
		"tag-bg": {
			default: "gray.100",
			_dark: "gray.850",
		},
		"contrast-bg": {
			default: "gray.50",
			_dark: "gray.850",
		},
		"contrast-b": {
			default: "gray.100",
			_dark: "gray.750",
		},
		// Input
		"input-b": {
			default: "gray.100",
			_dark: "gray.600",
		},
		"input-focus-b": {
			default: "gray.400",
			_dark: "gray.500",
		},
	},
	space: {
		depth: `${depth}px`,
		"depth-minus": `-${depth}px`,
	},
}

export default semanticTokens
