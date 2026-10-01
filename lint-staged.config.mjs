/** @type {import("lint-staged").Configuration} */
const config = {
	"*.{js,jsx,ts,tsx,mjs}": ["eslint --fix", "prettier --write"],
	"*.{json,md,css,yml,yaml}": ["prettier --write"],
}

export default config
