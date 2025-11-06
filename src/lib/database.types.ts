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
      profiles: {
        Row: {
          id: string
          username: string
          full_name: string
          bio: string
          avatar_url: string | null
          location: string | null
          wallet_address: string | null
          is_verified: boolean
          profile_views: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          full_name: string
          bio?: string
          avatar_url?: string | null
          location?: string | null
          wallet_address?: string | null
          is_verified?: boolean
          profile_views?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          full_name?: string
          bio?: string
          avatar_url?: string | null
          location?: string | null
          wallet_address?: string | null
          is_verified?: boolean
          profile_views?: number
          created_at?: string
          updated_at?: string
        }
      }
      issuers: {
        Row: {
          id: string
          name: string
          description: string
          logo_url: string | null
          website: string | null
          verified: boolean
          wallet_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string
          logo_url?: string | null
          website?: string | null
          verified?: boolean
          wallet_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          logo_url?: string | null
          website?: string | null
          verified?: boolean
          wallet_address?: string | null
          created_at?: string
        }
      }
      badges: {
        Row: {
          id: string
          name: string
          description: string
          image_url: string
          category: 'skill' | 'achievement' | 'certification' | 'course' | 'event'
          issuer_id: string | null
          contract_address: string | null
          token_standard: string
          total_issued: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          image_url: string
          category: 'skill' | 'achievement' | 'certification' | 'course' | 'event'
          issuer_id?: string | null
          contract_address?: string | null
          token_standard?: string
          total_issued?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          image_url?: string
          category?: 'skill' | 'achievement' | 'certification' | 'course' | 'event'
          issuer_id?: string | null
          contract_address?: string | null
          token_standard?: string
          total_issued?: number
          is_active?: boolean
          created_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          user_id: string
          badge_id: string
          token_id: string | null
          transaction_hash: string | null
          blockchain_verified: boolean
          earned_at: string
          metadata: Json
          is_featured: boolean
          is_public: boolean
        }
        Insert: {
          id?: string
          user_id: string
          badge_id: string
          token_id?: string | null
          transaction_hash?: string | null
          blockchain_verified?: boolean
          earned_at?: string
          metadata?: Json
          is_featured?: boolean
          is_public?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          badge_id?: string
          token_id?: string | null
          transaction_hash?: string | null
          blockchain_verified?: boolean
          earned_at?: string
          metadata?: Json
          is_featured?: boolean
          is_public?: boolean
        }
      }
      verifications: {
        Row: {
          id: string
          achievement_id: string
          verifier_email: string | null
          verifier_name: string | null
          verified_at: string
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          id?: string
          achievement_id: string
          verifier_email?: string | null
          verifier_name?: string | null
          verified_at?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          id?: string
          achievement_id?: string
          verifier_email?: string | null
          verifier_name?: string | null
          verified_at?: string
          ip_address?: string | null
          user_agent?: string | null
        }
      }
      profile_views: {
        Row: {
          id: string
          profile_id: string
          viewer_ip: string | null
          viewed_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          viewer_ip?: string | null
          viewed_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          viewer_ip?: string | null
          viewed_at?: string
        }
      }
    }
  }
}
