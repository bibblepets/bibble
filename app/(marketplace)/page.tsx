import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const categories = [
	{ title: "Pets for sale", description: "Browse pets from verified breeders and sellers." },
	{ title: "Adoption", description: "Give a rescue a loving home." },
	{ title: "Accessories", description: "Food, toys, beds and everything in between." },
	{ title: "Services", description: "Grooming, sitting, training and vet care." },
]

export default function Home() {
	return (
		<main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-12 px-6 py-24">
			<section className="flex flex-col gap-4">
				<h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Bibble</h1>
				<p className="text-muted-foreground max-w-2xl text-lg">
					The all-in-one pet marketplace. Find your next companion, and everything they need.
				</p>
			</section>

			<section aria-label="Categories" className="grid gap-4 sm:grid-cols-2">
				{categories.map((category) => (
					<Card key={category.title}>
						<CardHeader>
							<CardTitle>{category.title}</CardTitle>
							<CardDescription>{category.description}</CardDescription>
						</CardHeader>
					</Card>
				))}
			</section>
		</main>
	)
}
