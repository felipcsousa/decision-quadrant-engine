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
      analysis_ai_suggestions: {
        Row: {
          analysis_id: string
          category: string
          created_at: string
          description: string
          display_order: number
          id: string
          priority: string
          rationale: string
          title: string
        }
        Insert: {
          analysis_id: string
          category: string
          created_at?: string
          description: string
          display_order?: number
          id?: string
          priority: string
          rationale: string
          title: string
        }
        Update: {
          analysis_id?: string
          category?: string
          created_at?: string
          description?: string
          display_order?: number
          id?: string
          priority?: string
          rationale?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "analysis_ai_suggestions_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "user_analyses"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_items: {
        Row: {
          active: boolean
          category: string
          created_at: string
          description: string | null
          display_order: number
          id: string
          item: string
          updated_at: string
          version: number
        }
        Insert: {
          active?: boolean
          category: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          item: string
          updated_at?: string
          version?: number
        }
        Update: {
          active?: boolean
          category?: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          item?: string
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      guardrails: {
        Row: {
          active: boolean
          created_at: string
          description: string
          display_order: number
          id: string
          metric_name: string
          quadrant_id: string
          range_value: string | null
          target_value: string
          updated_at: string
          version: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          description: string
          display_order?: number
          id?: string
          metric_name: string
          quadrant_id: string
          range_value?: string | null
          target_value: string
          updated_at?: string
          version?: number
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string
          display_order?: number
          id?: string
          metric_name?: string
          quadrant_id?: string
          range_value?: string | null
          target_value?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "guardrails_quadrant_id_fkey"
            columns: ["quadrant_id"]
            isOneToOne: false
            referencedRelation: "quadrants"
            referencedColumns: ["id"]
          },
        ]
      }
      layers_config: {
        Row: {
          copy_guidance: string
          created_at: string
          id: string
          layer_type: string
          level: string
          measurement_guidance: string
          updated_at: string
          ux_guidance: string
          validation_guidance: string
          version: number
        }
        Insert: {
          copy_guidance: string
          created_at?: string
          id?: string
          layer_type: string
          level: string
          measurement_guidance: string
          updated_at?: string
          ux_guidance: string
          validation_guidance: string
          version?: number
        }
        Update: {
          copy_guidance?: string
          created_at?: string
          id?: string
          layer_type?: string
          level?: string
          measurement_guidance?: string
          updated_at?: string
          ux_guidance?: string
          validation_guidance?: string
          version?: number
        }
        Relationships: []
      }
      pattern_refinements: {
        Row: {
          active: boolean
          category: string
          created_at: string
          description: string
          id: string
          layer_type: string
          level: string
          name: string
          priority: string | null
          updated_at: string
          version: number
        }
        Insert: {
          active?: boolean
          category?: string
          created_at?: string
          description: string
          id?: string
          layer_type: string
          level: string
          name: string
          priority?: string | null
          updated_at?: string
          version?: number
        }
        Update: {
          active?: boolean
          category?: string
          created_at?: string
          description?: string
          id?: string
          layer_type?: string
          level?: string
          name?: string
          priority?: string | null
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quadrant_detailed_sections: {
        Row: {
          active: boolean
          anti_patterns: Json
          checklist_items: Json
          created_at: string
          display_order: number
          id: string
          items: Json
          objective: string | null
          quadrant_id: string
          section_type: string
          title: string
          updated_at: string
          version: number
        }
        Insert: {
          active?: boolean
          anti_patterns?: Json
          checklist_items?: Json
          created_at?: string
          display_order?: number
          id?: string
          items?: Json
          objective?: string | null
          quadrant_id: string
          section_type: string
          title: string
          updated_at?: string
          version?: number
        }
        Update: {
          active?: boolean
          anti_patterns?: Json
          checklist_items?: Json
          created_at?: string
          display_order?: number
          id?: string
          items?: Json
          objective?: string | null
          quadrant_id?: string
          section_type?: string
          title?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "quadrant_detailed_sections_quadrant_id_fkey"
            columns: ["quadrant_id"]
            isOneToOne: false
            referencedRelation: "quadrants"
            referencedColumns: ["id"]
          },
        ]
      }
      quadrant_patterns: {
        Row: {
          active: boolean
          category: string
          created_at: string
          description: string
          display_order: number
          id: string
          name: string
          priority: string | null
          quadrant_id: string
          updated_at: string
          version: number
        }
        Insert: {
          active?: boolean
          category?: string
          created_at?: string
          description: string
          display_order?: number
          id?: string
          name: string
          priority?: string | null
          quadrant_id: string
          updated_at?: string
          version?: number
        }
        Update: {
          active?: boolean
          category?: string
          created_at?: string
          description?: string
          display_order?: number
          id?: string
          name?: string
          priority?: string | null
          quadrant_id?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "quadrant_patterns_quadrant_id_fkey"
            columns: ["quadrant_id"]
            isOneToOne: false
            referencedRelation: "quadrants"
            referencedColumns: ["id"]
          },
        ]
      }
      quadrants: {
        Row: {
          archetype: string
          code: string
          created_at: string
          description: string
          guideline: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          archetype: string
          code: string
          created_at?: string
          description: string
          guideline: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          archetype?: string
          code?: string
          created_at?: string
          description?: string
          guideline?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      suggestion_templates: {
        Row: {
          active: boolean
          applies_to_risk: string | null
          applies_to_uncertainty: string | null
          applies_to_urgency: string | null
          category: string
          created_at: string
          description: string
          id: string
          priority: string
          quadrant_id: string | null
          rationale: string
          title: string
          trigger_context: string
          trigger_value: string
          updated_at: string
          version: number
        }
        Insert: {
          active?: boolean
          applies_to_risk?: string | null
          applies_to_uncertainty?: string | null
          applies_to_urgency?: string | null
          category: string
          created_at?: string
          description: string
          id?: string
          priority: string
          quadrant_id?: string | null
          rationale: string
          title: string
          trigger_context: string
          trigger_value: string
          updated_at?: string
          version?: number
        }
        Update: {
          active?: boolean
          applies_to_risk?: string | null
          applies_to_uncertainty?: string | null
          applies_to_urgency?: string | null
          category?: string
          created_at?: string
          description?: string
          id?: string
          priority?: string
          quadrant_id?: string | null
          rationale?: string
          title?: string
          trigger_context?: string
          trigger_value?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "suggestion_templates_quadrant_id_fkey"
            columns: ["quadrant_id"]
            isOneToOne: false
            referencedRelation: "quadrants"
            referencedColumns: ["id"]
          },
        ]
      }
      transversal_recommendations: {
        Row: {
          active: boolean
          created_at: string
          display_order: number
          id: string
          recommendation: string
          updated_at: string
          version: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          display_order?: number
          id?: string
          recommendation: string
          updated_at?: string
          version?: number
        }
        Update: {
          active?: boolean
          created_at?: string
          display_order?: number
          id?: string
          recommendation?: string
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      user_analyses: {
        Row: {
          ai_suggestions_generated: boolean
          collaboration_level: string | null
          completed_at: string | null
          created_at: string
          description: string
          frequency: number
          frequency_direction: string | null
          frequency_evidence: string | null
          id: string
          information: number
          information_direction: string | null
          information_evidence: string | null
          jtbd: string
          name: string
          quadrant_code: string | null
          risk_level: string
          uncertainty_level: string
          updated_at: string
          urgency_level: string
          user_id: string
        }
        Insert: {
          ai_suggestions_generated?: boolean
          collaboration_level?: string | null
          completed_at?: string | null
          created_at?: string
          description: string
          frequency: number
          frequency_direction?: string | null
          frequency_evidence?: string | null
          id?: string
          information: number
          information_direction?: string | null
          information_evidence?: string | null
          jtbd: string
          name: string
          quadrant_code?: string | null
          risk_level: string
          uncertainty_level: string
          updated_at?: string
          urgency_level: string
          user_id: string
        }
        Update: {
          ai_suggestions_generated?: boolean
          collaboration_level?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string
          frequency?: number
          frequency_direction?: string | null
          frequency_evidence?: string | null
          id?: string
          information?: number
          information_direction?: string | null
          information_evidence?: string | null
          jtbd?: string
          name?: string
          quadrant_code?: string | null
          risk_level?: string
          uncertainty_level?: string
          updated_at?: string
          urgency_level?: string
          user_id?: string
        }
        Relationships: []
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
    Enums: {},
  },
} as const
