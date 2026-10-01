import { MobileTabBar } from "@/components/layout/mobile-tab-bar"
import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"

export default function MarketplaceLayout({ children }: LayoutProps<"/">) {
	return (
		<>
			<a
				href="#main"
				className="bg-background focus-visible:ring-ring/50 sr-only z-50 rounded-md px-4 py-2 font-medium focus-visible:not-sr-only focus-visible:fixed focus-visible:top-2 focus-visible:left-2 focus-visible:ring-3"
			>
				Skip to content
			</a>
			<SiteHeader />
			<div id="main" tabIndex={-1} className="flex flex-1 flex-col outline-none">
				{children}
			</div>
			<SiteFooter />
			<MobileTabBar />
		</>
	)
}
