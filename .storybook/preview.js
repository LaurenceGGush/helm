import { ProvidersDecorator } from "../src/storybook/decorators"
import theme from '../src/theme'

export const decorators = [ProvidersDecorator]

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  options: {
		storySort: {
			order: [
				"Printer",
				"Sections",
				["Header", "Tabs", "Status"],
				"Screens",
				["Print", "Move", "Tools", "Klippy"],
				"Components",
			],
		},
	},
	viewport: {
		viewports: {
			Touchscreen: {
				name: '5" Touchscreen',
				styles: {
					width: "480px",
					height: "800px",
				},
			},
			Phone: {
				name: "Oneplus 6",
				styles: {
					width: "411px",
					height: "838px",
				},
			},
			Pixel: {
				name: "Pixel 6 Pro",
				styles: {
					width: "360px",
					height: "780px",
				},
			},
			Tablet: {
				name: "iPad",
				styles: {
					width: "810px",
					height: "1080px",
				},
			},
			Watch: {
				name: "Watch",
				styles: {
					width: "162px",
					height: "180px",
				},
			},
		},
		defaultViewport: "Touchscreen",
	},

	viewMode: "docs",
	previewTabs: {
		canvas: { hidden: true },
	},

	docs:{
		source: {
			excludeDecorators: true,
		},
	},
	
	features: { emotionAlias: false },

	chakra:{ theme }
}