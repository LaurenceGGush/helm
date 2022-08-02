// Button shadow depth in pixels
export const depth = 3

export const shadow = (
	colourProperty: `--${string}`,
	grounded = true,
	top = depth,
) => {
	const ground = Math.max(0.125, top)

	const shadow = []

	shadow.push(`0 ${top}px var(${colourProperty})`)

	if (grounded) {
		shadow.push(
			`0 ${ground}px ${ground * 4}px
			var(--chakra-colors-shadow-contact)`,
		)
		shadow.push(
			`0 ${ground}px 1px 1px
			var(--chakra-colors-shadow-contact)`,
		)
	}

	return shadow.join(", ")
}

export const dropShadow = (
	colourProperty: `--${string}`,
	grounded = true,
	top = depth,
) => {
	const ground = Math.max(0.25, top)

	const shadow = []

	shadow.push(`0 ${top}px 0px var(${colourProperty})`)

	if (grounded) {
		shadow.push(
			`0 ${ground / 3}px 1px
			var(--chakra-colors-shadow-contact-drop)`,
		)
		shadow.push(
			`0 ${ground / 3}px ${ground * 1.25}px
			var(--chakra-colors-shadow-contact-drop)`,
		)
	}

	return "drop-shadow(" + shadow.join(") drop-shadow(") + ")"
}

const depthShadow = shadow("--chakra-colors-shadow-depth")
const depthHighlightShadow = shadow("--chakra-colors-shadow-high", false)
const depthDropShadow = dropShadow("--chakra-colors-shadow-depth")
const depthShallowShadow = shadow("--chakra-colors-shadow-depth", true, 0)
const depthShallowHighlightShadow = shadow("--chakra-colors-shadow-high", false)
const depthDropShallowShadow = dropShadow(
	"--chakra-colors-shadow-depth",
	true,
	0,
)

const shadows = {
	outline: "",
	minimal: "0 0 0 1px rgba(125,125,125,0.15)",
	"minimal-drop": "drop-shadow(0 0 1px rgba(125,125,125,0.45))",
	depth: depthShadow,
	"depth-highlight": depthHighlightShadow,
	"depth-drop": depthDropShadow,
	"depth-shallow": depthShallowShadow,
	"depth-shallow-highlight": depthShallowHighlightShadow,
	"depth-drop-shallow": depthDropShallowShadow,
}

export default shadows
