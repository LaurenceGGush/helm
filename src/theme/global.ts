import { landscape } from "./medias"

const global = {
	html: {
		height: "100%",
		width: "100%",

		lineHeight: "inherit",

		fontSize:
			"clamp(100%, min(4vh, calc(3vh + 1.5vw)), min(6.67vw, 2.5rem))",
		[landscape]: {
			fontSize: "clamp(100%, min(4vw, calc(1.5vw + 4.25vh)), 2.5rem)",
		},
	},

	body: {
		margin: "0",
		padding: "0",

		width: "100%",
		height: "100%",
		maxHeight: "initial",
		minHeight: "initial",
		maxWidth: "initial",

		overflow: "hidden",

		background: "background",
		color: "colour",

		"&.sb-show-main": {
			overflow: "auto",
		},

		"& > iframe": {
			display: "none",
		},
	},

	"#root": {
		height: "100%",
		display: "flex",
		flexDirection: "column",
	},

	".app-root": {
		display: "flex",
		flexDirection: "column",
		alignContent: "space-between",
		position: "relative",

		height: "100%",

		maxHeight: "initial",
		minHeight: "initial",
		maxWidth: "initial",

		margin: "0",
	},

	code: {
		fontFamily: `source-code-pro, monospace`,
	},
}

export default global
