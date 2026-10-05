import { Field } from "@/components/forms/field"
import { render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

describe("Field", () => {
	const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})
	afterEach(() => consoleError.mockClear())

	it("takes a new default value from a failed submit without a Base UI warning", () => {
		const { rerender } = render(<Field name="email" label="Email" />)
		expect(screen.getByLabelText("Email")).toHaveValue("")

		rerender(<Field name="email" label="Email" defaultValue="alice@bibble.test" error="Try again." />)

		expect(screen.getByLabelText("Email")).toHaveValue("alice@bibble.test")
		expect(consoleError).not.toHaveBeenCalled()
	})

	it("treats an empty value sent back as unchanged", () => {
		const { rerender } = render(<Field name="displayName" label="Name" />)

		rerender(<Field name="displayName" label="Name" defaultValue="" error="Enter your name." />)

		expect(screen.getByLabelText("Name")).toHaveValue("")
		expect(consoleError).not.toHaveBeenCalled()
	})
})
