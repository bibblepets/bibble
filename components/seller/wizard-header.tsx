import { Logo } from "@/components/brand/logo"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

type WizardHeaderProps =
	/** Saves the step's form, then returns to the dashboard. */
	| { saveFormId: string; exitHref?: never }
	/** Steps without a form (or before the seller exists) just leave. */
	| { saveFormId?: never; exitHref: string }

const exitClassName = cn(buttonVariants({ variant: "outline" }), "h-9 rounded-full px-4")

/** Minimal full-screen header for the onboarding wizard, like Airbnb's host flow. */
export function WizardHeader({ saveFormId, exitHref }: WizardHeaderProps) {
	return (
		<header className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 md:h-20 lg:px-10">
			<Logo />
			{saveFormId ? (
				<Button type="submit" form={saveFormId} name="intent" value="exit" variant="outline" className={exitClassName}>
					Save &amp; exit
				</Button>
			) : (
				<Link href={exitHref ?? "/seller"} className={exitClassName}>
					Exit
				</Link>
			)}
		</header>
	)
}
