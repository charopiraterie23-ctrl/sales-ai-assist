export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      calls: {
        Row: {
          audio_file: string
          client_id: string | null
          created_at: string
          duration: number
          id: string
          language: string
          source: Database["public"]["Enums"]["call_source"] | null
          transcription: string | null
          user_id: string
        }
        Insert: {
          audio_file: string
          client_id?: string | null
          created_at?: string
          duration: number
          id?: string
          language?: string
          source?: Database["public"]["Enums"]["call_source"] | null
          transcription?: string | null
          user_id: string
        }
        Update: {
          audio_file?: string
          client_id?: string | null
          created_at?: string
          duration?: number
          id?: string
          language?: string
          source?: Database["public"]["Enums"]["call_source"] | null
          transcription?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calls_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calls_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          company: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          last_contacted: string | null
          notes: string | null
          phone: string | null
          status: Database["public"]["Enums"]["client_status"] | null
          user_id: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          last_contacted?: string | null
          notes?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["client_status"] | null
          user_id: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          last_contacted?: string | null
          notes?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["client_status"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      followup_emails: {
        Row: {
          body: string
          id: string
          is_customized: boolean | null
          send_date: string | null
          status: Database["public"]["Enums"]["email_status"] | null
          subject: string
          summary_id: string
          to_email: string
        }
        Insert: {
          body: string
          id?: string
          is_customized?: boolean | null
          send_date?: string | null
          status?: Database["public"]["Enums"]["email_status"] | null
          subject: string
          summary_id: string
          to_email: string
        }
        Update: {
          body?: string
          id?: string
          is_customized?: boolean | null
          send_date?: string | null
          status?: Database["public"]["Enums"]["email_status"] | null
          subject?: string
          summary_id?: string
          to_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "followup_emails_summary_id_fkey"
            columns: ["summary_id"]
            isOneToOne: false
            referencedRelation: "summaries"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          dark_mode: boolean
          email_synced: boolean
          full_name: string
          id: string
          lang: string
          phone_number: string | null
          plan: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          dark_mode?: boolean
          email_synced?: boolean
          full_name: string
          id: string
          lang?: string
          phone_number?: string | null
          plan?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          dark_mode?: boolean
          email_synced?: boolean
          full_name?: string
          id?: string
          lang?: string
          phone_number?: string | null
          plan?: string
        }
        Relationships: []
      }
      summaries: {
        Row: {
          call_id: string
          generated_at: string
          id: string
          is_edited: boolean | null
          summary_text: string
          tags: string[] | null
          tone: Database["public"]["Enums"]["summary_tone"] | null
        }
        Insert: {
          call_id: string
          generated_at?: string
          id?: string
          is_edited?: boolean | null
          summary_text: string
          tags?: string[] | null
          tone?: Database["public"]["Enums"]["summary_tone"] | null
        }
        Update: {
          call_id?: string
          generated_at?: string
          id?: string
          is_edited?: boolean | null
          summary_text?: string
          tags?: string[] | null
          tone?: Database["public"]["Enums"]["summary_tone"] | null
        }
        Relationships: [
          {
            foreignKeyName: "summaries_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "calls"
            referencedColumns: ["id"]
          },
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
      call_source: "upload" | "enregistrement"
      client_status: "lead" | "intéressé" | "en attente" | "conclu" | "perdu"
      email_status: "à envoyer" | "envoyé" | "échoué"
      summary_tone: "formel" | "neutre" | "amical"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      call_source: ["upload", "enregistrement"],
      client_status: ["lead", "intéressé", "en attente", "conclu", "perdu"],
      email_status: ["à envoyer", "envoyé", "échoué"],
      summary_tone: ["formel", "neutre", "amical"],
    },
  },
} as const
