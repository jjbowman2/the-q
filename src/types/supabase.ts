export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      games: {
        Row: {
          created_at: string
          created_by: string | null
          created_by_anon: string | null
          game_size: number | null
          id: string
          location: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          created_by_anon?: string | null
          game_size?: number | null
          id?: string
          location: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          created_by_anon?: string | null
          game_size?: number | null
          id?: string
          location?: string
        }
        Relationships: [
          {
            foreignKeyName: "games_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_location_fkey"
            columns: ["location"]
            referencedRelation: "locations"
            referencedColumns: ["id"]
          }
        ]
      }
      locations: {
        Row: {
          courts_available: number
          id: string
          image_url: string | null
          location_name: string
        }
        Insert: {
          courts_available?: number
          id?: string
          image_url?: string | null
          location_name: string
        }
        Update: {
          courts_available?: number
          id?: string
          image_url?: string | null
          location_name?: string
        }
        Relationships: []
      }
      players: {
        Row: {
          created_at: string | null
          created_by: string | null
          created_by_anon: string | null
          game_id: string
          id: string
          player_name: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          created_by_anon?: string | null
          game_id: string
          id?: string
          player_name: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          created_by_anon?: string | null
          game_id?: string
          id?: string
          player_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "players_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "players_game_id_fkey"
            columns: ["game_id"]
            referencedRelation: "games"
            referencedColumns: ["id"]
          }
        ]
      }
      reports: {
        Row: {
          created_at: string
          game_id: string
          id: string
          report_type: string
          reported_by: string | null
        }
        Insert: {
          created_at?: string
          game_id: string
          id?: string
          report_type?: string
          reported_by?: string | null
        }
        Update: {
          created_at?: string
          game_id?: string
          id?: string
          report_type?: string
          reported_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_game_id_fkey"
            columns: ["game_id"]
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reported_by_fkey"
            columns: ["reported_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
