import { Field } from "@/components/forms/field"
import { SelectField } from "@/components/forms/select-field"
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

describe("native fields with new defaults", () => {
	it("show a select's new default after a save", () => {
		const options = (
			<>
				<option value="">Choose</option>
				<option value="1">Beagle</option>
			</>
		)
		const { rerender } = render(
			<SelectField name="breedId" label="Breed" defaultValue="">
				{options}
			</SelectField>
		)
		rerender(
			<SelectField name="breedId" label="Breed" defaultValue="1">
				{options}
			</SelectField>
		)
		expect(screen.getByLabelText("Breed")).toHaveValue("1")
	})

	it("show a textarea's new default after a save", () => {
		const { rerender } = render(<TextareaField name="description" label="Description" defaultValue="" />)
		rerender(<TextareaField name="description" label="Description" defaultValue="Playful" />)
		expect(screen.getByLabelText("Description")).toHaveValue("Playful")
	})
})
