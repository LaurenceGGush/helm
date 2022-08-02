module.exports = {
	env: {
		node: true,
	},
	parser: "@typescript-eslint/parser",
	extends: [
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:jsx-a11y/recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:import/typescript",
		"plugin:react/jsx-runtime",
		"plugin:prettier/recommended",
		"prettier",
		"plugin:storybook/recommended",
	],
	ignorePatterns: ["dist/", "node_modules/"],
	plugins: [
		"react",
		"@typescript-eslint",
		"import",
		"jsx-a11y",
		"react-hooks",
		"simple-import-sort",
		"prettier",
	],
	rules: {
		"react/react-in-jsx-scope": "off",
		"no-unused-vars": "off",
		"@typescript-eslint/no-unused-vars": [
			"warn",
			{
				argsIgnorePattern: "^_",
				varsIgnorePattern: "^_",
				caughtErrorsIgnorePattern: "^_",
			},
		],

		"react-hooks/rules-of-hooks": "error",
		"react-hooks/exhaustive-deps": "warn",

		"simple-import-sort/imports": [
			"warn",
			{
				groups: [
					["^react$"],
					["^\\u0000"],
					["^@?\\w"],
					["^[^.]"],
					["^\\."],
				],
			},
		],
		"prettier/prettier": "warn",
	},
	settings: { react: { version: "detect" } },
}
