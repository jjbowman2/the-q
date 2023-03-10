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
          court: number | null
          created_at: string
          created_by: string | null
          id: string
          players: string[]
        }
        Insert: {
          court?: number | null
          created_at?: string
          created_by?: string | null
          id?: string
          players?: string[]
        }
        Update: {
          court?: number | null
          created_at?: string
          created_by?: string | null
          id?: string
          players?: string[]
        }
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
