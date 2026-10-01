import { Logo } from "@/components/brand/logo"

export default function AuthLayout({ children }: LayoutProps<"/">) {
	return (
		<>
			<header className="border-b">
				<div className="mx-auto flex h-16 w-full max-w-7xl items-center px-4 sm:px-6 md:h-20 lg:px-10">
					<Logo />
				</div>
			</header>
			{children}
		</>
	)
}
