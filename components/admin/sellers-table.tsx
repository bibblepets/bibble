import { timeSince } from "@/lib/admin/display"
import type { SellerQueueRow } from "@/lib/admin/queries"
import { formatLocation, sellerTypeLabels } from "@/lib/sellers/status"
import Link from "next/link"

export function SellersTable({ rows, waiting }: { rows: SellerQueueRow[]; waiting: boolean }) {
	if (rows.length === 0) {
		return <p className="text-muted-foreground py-16 text-center">No sellers here.</p>
	}

	return (
		<div className="overflow-x-auto">
			<table className="w-full text-left text-sm">
				<thead className="text-muted-foreground border-b">
					<tr>
						<th scope="col" className="py-3 pr-4 font-medium">
							Seller
						</th>
						<th scope="col" className="py-3 pr-4 font-medium">
							Type
						</th>
						<th scope="col" className="py-3 pr-4 font-medium">
							UEN
						</th>
						<th scope="col" className="py-3 pr-4 font-medium">
							AVS licence
						</th>
						<th scope="col" className="py-3 pr-4 font-medium">
							Area
						</th>
						<th scope="col" className="py-3 font-medium">
							{waiting ? "Waiting" : "Updated"}
						</th>
					</tr>
				</thead>
				<tbody className="divide-y">
					{rows.map((row) => (
						<tr key={row.id} className="hover:bg-muted/50">
							<td className="py-3 pr-4">
								<Link href={`/admin/sellers/${row.id}`} className="font-medium underline-offset-4 hover:underline">
									{row.displayName ?? "Unnamed seller"}
								</Link>
							</td>
							<td className="py-3 pr-4">{sellerTypeLabels[row.sellerType]}</td>
							<td className="py-3 pr-4 font-mono">{row.uen ?? "–"}</td>
							<td className="py-3 pr-4 font-mono">{row.licenceNo ?? "–"}</td>
							<td className="py-3 pr-4">{formatLocation(row.area) ?? "–"}</td>
							<td className="py-3 tabular-nums">
								{timeSince(waiting && row.submittedAt ? row.submittedAt : row.updatedAt)}
								{waiting ? "" : " ago"}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
