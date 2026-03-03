// Auto-generated types for Supabase schema
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
      user_profiles: {
        Row: {
          id: string
          display_name: string
          total_evaluations: number
          current_level: number
          experience_points: number
          streak_days: number
          last_evaluation_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name?: string
          total_evaluations?: number
          current_level?: number
          experience_points?: number
          streak_days?: number
          last_evaluation_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string
          total_evaluations?: number
          current_level?: number
          experience_points?: number
          streak_days?: number
          last_evaluation_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      evaluations: {
        Row: {
          id: string
          user_id: string
          bleeding_center: string
          sacrifice_center: string
          oxygen_actions: string[]
          synthesis_text: string
          ai_analysis: string
          ai_synthesis_feedback: string | null
          xp_earned: number
          completed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          bleeding_center: string
          sacrifice_center: string
          oxygen_actions?: string[]
          synthesis_text?: string
          ai_analysis?: string
          ai_synthesis_feedback?: string | null
          xp_earned?: number
          completed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          bleeding_center?: string
          sacrifice_center?: string
          oxygen_actions?: string[]
          synthesis_text?: string
          ai_analysis?: string
          ai_synthesis_feedback?: string | null
          xp_earned?: number
          completed_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          key: string
          title: string
          description: string
          icon: string
          xp_reward: number
          created_at: string
        }
        Insert: {
          id?: string
          key: string
          title: string
          description: string
          icon?: string
          xp_reward?: number
          created_at?: string
        }
        Update: {
          id?: string
          key?: string
          title?: string
          description?: string
          icon?: string
          xp_reward?: number
          created_at?: string
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          unlocked_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          unlocked_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          unlocked_at?: string
        }
      }
    }
  }
}
