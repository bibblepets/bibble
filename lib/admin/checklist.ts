/**
 * Checks an admin must tick before approving a seller. The keys must match public.seller_approval_checklist() in the
 * seller_reviews migration (a unit test compares them); the wording can change freely.
 */
export const approvalChecklist = [
	{
		key: "avs_registry",
		label: "Licence number is in the current AVS registry and not revoked",
	},
	{
		key: "registry_matches_acra",
		label: "Registry name and address match the ACRA BizFile and the details given",
	},
	{
		key: "licence_scope",
		label: "Licence type and animals covered match the seller type and licensed species",
	},
	{
		key: "licence_expiry",
		label: "Licence expiry date matches the uploaded licence",
	},
	{
		key: "uen_matches",
		label: "UEN and registered name match the ACRA BizFile",
	},
	{
		key: "documents_valid",
		label: "Documents are legible, current and show no signs of alteration",
	},
] as const

export type ChecklistKey = (typeof approvalChecklist)[number]["key"]

export const checklistKeys: readonly ChecklistKey[] = approvalChecklist.map((item) => item.key)
