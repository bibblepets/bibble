import Home from "@/app/(marketplace)/page"
import AuthError from "@/app/auth/error/page"
import ErrorPage from "@/app/error"
import NotFound from "@/app/not-found"
import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

describe("Home page", () => {
	it("renders the heading and all marketplace categories", () => {
		render(<Home />)

		expect(screen.getByRole("heading", { level: 1, name: "Bibble" })).toBeInTheDocument()
		for (const category of ["Pets for sale", "Adoption", "Accessories", "Services"]) {
			expect(screen.getByText(category)).toBeInTheDocument()
		}
	})
})

describe("Error boundary", () => {
	it("logs the error and retries on click", () => {
		const reset = vi.fn()
		const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})
		const error = new Error("boom")

		render(<ErrorPage error={error} reset={reset} />)
		fireEvent.click(screen.getByRole("button", { name: "Try again" }))

		expect(consoleError).toHaveBeenCalledWith(error)
		expect(reset).toHaveBeenCalledOnce()
		consoleError.mockRestore()
	})
})

describe("Fallback pages", () => {
	it("not-found links back home", () => {
		render(<NotFound />)
		expect(screen.getByRole("link", { name: "Back to home" })).toHaveAttribute("href", "/")
	})

	it("auth error links back home", () => {
		render(<AuthError />)
		expect(screen.getByRole("heading", { name: /couldn.t sign you in/i })).toBeInTheDocument()
		expect(screen.getByRole("link", { name: "Back to home" })).toHaveAttribute("href", "/")
	})
})
