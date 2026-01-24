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
      application_checklists: {
        Row: {
          checklist_items: Json
          created_at: string
          id: string
          scholarship_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          checklist_items?: Json
          created_at?: string
          id?: string
          scholarship_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          checklist_items?: Json
          created_at?: string
          id?: string
          scholarship_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_checklists_scholarship_id_fkey"
            columns: ["scholarship_id"]
            isOneToOne: false
            referencedRelation: "scholarships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_checklists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_comments: {
        Row: {
          author_id: string
          content: string
          created_at: string | null
          id: string
          post_id: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string | null
          id?: string
          post_id: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string | null
          id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          author_id: string
          content: string
          created_at: string | null
          id: string
          likes_count: number | null
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string | null
          id?: string
          likes_count?: number | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string | null
          id?: string
          likes_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mentor_applications: {
        Row: {
          admin_notes: string | null
          created_at: string
          has_experience: boolean
          id: string
          motivation: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          has_experience?: boolean
          id?: string
          motivation: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          has_experience?: boolean
          id?: string
          motivation?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mentors: {
        Row: {
          available: boolean | null
          avatar_url: string | null
          bio: string | null
          contact_info: string | null
          created_at: string | null
          expertise: string[] | null
          id: string
          name: string
          title: string | null
        }
        Insert: {
          available?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          contact_info?: string | null
          created_at?: string | null
          expertise?: string[] | null
          id?: string
          name: string
          title?: string | null
        }
        Update: {
          available?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          contact_info?: string | null
          created_at?: string | null
          expertise?: string[] | null
          id?: string
          name?: string
          title?: string | null
        }
        Relationships: []
      }
      mentorship_requests: {
        Row: {
          created_at: string | null
          id: string
          mentor_id: string
          message: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          mentor_id: string
          message?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          mentor_id?: string
          message?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_requests_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "mentors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorship_requests_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "mentors_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorship_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          created_at: string
          email_enabled: boolean
          id: string
          reminder_1_day: boolean
          reminder_3_days: boolean
          reminder_7_days: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_enabled?: boolean
          id?: string
          reminder_1_day?: boolean
          reminder_3_days?: boolean
          reminder_7_days?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_enabled?: boolean
          id?: string
          reminder_1_day?: boolean
          reminder_3_days?: boolean
          reminder_7_days?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string
          read: boolean
          scholarship_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message: string
          read?: boolean
          scholarship_id?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string
          read?: boolean
          scholarship_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_scholarship_id_fkey"
            columns: ["scholarship_id"]
            isOneToOne: false
            referencedRelation: "scholarships"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          country_of_residence: string | null
          created_at: string | null
          date_of_birth: string | null
          education_level: string | null
          email_verified: boolean | null
          field_of_study: string | null
          financial_need: boolean | null
          full_name: string | null
          gender: string | null
          gpa: number | null
          id: string
          income_level: string | null
          institution_type: string | null
          location: string | null
          nationality: string | null
          profile_completed_at: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          country_of_residence?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          education_level?: string | null
          email_verified?: boolean | null
          field_of_study?: string | null
          financial_need?: boolean | null
          full_name?: string | null
          gender?: string | null
          gpa?: number | null
          id: string
          income_level?: string | null
          institution_type?: string | null
          location?: string | null
          nationality?: string | null
          profile_completed_at?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          country_of_residence?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          education_level?: string | null
          email_verified?: boolean | null
          field_of_study?: string | null
          financial_need?: boolean | null
          full_name?: string | null
          gender?: string | null
          gpa?: number | null
          id?: string
          income_level?: string | null
          institution_type?: string | null
          location?: string | null
          nationality?: string | null
          profile_completed_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      resources: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          file_url: string | null
          id: string
          link: string | null
          title: string
          type: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          file_url?: string | null
          id?: string
          link?: string | null
          title: string
          type?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          file_url?: string | null
          id?: string
          link?: string | null
          title?: string
          type?: string | null
        }
        Relationships: []
      }
      scholarships: {
        Row: {
          amount: number | null
          category: string | null
          created_at: string | null
          deadline: string | null
          description: string | null
          eligible_countries: string[] | null
          eligible_education_levels: string[] | null
          eligible_fields: string[] | null
          eligible_genders: string[] | null
          eligible_nationalities: string[] | null
          financial_need_required: boolean | null
          id: string
          last_updated: string | null
          link: string | null
          location: string | null
          max_age: number | null
          min_age: number | null
          min_gpa: number | null
          requirements: string | null
          source_name: string | null
          source_url: string | null
          title: string
          unique_hash: string | null
        }
        Insert: {
          amount?: number | null
          category?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          eligible_countries?: string[] | null
          eligible_education_levels?: string[] | null
          eligible_fields?: string[] | null
          eligible_genders?: string[] | null
          eligible_nationalities?: string[] | null
          financial_need_required?: boolean | null
          id?: string
          last_updated?: string | null
          link?: string | null
          location?: string | null
          max_age?: number | null
          min_age?: number | null
          min_gpa?: number | null
          requirements?: string | null
          source_name?: string | null
          source_url?: string | null
          title: string
          unique_hash?: string | null
        }
        Update: {
          amount?: number | null
          category?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          eligible_countries?: string[] | null
          eligible_education_levels?: string[] | null
          eligible_fields?: string[] | null
          eligible_genders?: string[] | null
          eligible_nationalities?: string[] | null
          financial_need_required?: boolean | null
          id?: string
          last_updated?: string | null
          link?: string | null
          location?: string | null
          max_age?: number | null
          min_age?: number | null
          min_gpa?: number | null
          requirements?: string | null
          source_name?: string | null
          source_url?: string | null
          title?: string
          unique_hash?: string | null
        }
        Relationships: []
      }
      user_activity: {
        Row: {
          activity_type: string
          created_at: string | null
          description: string
          id: string
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          description: string
          id?: string
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          description?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activity_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_applications: {
        Row: {
          applied_at: string | null
          id: string
          notes: string | null
          scholarship_id: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          applied_at?: string | null
          id?: string
          notes?: string | null
          scholarship_id: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          applied_at?: string | null
          id?: string
          notes?: string | null
          scholarship_id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_applications_scholarship_id_fkey"
            columns: ["scholarship_id"]
            isOneToOne: false
            referencedRelation: "scholarships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_applications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_documents: {
        Row: {
          category: string
          created_at: string
          description: string | null
          file_path: string
          file_size: number
          file_type: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          file_path: string
          file_size: number
          file_type: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          created_at: string | null
          id: string
          scholarship_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          scholarship_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          scholarship_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_scholarship_id_fkey"
            columns: ["scholarship_id"]
            isOneToOne: false
            referencedRelation: "scholarships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_resource_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          id: string
          resource_id: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          id?: string
          resource_id: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          id?: string
          resource_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_resource_progress_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_resource_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      mentors_safe: {
        Row: {
          available: boolean | null
          avatar_url: string | null
          bio: string | null
          contact_info: string | null
          created_at: string | null
          expertise: string[] | null
          id: string | null
          name: string | null
          title: string | null
        }
        Insert: {
          available?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          contact_info?: never
          created_at?: string | null
          expertise?: string[] | null
          id?: string | null
          name?: string | null
          title?: string | null
        }
        Update: {
          available?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          contact_info?: never
          created_at?: string | null
          expertise?: string[] | null
          id?: string | null
          name?: string | null
          title?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      can_view_mentor_contact: {
        Args: { mentor_uuid: string }
        Returns: boolean
      }
      generate_scholarship_hash: {
        Args: { link: string; title: string }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
