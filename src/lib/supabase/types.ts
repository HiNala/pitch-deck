// Database types for Supabase TypeScript support
// This will be generated from your database schema

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          created_at?: string
        }
      }
      decks: {
        Row: {
          id: string
          user_id: string
          title: string
          template_key: string
          slide_count: number
          status: 'DRAFT' | 'FINAL'
          pdf_url: string | null
          share_slug: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          template_key: string
          slide_count: number
          status?: 'DRAFT' | 'FINAL'
          pdf_url?: string | null
          share_slug?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          template_key?: string
          slide_count?: number
          status?: 'DRAFT' | 'FINAL'
          pdf_url?: string | null
          share_slug?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      slides: {
        Row: {
          id: string
          deck_id: string
          index: number
          json: Record<string, unknown>
          updated_at: string
        }
        Insert: {
          id?: string
          deck_id: string
          index: number
          json: Record<string, unknown>
          updated_at?: string
        }
        Update: {
          id?: string
          deck_id?: string
          index?: number
          json?: Record<string, unknown>
          updated_at?: string
        }
      }
      deck_versions: {
        Row: {
          id: string
          deck_id: string
          version_no: number
          pdf_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          deck_id: string
          version_no: number
          pdf_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          deck_id?: string
          version_no?: number
          pdf_url?: string | null
          created_at?: string
        }
      }
      deck_visits: {
        Row: {
          id: number
          deck_id: string
          user_id: string | null
          ip_hash: string
          ua: string
          duration: number
          created_at: string
        }
        Insert: {
          id?: number
          deck_id: string
          user_id?: string | null
          ip_hash: string
          ua: string
          duration: number
          created_at?: string
        }
        Update: {
          id?: number
          deck_id?: string
          user_id?: string | null
          ip_hash?: string
          ua?: string
          duration?: number
          created_at?: string
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
      deck_status: 'DRAFT' | 'FINAL'
    }
  }
} 