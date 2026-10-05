export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
	graphql_public: {
		Tables: {
			[_ in never]: never
		}
		Views: {
			[_ in never]: never
		}
		Functions: {
			graphql: { Args: { extensions?: Json; operationName?: string; query?: string; variables?: Json }; Returns: Json }
		}
		Enums: {
			[_ in never]: never
		}
		CompositeTypes: {
			[_ in never]: never
		}
	}
	public: {
		Tables: {
			areas: {
				Row: {
					id: number
					name: string
					region: string
					slug: string
				}
				Insert: {
					id?: never
					name: string
					region: string
					slug: string
				}
				Update: {
					id?: never
					name?: string
					region?: string
					slug?: string
				}
				Relationships: []
			}
			breeds: {
				Row: {
					hdb_approved: boolean | null
					id: number
					name: string
					slug: string
					species_id: number
					specified_part: number | null
				}
				Insert: {
					hdb_approved?: boolean | null
					id?: never
					name: string
					slug: string
					species_id: number
					specified_part?: number | null
				}
				Update: {
					hdb_approved?: boolean | null
					id?: never
					name?: string
					slug?: string
					species_id?: number
					specified_part?: number | null
				}
				Relationships: [
					{
						foreignKeyName: "breeds_species_id_fkey"
						columns: ["species_id"]
						isOneToOne: false
						referencedRelation: "species"
						referencedColumns: ["id"]
					},
				]
			}
			categories: {
				Row: {
					icon: string
					id: number
					listing_type: string | null
					name: string
					requires_review: boolean
					slug: string
					sort_order: number
					species_id: number | null
					status: string
					vertical: string
				}
				Insert: {
					icon: string
					id?: never
					listing_type?: string | null
					name: string
					requires_review?: boolean
					slug: string
					sort_order: number
					species_id?: number | null
					status: string
					vertical: string
				}
				Update: {
					icon?: string
					id?: never
					listing_type?: string | null
					name?: string
					requires_review?: boolean
					slug?: string
					sort_order?: number
					species_id?: number | null
					status?: string
					vertical?: string
				}
				Relationships: [
					{
						foreignKeyName: "categories_species_id_fkey"
						columns: ["species_id"]
						isOneToOne: false
						referencedRelation: "species"
						referencedColumns: ["id"]
					},
				]
			}
			listing_documents: {
				Row: {
					content_type: string
					created_at: string
					file_name: string
					id: string
					kind: string
					listing_id: string
					size_bytes: number
					storage_path: string
					uploaded_by: string
				}
				Insert: {
					content_type: string
					created_at?: string
					file_name: string
					id?: string
					kind: string
					listing_id: string
					size_bytes: number
					storage_path: string
					uploaded_by: string
				}
				Update: {
					content_type?: string
					created_at?: string
					file_name?: string
					id?: string
					kind?: string
					listing_id?: string
					size_bytes?: number
					storage_path?: string
					uploaded_by?: string
				}
				Relationships: [
					{
						foreignKeyName: "listing_documents_listing_id_fkey"
						columns: ["listing_id"]
						isOneToOne: false
						referencedRelation: "listings"
						referencedColumns: ["id"]
					},
				]
			}
			listings: {
				Row: {
					category_id: number
					created_at: string
					currency: string
					description: string | null
					id: string
					price_cents: number | null
					published_at: string | null
					seller_id: string
					status: string
					status_changed_at: string
					submitted_at: string | null
					title: string | null
					updated_at: string
					vertical: string
				}
				Insert: {
					category_id: number
					created_at?: string
					currency?: string
					description?: string | null
					id?: string
					price_cents?: number | null
					published_at?: string | null
					seller_id: string
					status?: string
					status_changed_at?: string
					submitted_at?: string | null
					title?: string | null
					updated_at?: string
					vertical: string
				}
				Update: {
					category_id?: number
					created_at?: string
					currency?: string
					description?: string | null
					id?: string
					price_cents?: number | null
					published_at?: string | null
					seller_id?: string
					status?: string
					status_changed_at?: string
					submitted_at?: string | null
					title?: string | null
					updated_at?: string
					vertical?: string
				}
				Relationships: [
					{
						foreignKeyName: "listings_category_id_fkey"
						columns: ["category_id"]
						isOneToOne: false
						referencedRelation: "categories"
						referencedColumns: ["id"]
					},
					{
						foreignKeyName: "listings_seller_id_fkey"
						columns: ["seller_id"]
						isOneToOne: false
						referencedRelation: "sellers"
						referencedColumns: ["id"]
					},
				]
			}
			pet_health_records: {
				Row: {
					clinic: string | null
					created_at: string
					given_on: string
					id: string
					kind: string
					listing_id: string
					product: string
				}
				Insert: {
					clinic?: string | null
					created_at?: string
					given_on: string
					id?: string
					kind: string
					listing_id: string
					product: string
				}
				Update: {
					clinic?: string | null
					created_at?: string
					given_on?: string
					id?: string
					kind?: string
					listing_id?: string
					product?: string
				}
				Relationships: [
					{
						foreignKeyName: "pet_health_records_listing_id_fkey"
						columns: ["listing_id"]
						isOneToOne: false
						referencedRelation: "listings"
						referencedColumns: ["id"]
					},
				]
			}
			pet_listing_details: {
				Row: {
					breed_id: number | null
					colour: string | null
					cross_breed_id: number | null
					date_of_birth: string | null
					height_cm: number | null
					listing_id: string
					ready_date: string | null
					sex: string | null
					sterilised: boolean
					vertical: string
					weight_kg: number | null
				}
				Insert: {
					breed_id?: number | null
					colour?: string | null
					cross_breed_id?: number | null
					date_of_birth?: string | null
					height_cm?: number | null
					listing_id: string
					ready_date?: string | null
					sex?: string | null
					sterilised?: boolean
					vertical?: string
					weight_kg?: number | null
				}
				Update: {
					breed_id?: number | null
					colour?: string | null
					cross_breed_id?: number | null
					date_of_birth?: string | null
					height_cm?: number | null
					listing_id?: string
					ready_date?: string | null
					sex?: string | null
					sterilised?: boolean
					vertical?: string
					weight_kg?: number | null
				}
				Relationships: [
					{
						foreignKeyName: "pet_listing_details_breed_id_fkey"
						columns: ["breed_id"]
						isOneToOne: false
						referencedRelation: "breeds"
						referencedColumns: ["id"]
					},
					{
						foreignKeyName: "pet_listing_details_cross_breed_id_fkey"
						columns: ["cross_breed_id"]
						isOneToOne: false
						referencedRelation: "breeds"
						referencedColumns: ["id"]
					},
					{
						foreignKeyName: "pet_listing_details_listing_id_vertical_fkey"
						columns: ["listing_id", "vertical"]
						isOneToOne: false
						referencedRelation: "listings"
						referencedColumns: ["id", "vertical"]
					},
				]
			}
			pet_listing_private: {
				Row: {
					arrival_date: string | null
					import_permit_no: string | null
					listing_id: string
					microchip_no: string | null
					source: string | null
					source_licence_no: string | null
				}
				Insert: {
					arrival_date?: string | null
					import_permit_no?: string | null
					listing_id: string
					microchip_no?: string | null
					source?: string | null
					source_licence_no?: string | null
				}
				Update: {
					arrival_date?: string | null
					import_permit_no?: string | null
					listing_id?: string
					microchip_no?: string | null
					source?: string | null
					source_licence_no?: string | null
				}
				Relationships: [
					{
						foreignKeyName: "pet_listing_private_listing_id_fkey"
						columns: ["listing_id"]
						isOneToOne: true
						referencedRelation: "listings"
						referencedColumns: ["id"]
					},
				]
			}
			platform_admins: {
				Row: {
					created_at: string
					user_id: string
				}
				Insert: {
					created_at?: string
					user_id: string
				}
				Update: {
					created_at?: string
					user_id?: string
				}
				Relationships: []
			}
			profiles: {
				Row: {
					avatar_url: string | null
					created_at: string
					display_name: string | null
					id: string
					updated_at: string
				}
				Insert: {
					avatar_url?: string | null
					created_at?: string
					display_name?: string | null
					id: string
					updated_at?: string
				}
				Update: {
					avatar_url?: string | null
					created_at?: string
					display_name?: string | null
					id?: string
					updated_at?: string
				}
				Relationships: []
			}
			seller_documents: {
				Row: {
					content_type: string
					created_at: string
					file_name: string
					id: string
					kind: string
					seller_id: string
					size_bytes: number
					storage_path: string
					uploaded_by: string
				}
				Insert: {
					content_type: string
					created_at?: string
					file_name: string
					id?: string
					kind: string
					seller_id: string
					size_bytes: number
					storage_path: string
					uploaded_by: string
				}
				Update: {
					content_type?: string
					created_at?: string
					file_name?: string
					id?: string
					kind?: string
					seller_id?: string
					size_bytes?: number
					storage_path?: string
					uploaded_by?: string
				}
				Relationships: [
					{
						foreignKeyName: "seller_documents_seller_id_fkey"
						columns: ["seller_id"]
						isOneToOne: false
						referencedRelation: "sellers"
						referencedColumns: ["id"]
					},
				]
			}
			seller_members: {
				Row: {
					created_at: string
					role: string
					seller_id: string
					user_id: string
				}
				Insert: {
					created_at?: string
					role?: string
					seller_id: string
					user_id: string
				}
				Update: {
					created_at?: string
					role?: string
					seller_id?: string
					user_id?: string
				}
				Relationships: [
					{
						foreignKeyName: "seller_members_seller_id_fkey"
						columns: ["seller_id"]
						isOneToOne: false
						referencedRelation: "sellers"
						referencedColumns: ["id"]
					},
				]
			}
			seller_private_details: {
				Row: {
					address_line1: string | null
					address_line2: string | null
					contact_email: string | null
					contact_phone: string | null
					postal_code: string | null
					seller_id: string
					updated_at: string
				}
				Insert: {
					address_line1?: string | null
					address_line2?: string | null
					contact_email?: string | null
					contact_phone?: string | null
					postal_code?: string | null
					seller_id: string
					updated_at?: string
				}
				Update: {
					address_line1?: string | null
					address_line2?: string | null
					contact_email?: string | null
					contact_phone?: string | null
					postal_code?: string | null
					seller_id?: string
					updated_at?: string
				}
				Relationships: [
					{
						foreignKeyName: "seller_private_details_seller_id_fkey"
						columns: ["seller_id"]
						isOneToOne: true
						referencedRelation: "sellers"
						referencedColumns: ["id"]
					},
				]
			}
			seller_reviews: {
				Row: {
					checklist: string[]
					created_at: string
					decision: string
					id: string
					internal_note: string | null
					message: string | null
					reviewer_id: string | null
					seller_id: string
				}
				Insert: {
					checklist?: string[]
					created_at?: string
					decision: string
					id?: string
					internal_note?: string | null
					message?: string | null
					reviewer_id?: string | null
					seller_id: string
				}
				Update: {
					checklist?: string[]
					created_at?: string
					decision?: string
					id?: string
					internal_note?: string | null
					message?: string | null
					reviewer_id?: string | null
					seller_id?: string
				}
				Relationships: [
					{
						foreignKeyName: "seller_reviews_reviewer_id_fkey"
						columns: ["reviewer_id"]
						isOneToOne: false
						referencedRelation: "profiles"
						referencedColumns: ["id"]
					},
					{
						foreignKeyName: "seller_reviews_seller_id_fkey"
						columns: ["seller_id"]
						isOneToOne: false
						referencedRelation: "sellers"
						referencedColumns: ["id"]
					},
				]
			}
			seller_species: {
				Row: {
					seller_id: string
					species_id: number
				}
				Insert: {
					seller_id: string
					species_id: number
				}
				Update: {
					seller_id?: string
					species_id?: number
				}
				Relationships: [
					{
						foreignKeyName: "seller_species_seller_id_fkey"
						columns: ["seller_id"]
						isOneToOne: false
						referencedRelation: "sellers"
						referencedColumns: ["id"]
					},
					{
						foreignKeyName: "seller_species_species_id_fkey"
						columns: ["species_id"]
						isOneToOne: false
						referencedRelation: "species"
						referencedColumns: ["id"]
					},
				]
			}
			sellers: {
				Row: {
					about: string | null
					area_id: number | null
					created_at: string
					display_name: string | null
					entity_type: string
					id: string
					legal_name: string | null
					licence_expires_on: string | null
					licence_no: string | null
					seller_type: string
					slug: string | null
					submitted_at: string | null
					uen: string | null
					updated_at: string
					verification_status: string
					verified_at: string | null
				}
				Insert: {
					about?: string | null
					area_id?: number | null
					created_at?: string
					display_name?: string | null
					entity_type?: string
					id?: string
					legal_name?: string | null
					licence_expires_on?: string | null
					licence_no?: string | null
					seller_type: string
					slug?: string | null
					submitted_at?: string | null
					uen?: string | null
					updated_at?: string
					verification_status?: string
					verified_at?: string | null
				}
				Update: {
					about?: string | null
					area_id?: number | null
					created_at?: string
					display_name?: string | null
					entity_type?: string
					id?: string
					legal_name?: string | null
					licence_expires_on?: string | null
					licence_no?: string | null
					seller_type?: string
					slug?: string | null
					submitted_at?: string | null
					uen?: string | null
					updated_at?: string
					verification_status?: string
					verified_at?: string | null
				}
				Relationships: [
					{
						foreignKeyName: "sellers_area_id_fkey"
						columns: ["area_id"]
						isOneToOne: false
						referencedRelation: "areas"
						referencedColumns: ["id"]
					},
				]
			}
			species: {
				Row: {
					id: number
					is_active: boolean
					name: string
					slug: string
				}
				Insert: {
					id?: never
					is_active?: boolean
					name: string
					slug: string
				}
				Update: {
					id?: never
					is_active?: boolean
					name?: string
					slug?: string
				}
				Relationships: []
			}
		}
		Views: {
			[_ in never]: never
		}
		Functions: {
			admin_correct_seller: {
				Args: {
					p_internal_note: string
					p_legal_name: string
					p_licence_no: string
					p_seller_id: string
					p_seller_type: string
					p_species: string[]
					p_uen: string
				}
				Returns: undefined
			}
			admin_seller_owner: {
				Args: { p_seller_id: string }
				Returns: {
					display_name: string
					email: string
					user_id: string
				}[]
			}
			admin_seller_status_counts: {
				Args: Record<PropertyKey, never>
				Returns: {
					status: string
					total: number
				}[]
			}
			archive_listing: { Args: { p_listing_id: string }; Returns: undefined }
			create_listing: { Args: { p_category: string; p_seller_id: string }; Returns: string }
			create_seller: { Args: { p_seller_type: string; p_species: string[] }; Returns: string }
			get_seller_feedback: {
				Args: { p_seller_id: string }
				Returns: {
					created_at: string
					decision: string
					message: string
				}[]
			}
			is_listing_editable: { Args: { p_listing_id: string }; Returns: boolean }
			is_listing_member: { Args: { p_listing_id: string }; Returns: boolean }
			is_listing_public: { Args: { p_listing_id: string }; Returns: boolean }
			is_platform_admin: { Args: Record<PropertyKey, never>; Returns: boolean }
			is_seller_member: { Args: { target_seller_id: string }; Returns: boolean }
			review_seller: {
				Args: {
					p_checklist?: string[]
					p_decision: string
					p_internal_note?: string
					p_message?: string
					p_seller_id: string
				}
				Returns: undefined
			}
			revise_listing: { Args: { p_listing_id: string }; Returns: undefined }
			seller_approval_checklist: { Args: Record<PropertyKey, never>; Returns: string[] }
			seller_can_list: { Args: { target_seller_id: string; target_species_id: number }; Returns: boolean }
			set_listing_availability: { Args: { p_listing_id: string; p_status: string }; Returns: undefined }
			submit_listing_for_review: { Args: { p_listing_id: string }; Returns: undefined }
			submit_seller_for_verification: { Args: { p_seller_id: string }; Returns: undefined }
		}
		Enums: {
			[_ in never]: never
		}
		CompositeTypes: {
			[_ in never]: never
		}
	}
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		keyof (DefaultSchema["Tables"] & DefaultSchema["Views"]) | { schema: keyof DatabaseWithoutInternals },
	TableName extends (DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals
	}
		? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
				DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
		: never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
	? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
			DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R
		}
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
		? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
				Row: infer R
			}
			? R
			: never
		: never

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
	TableName extends (DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I
		}
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Insert: infer I
			}
			? I
			: never
		: never

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
	TableName extends (DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U
		}
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Update: infer U
			}
			? U
			: never
		: never

export type Enums<
	DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
	EnumName extends (DefaultSchemaEnumNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
		: never) = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
	? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
		? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
		: never

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
	CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals
	}
		? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
		: never) = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
	? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
		? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
		: never

export const Constants = {
	graphql_public: {
		Enums: {},
	},
	public: {
		Enums: {},
	},
} as const
