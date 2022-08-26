const config = {
	staticDirs: ["../src/storybook/assets"],
	stories: [
		"../src/**/*.stories.mdx",
		"../src/**/*.stories.@(js|jsx|ts|tsx)",
	],
	addons: [
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		"@storybook/addon-interactions",
		"@chakra-ui/storybook-addon",
		"storybook-addon-pseudo-states",
	],
	typescript: {
		reactDocgen: "react-docgen-typescript",
		reactDocgenTypescriptOptions: {
			shouldExtractLiteralValuesFromEnum: true,
			shouldRemoveUndefinedFromOptional: true,
			// Don't include props from node modules
			propFilter: (prop) => {
				if (prop.parent && !/node_modules/.test(prop.parent.fileName)) {
					return true
				}

				if (
					prop.declarations.length &&
					!/node_modules/.test(prop.declarations[0].fileName)
				) {
					return true
				}

				return false
			},
		},
	},
	framework: "@storybook/react",
	core: {
		builder: "@storybook/builder-vite",
		disableTelemetry: true,
	},
	features: {
		modernInlineRender: true,
	},
	refs: {
		"@chakra-ui/react": { disable: true },
	},
}

export default config
