import CheckEmailPage from "@/app/(auth)/check-email/page"
import ForgotPasswordPage from "@/app/(auth)/forgot-password/page"
import AuthLayout from "@/app/(auth)/layout"
import LogInPage from "@/app/(auth)/login/page"
import ResetPasswordPage from "@/app/(auth)/reset-password/page"
import SignUpPage from "@/app/(auth)/signup/page"
import type { CurrentUser } from "@/lib/auth/session"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

const session = vi.hoisted(() => ({ user: null as CurrentUser | null }))
vi.mock("@/lib/auth/session", () => ({
	getCurrentUser: async () => session.user,
	requireUser: async () => {
		if (!session.user) throw new Error("NEXT_REDIRECT")
		return session.user
	},
}))

const redirect = vi.hoisted(() =>
	vi.fn((path: string) => {
		throw new Error(`NEXT_REDIRECT ${path}`)
	})
)
vi.mock("next/navigation", () => ({ redirect }))

const actions = vi.hoisted(() => ({
	logIn: vi.fn(),
	signUp: vi.fn(),
	requestPasswordReset: vi.fn(),
	resetPassword: vi.fn(),
}))
vi.mock("@/lib/auth/actions", () => actions)

const alice: CurrentUser = { id: "user-1", email: "alice@bibble.test", displayName: "Alice" }
const params = <T extends object>(value: T) => ({ params: Promise.resolve({}), searchParams: Promise.resolve(value) })

beforeEach(() => {
	session.user = null
	vi.clearAllMocks()
	for (const action of Object.values(actions)) action.mockResolvedValue({})
})

describe("AuthLayout", () => {
	it("shows the logo above the page", () => {
		render(
			<AuthLayout params={Promise.resolve({})}>
				<p>Form</p>
			</AuthLayout>
		)
		expect(screen.getByRole("link", { name: "Bibble home" })).toBeInTheDocument()
		expect(screen.getByText("Form")).toBeInTheDocument()
	})
})

describe("Log in page", () => {
	it("carries next through the form and the sign-up link", async () => {
		const { container } = render(await LogInPage(params({ next: "/seller" })))

		expect(screen.getByRole("heading", { name: "Welcome back" })).toBeInTheDocument()
		expect(screen.getByRole("link", { name: "Create an account" })).toHaveAttribute("href", "/signup?next=%2Fseller")
		expect(container.querySelector('input[name="next"]')).toHaveValue("/seller")
		expect(screen.getByRole("link", { name: "Forgot password?" })).toHaveAttribute("href", "/forgot-password")
	})

	it("links to plain sign up without next", async () => {
		const { container } = render(await LogInPage(params({})))
		expect(screen.getByRole("link", { name: "Create an account" })).toHaveAttribute("href", "/signup")
		expect(container.querySelector('input[name="next"]')).toBeNull()
	})

	it("sends signed-in users on their way", async () => {
		session.user = alice
		await expect(LogInPage(params({ next: "/seller" }))).rejects.toThrow("NEXT_REDIRECT /seller")
	})

	it("shows errors returned by the action", async () => {
		actions.logIn.mockResolvedValue({
			formError: "That email and password don't match.",
			values: { email: "a@b.test" },
		})
		const user = userEvent.setup()
		render(await LogInPage(params({})))

		await user.type(screen.getByLabelText("Email"), "a@b.test")
		await user.type(screen.getByLabelText("Password"), "wrong")
		await user.click(screen.getByRole("button", { name: "Log in" }))

		expect(await screen.findByRole("alert")).toHaveTextContent("don't match")
		expect(screen.getByLabelText("Email")).toHaveValue("a@b.test")
	})
})

describe("Sign up page", () => {
	it("renders the form and log-in link", async () => {
		render(await SignUpPage(params({ next: "/seller" })))

		expect(screen.getByRole("heading", { name: "Create your account" })).toBeInTheDocument()
		expect(screen.getByRole("link", { name: "Log in" })).toHaveAttribute("href", "/login?next=%2Fseller")
		expect(screen.getByLabelText("Password")).toHaveAccessibleDescription(
			"At least 8 characters, with letters and numbers."
		)
	})

	it("links to plain log in without next", async () => {
		render(await SignUpPage(params({})))
		expect(screen.getByRole("link", { name: "Log in" })).toHaveAttribute("href", "/login")
	})

	it("redirects signed-in users home", async () => {
		session.user = alice
		await expect(SignUpPage(params({}))).rejects.toThrow("NEXT_REDIRECT /")
	})

	it("marks invalid fields", async () => {
		actions.signUp.mockResolvedValue({ fieldErrors: { displayName: "Enter your name." } })
		const user = userEvent.setup()
		render(await SignUpPage(params({})))

		await user.click(screen.getByRole("button", { name: "Create account" }))

		const name = await screen.findByLabelText("Name")
		expect(name).toHaveAttribute("aria-invalid", "true")
		expect(name).toHaveAccessibleDescription("Enter your name.")
	})
})

describe("Check email page", () => {
	it.each([
		["signup", /confirm it/],
		["reset", /reset your password/],
		[undefined, /confirm it/],
	])("explains the next step for %s", async (purpose, text) => {
		render(await CheckEmailPage(params({ for: purpose })))
		expect(screen.getByText(text)).toBeInTheDocument()
		expect(screen.getByRole("link", { name: "Back to log in" })).toHaveAttribute("href", "/login")
	})
})

describe("Forgot password page", () => {
	it("submits the email", async () => {
		const user = userEvent.setup()
		render(<ForgotPasswordPage />)

		await user.type(screen.getByLabelText("Email"), "a@b.test")
		await user.click(screen.getByRole("button", { name: "Send reset link" }))

		expect(actions.requestPasswordReset).toHaveBeenCalledOnce()
	})
})

describe("Reset password page", () => {
	it("requires the recovery session", async () => {
		await expect(ResetPasswordPage()).rejects.toThrow("NEXT_REDIRECT")
	})

	it("shows the account and both password fields", async () => {
		session.user = alice
		render(await ResetPasswordPage())

		expect(screen.getByText("For alice@bibble.test")).toBeInTheDocument()
		expect(screen.getByLabelText("New password")).toBeInTheDocument()
		expect(screen.getByLabelText("Confirm new password")).toBeInTheDocument()
	})
})
