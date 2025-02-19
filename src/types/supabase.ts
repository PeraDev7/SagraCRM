export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          parent_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          parent_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          parent_id?: string | null
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          price: number
          inventory: number
          category_id: string
          status: 'draft' | 'active'
          images: string[]
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          price: number
          inventory: number
          category_id: string
          status: 'draft' | 'active'
          images: string[]
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          price?: number
          inventory?: number
          category_id?: string
          status?: 'draft' | 'active'
          images?: string[]
          user_id?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          first_name: string
          last_name: string
          email: string
          total: number
          status: 'pending' | 'completed' | 'cancelled'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          first_name: string
          last_name: string
          email: string
          total: number
          status?: 'pending' | 'completed' | 'cancelled'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          first_name?: string
          last_name?: string
          email?: string
          total?: number
          status?: 'pending' | 'completed' | 'cancelled'
          created_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
          created_at?: string
        }
      }
      api_keys: {
        Row: {
          user_id: string
          key: string
          created_at: string
        }
        Insert: {
          user_id: string
          key: string
          created_at?: string
        }
        Update: {
          user_id?: string
          key?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_category_path: {
        Args: {
          category_id: string
        }
        Returns: {
          id: string
          name: string
          level: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}