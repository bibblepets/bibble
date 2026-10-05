/** Text colour for placeholder initials. At least 5.8:1 against every gradient stop below. */
export const PLACEHOLDER_INK = "#0B4F75"

// Soft gradients around the brand blue, plus a few warm tones so a grid of cards doesn't look uniform.
const gradients = [
	["#E0F2FE", "#BAE6FD"],
	["#CFFAFE", "#A5F3FC"],
	["#E0E7FF", "#C7D2FE"],
	["#D1FAE5", "#A7F3D0"],
	["#FEF3C7", "#FDE68A"],
	["#FCE7F3", "#FBCFE8"],
] as const

export type Placeholder = { initials: string; from: string; to: string }

/** Up to two uppercase initials from the first two words of `label`, or "?" when there are none. */
export function initialsFor(label: string): string {
	const words = label.trim().split(/\s+/).filter(Boolean)
	const initials = words
		.slice(0, 2)
		.map((word) => Array.from(word)[0].toLocaleUpperCase("en-SG"))
		.join("")
	return initials || "?"
}

/** 32-bit FNV-1a: cheap, stable across runs, and spreads similar strings apart. */
function hash(input: string): number {
	let h = 0x811c9dc5
	for (const char of input) {
		h ^= char.codePointAt(0)!
		h = Math.imul(h, 0x01000193)
	}
	return h >>> 0
}

/**
 * Deterministic stand-in artwork for listings without images. The same `seed` always picks the same
 * gradient, so a card looks identical across renders and between server and client.
 */
export function placeholderFor(label: string, seed: string = label): Placeholder {
	const [from, to] = gradients[hash(seed) % gradients.length]
	return { initials: initialsFor(label), from, to }
}
