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
      audit_logs: {
        Row: {
          action: string
          data: Json | null
          entity: string
          entity_id: string | null
          id: string
          timestamp: string
          user_id: string | null
        }
        Insert: {
          action: string
          data?: Json | null
          entity: string
          entity_id?: string | null
          id?: string
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          data?: Json | null
          entity?: string
          entity_id?: string | null
          id?: string
          timestamp?: string
          user_id?: string | null
        }
        Relationships: []
      }
      bank_proofs: {
        Row: {
          bank_ref: string
          created_at: string
          file_url: string
          id: string
          payment_id: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          bank_ref: string
          created_at?: string
          file_url: string
          id?: string
          payment_id?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          bank_ref?: string
          created_at?: string
          file_url?: string
          id?: string
          payment_id?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bank_proofs_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          created_at: string
          id: string
          level: number
          name: string
          year: number
        }
        Insert: {
          created_at?: string
          id?: string
          level: number
          name: string
          year: number
        }
        Update: {
          created_at?: string
          id?: string
          level?: number
          name?: string
          year?: number
        }
        Relationships: []
      }
      fee_items: {
        Row: {
          category: string
          code: string
          created_at: string
          default_amount: number
          description: string | null
          id: string
          title: string
        }
        Insert: {
          category: string
          code: string
          created_at?: string
          default_amount: number
          description?: string | null
          id?: string
          title: string
        }
        Update: {
          category?: string
          code?: string
          created_at?: string
          default_amount?: number
          description?: string | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      fee_structures: {
        Row: {
          amount: number
          class_id: string
          created_at: string
          fee_item_id: string
          id: string
          term_id: string
        }
        Insert: {
          amount: number
          class_id: string
          created_at?: string
          fee_item_id: string
          id?: string
          term_id: string
        }
        Update: {
          amount?: number
          class_id?: string
          created_at?: string
          fee_item_id?: string
          id?: string
          term_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fee_structures_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fee_structures_fee_item_id_fkey"
            columns: ["fee_item_id"]
            isOneToOne: false
            referencedRelation: "fee_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fee_structures_term_id_fkey"
            columns: ["term_id"]
            isOneToOne: false
            referencedRelation: "terms"
            referencedColumns: ["id"]
          },
        ]
      }
      guardians: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      invoice_lines: {
        Row: {
          amount: number
          created_at: string
          description: string
          fee_item_id: string
          id: string
          invoice_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          fee_item_id: string
          id?: string
          invoice_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          fee_item_id?: string
          id?: string
          invoice_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_lines_fee_item_id_fkey"
            columns: ["fee_item_id"]
            isOneToOne: false
            referencedRelation: "fee_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_lines_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          created_at: string
          due_date: string
          guardian_id: string
          id: string
          invoice_no: string
          paid_amount: number
          status: Database["public"]["Enums"]["invoice_status"]
          student_id: string
          term_id: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          due_date: string
          guardian_id: string
          id?: string
          invoice_no: string
          paid_amount?: number
          status?: Database["public"]["Enums"]["invoice_status"]
          student_id: string
          term_id: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          due_date?: string
          guardian_id?: string
          id?: string
          invoice_no?: string
          paid_amount?: number
          status?: Database["public"]["Enums"]["invoice_status"]
          student_id?: string
          term_id?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_guardian_id_fkey"
            columns: ["guardian_id"]
            isOneToOne: false
            referencedRelation: "guardians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_term_id_fkey"
            columns: ["term_id"]
            isOneToOne: false
            referencedRelation: "terms"
            referencedColumns: ["id"]
          },
        ]
      }
      mpesa_transactions: {
        Row: {
          amount: number
          created_at: string
          id: string
          mpesa_receipt_no: string
          payment_id: string | null
          phone: string
          transaction_date: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          mpesa_receipt_no: string
          payment_id?: string | null
          phone: string
          transaction_date: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          mpesa_receipt_no?: string
          payment_id?: string | null
          phone?: string
          transaction_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "mpesa_transactions_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          invoice_id: string | null
          method: Database["public"]["Enums"]["payment_method"]
          payer_user_id: string | null
          provider_ref: string | null
          raw_payload: Json | null
          status: Database["public"]["Enums"]["payment_status"]
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          invoice_id?: string | null
          method: Database["public"]["Enums"]["payment_method"]
          payer_user_id?: string | null
          provider_ref?: string | null
          raw_payload?: Json | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          invoice_id?: string | null
          method?: Database["public"]["Enums"]["payment_method"]
          payer_user_id?: string | null
          provider_ref?: string | null
          raw_payload?: Json | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string
          full_name: string
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          full_name: string
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      scholarships_adjustments: {
        Row: {
          amount: number
          applied_by: string | null
          created_at: string
          id: string
          invoice_id: string | null
          reason: string
          student_id: string
        }
        Insert: {
          amount: number
          applied_by?: string | null
          created_at?: string
          id?: string
          invoice_id?: string | null
          reason: string
          student_id: string
        }
        Update: {
          amount?: number
          applied_by?: string | null
          created_at?: string
          id?: string
          invoice_id?: string | null
          reason?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scholarships_adjustments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scholarships_adjustments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          admission_no: string
          boarding_status: Database["public"]["Enums"]["boarding_status"]
          class_id: string | null
          created_at: string
          date_of_birth: string | null
          first_name: string
          guardian_id: string | null
          id: string
          last_name: string
          updated_at: string
        }
        Insert: {
          admission_no: string
          boarding_status?: Database["public"]["Enums"]["boarding_status"]
          class_id?: string | null
          created_at?: string
          date_of_birth?: string | null
          first_name: string
          guardian_id?: string | null
          id?: string
          last_name: string
          updated_at?: string
        }
        Update: {
          admission_no?: string
          boarding_status?: Database["public"]["Enums"]["boarding_status"]
          class_id?: string | null
          created_at?: string
          date_of_birth?: string | null
          first_name?: string
          guardian_id?: string | null
          id?: string
          last_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_guardian_id_fkey"
            columns: ["guardian_id"]
            isOneToOne: false
            referencedRelation: "guardians"
            referencedColumns: ["id"]
          },
        ]
      }
      terms: {
        Row: {
          active: boolean
          created_at: string
          end_date: string
          id: string
          name: string
          start_date: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          end_date: string
          id?: string
          name: string
          start_date: string
        }
        Update: {
          active?: boolean
          created_at?: string
          end_date?: string
          id?: string
          name?: string
          start_date?: string
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
          role: Database["public"]["Enums"]["app_role"]
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
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "bursar"
        | "registrar"
        | "teacher"
        | "parent"
        | "student"
        | "auditor"
      boarding_status: "day" | "boarding"
      invoice_status:
        | "draft"
        | "issued"
        | "paid"
        | "partial"
        | "overdue"
        | "cancelled"
      payment_method: "mpesa" | "stripe" | "bank_transfer" | "manual"
      payment_status: "pending" | "completed" | "failed" | "refunded"
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
      app_role: [
        "super_admin",
        "bursar",
        "registrar",
        "teacher",
        "parent",
        "student",
        "auditor",
      ],
      boarding_status: ["day", "boarding"],
      invoice_status: [
        "draft",
        "issued",
        "paid",
        "partial",
        "overdue",
        "cancelled",
      ],
      payment_method: ["mpesa", "stripe", "bank_transfer", "manual"],
      payment_status: ["pending", "completed", "failed", "refunded"],
    },
  },
} as const
