/** @type {import("prettier").Config} */
const config = {
	// prettier-plugin-tailwindcss must be listed last
	plugins: ["prettier-plugin-organize-imports", "prettier-plugin-tailwindcss"],
	trailingComma: "es5",
	tabWidth: 2,
	useTabs: true,
	printWidth: 120,
	semi: false,
}

export default config
