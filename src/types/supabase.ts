export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
	public: {
		Tables: {
			games: {
				Row: {
					created_at: string;
					created_by: string | null;
					created_by_anon: string | null;
					id: string;
					players: Database['public']['Tables']['players']['Row'][] | null;
					location: string;
					game_size: number;
				};
				Insert: {
					created_at?: string;
					created_by?: string | null;
					created_by_anon?: string | null;
					id?: string;
					location: string;
					game_size?: number;
				};
				Update: {
					created_at?: string;
					created_by?: string | null;
					created_by_anon?: string | null;
					id?: string;
					location?: string;
					game_size?: number;
				};
			};
			players: {
				Row: {
					created_at: string;
					created_by: string | null;
					created_by_anon: string | null;
					id: string;
                    game_id: string;
					player_name: string;
				};
				Insert: {
					created_at?: string;
					created_by?: string | null;
					created_by_anon?: string | null;
					id?: string;
                    game_id: string;
					player_name: string;
				};
				Update: {
					created_at?: string | null;
					created_by?: string | null;
					created_by_anon?: string | null;
					id?: string;
                    game_id?: string | null;
					player_name?: string | null;
				};
			};
			locations: {
				Row: {
					courts_available: number;
					id: string;
					image_url: string | null;
					location_name: string;
				};
				Insert: {
					courts_available?: number;
					id?: string;
					image_url?: string | null;
					location_name: string;
				};
				Update: {
					courts_available?: number;
					id?: string;
					image_url?: string | null;
					location_name?: string;
				};
			};
			reports: {
				Row: {
					created_at: string;
					game_id: string;
					id: string;
					report_type: string;
					reported_by: string | null;
				};
				Insert: {
					created_at?: string;
					game_id: string;
					id?: string;
					report_type?: string;
					reported_by?: string | null;
				};
				Update: {
					created_at?: string;
					game_id?: string;
					id?: string;
					report_type?: string;
					reported_by?: string | null;
				};
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
}
