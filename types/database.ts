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
			create_seller: { Args: { p_seller_type: string; p_species: string[] }; Returns: string }
			is_platform_admin: { Args: Record<PropertyKey, never>; Returns: boolean }
			is_seller_member: { Args: { target_seller_id: string }; Returns: boolean }
			seller_can_list: { Args: { target_seller_id: string; target_species_id: number }; Returns: boolean }
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
