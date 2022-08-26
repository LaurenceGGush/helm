import { addons } from "@storybook/addons"
import { create } from "@storybook/theming"

const title = create({
	base: "light",
	brandTitle: "Helm",
	// brandImage: 'https://place-hold.it/350x150',
})

addons.setConfig({
	theme: title,
})
