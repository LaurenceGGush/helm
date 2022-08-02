import { addons } from "@storybook/addons"
import { create } from "@storybook/theming"

const title = create({
	brandTitle: "Helm",
	// brandImage: 'https://place-hold.it/350x150',
})

addons.setConfig({
	theme: title,
})
