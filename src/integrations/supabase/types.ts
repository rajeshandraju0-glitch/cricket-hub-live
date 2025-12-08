export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_purchases: {
        Row: {
          admin_id: string
          amount: number
          created_at: string
          currency: string | null
          expiry_date: string | null
          id: string
          status: string | null
          transaction_id: string | null
        }
        Insert: {
          admin_id: string
          amount: number
          created_at?: string
          currency?: string | null
          expiry_date?: string | null
          id?: string
          status?: string | null
          transaction_id?: string | null
        }
        Update: {
          admin_id?: string
          amount?: number
          created_at?: string
          currency?: string | null
          expiry_date?: string | null
          id?: string
          status?: string | null
          transaction_id?: string | null
        }
        Relationships: []
      }
      match_scores: {
        Row: {
          ball_by_ball: Json | null
          current_batting_team_id: string | null
          current_bowler: string | null
          current_non_striker: string | null
          current_striker: string | null
          id: string
          match_id: string
          team_a_overs: number | null
          team_a_runs: number | null
          team_a_wickets: number | null
          team_b_overs: number | null
          team_b_runs: number | null
          team_b_wickets: number | null
          updated_at: string
        }
        Insert: {
          ball_by_ball?: Json | null
          current_batting_team_id?: string | null
          current_bowler?: string | null
          current_non_striker?: string | null
          current_striker?: string | null
          id?: string
          match_id: string
          team_a_overs?: number | null
          team_a_runs?: number | null
          team_a_wickets?: number | null
          team_b_overs?: number | null
          team_b_runs?: number | null
          team_b_wickets?: number | null
          updated_at?: string
        }
        Update: {
          ball_by_ball?: Json | null
          current_batting_team_id?: string | null
          current_bowler?: string | null
          current_non_striker?: string | null
          current_striker?: string | null
          id?: string
          match_id?: string
          team_a_overs?: number | null
          team_a_runs?: number | null
          team_a_wickets?: number | null
          team_b_overs?: number | null
          team_b_runs?: number | null
          team_b_wickets?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_scores_current_batting_team_id_fkey"
            columns: ["current_batting_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_scores_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: true
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          created_at: string
          id: string
          match_date: string
          overs: number | null
          status: string | null
          team_a_id: string
          team_b_id: string
          toss_decision: string | null
          toss_winner_id: string | null
          tournament_id: string
          updated_at: string
          venue: string
          winner_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          match_date: string
          overs?: number | null
          status?: string | null
          team_a_id: string
          team_b_id: string
          toss_decision?: string | null
          toss_winner_id?: string | null
          tournament_id: string
          updated_at?: string
          venue: string
          winner_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          match_date?: string
          overs?: number | null
          status?: string | null
          team_a_id?: string
          team_b_id?: string
          toss_decision?: string | null
          toss_winner_id?: string | null
          tournament_id?: string
          updated_at?: string
          venue?: string
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_team_a_id_fkey"
            columns: ["team_a_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_team_b_id_fkey"
            columns: ["team_b_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_toss_winner_id_fkey"
            columns: ["toss_winner_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_settings: {
        Row: {
          admin_purchase_amount: number | null
          admin_validity_days: number | null
          id: string
          razorpay_key_id: string | null
          stripe_key: string | null
          updated_at: string
          viewer_subscription_amount: number | null
          viewer_validity_days: number | null
        }
        Insert: {
          admin_purchase_amount?: number | null
          admin_validity_days?: number | null
          id?: string
          razorpay_key_id?: string | null
          stripe_key?: string | null
          updated_at?: string
          viewer_subscription_amount?: number | null
          viewer_validity_days?: number | null
        }
        Update: {
          admin_purchase_amount?: number | null
          admin_validity_days?: number | null
          id?: string
          razorpay_key_id?: string | null
          stripe_key?: string | null
          updated_at?: string
          viewer_subscription_amount?: number | null
          viewer_validity_days?: number | null
        }
        Relationships: []
      }
      players: {
        Row: {
          batting_style: string | null
          bowling_style: string | null
          created_at: string
          id: string
          jersey_number: number | null
          name: string
          role: string | null
          team_id: string
        }
        Insert: {
          batting_style?: string | null
          bowling_style?: string | null
          created_at?: string
          id?: string
          jersey_number?: number | null
          name: string
          role?: string | null
          team_id: string
        }
        Update: {
          batting_style?: string | null
          bowling_style?: string | null
          created_at?: string
          id?: string
          jersey_number?: number | null
          name?: string
          role?: string | null
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "players_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          is_verified: boolean | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      teams: {
        Row: {
          captain: string | null
          coach: string | null
          created_at: string
          id: string
          logo_url: string | null
          name: string
          short_name: string | null
          tournament_id: string
        }
        Insert: {
          captain?: string | null
          coach?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          short_name?: string | null
          tournament_id: string
        }
        Update: {
          captain?: string | null
          coach?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          short_name?: string | null
          tournament_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          admin_id: string
          created_at: string
          description: string | null
          end_date: string
          id: string
          logo_url: string | null
          name: string
          overs_format: number | null
          start_date: string
          status: string | null
          updated_at: string
          venue: string | null
        }
        Insert: {
          admin_id: string
          created_at?: string
          description?: string | null
          end_date: string
          id?: string
          logo_url?: string | null
          name: string
          overs_format?: number | null
          start_date: string
          status?: string | null
          updated_at?: string
          venue?: string | null
        }
        Update: {
          admin_id?: string
          created_at?: string
          description?: string | null
          end_date?: string
          id?: string
          logo_url?: string | null
          name?: string
          overs_format?: number | null
          start_date?: string
          status?: string | null
          updated_at?: string
          venue?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      viewer_subscriptions: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          expiry_date: string
          id: string
          is_active: boolean | null
          start_date: string
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          currency?: string | null
          expiry_date: string
          id?: string
          is_active?: boolean | null
          start_date?: string
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          expiry_date?: string
          id?: string
          is_active?: boolean | null
          start_date?: string
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "superadmin" | "admin" | "viewer"
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
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
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
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
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
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["superadmin", "admin", "viewer"],
    },
  },
} as const
