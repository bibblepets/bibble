import { fieldErrorsFrom, valuesFrom } from "@/lib/forms"
import { describe, expect, it } from "vitest"
import { z } from "zod"

describe("fieldErrorsFrom", () => {
	it("keeps the first message per top-level field", () => {
		const schema = z.object({
			name: z.string().min(2, "Too short.").regex(/^A/, "Must start with A."),
			address: z.object({ city: z.string().min(1, "Enter a city.") }),
		})
		const result = schema.safeParse({ name: "b", address: { city: "" } })

		expect(result.success).toBe(false)
		expect(fieldErrorsFrom(result.error!)).toEqual({ name: "Too short.", address: "Enter a city." })
	})

	it("ignores form-level issues without a path", () => {
		const result = z
			.string()
			.refine(() => false, "Nope.")
			.safeParse("x")
		expect(fieldErrorsFrom(result.error!)).toEqual({})
	})
})

describe("valuesFrom", () => {
	it("returns only the requested string fields", () => {
		const formData = new FormData()
		formData.set("email", "a@b.test")
		formData.set("password", "secret")
		formData.set("avatar", new File(["x"], "a.png"))

		expect(valuesFrom(formData, ["email", "avatar", "missing"])).toEqual({ email: "a@b.test" })
	})
})
