import { Field } from "@/components/forms/field"
import { TextareaField } from "@/components/forms/textarea-field"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

describe("FieldShell", () => {
	it("gives same-named fields in different forms their own ids", () => {
		render(
			<>
				<form>
					<TextareaField name="internalNote" label="Decision note" />
				</form>
				<form>
					<TextareaField name="internalNote" label="Correction note" error="Required." />
				</form>
			</>
		)

		const decision = screen.getByLabelText("Decision note")
		const correction = screen.getByLabelText("Correction note")
		expect(decision).not.toBe(correction)
		expect(decision.id).not.toBe(correction.id)
		expect(correction).toHaveAccessibleDescription("Required.")
		expect(decision).not.toHaveAccessibleDescription()
	})

	it("keeps the name for form submission", () => {
		render(<Field name="email" label="Email" />)
		expect(screen.getByLabelText("Email")).toHaveAttribute("name", "email")
	})
})
