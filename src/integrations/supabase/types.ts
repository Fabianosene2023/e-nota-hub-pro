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
      clientes: {
        Row: {
          cep: string
          cidade: string
          cpf_cnpj: string
          created_at: string
          email: string | null
          empresa_id: string
          endereco: string
          estado: string
          id: string
          inscricao_estadual: string | null
          nome_razao_social: string
          telefone: string | null
          tipo_pessoa: string
          updated_at: string
        }
        Insert: {
          cep: string
          cidade: string
          cpf_cnpj: string
          created_at?: string
          email?: string | null
          empresa_id: string
          endereco: string
          estado: string
          id?: string
          inscricao_estadual?: string | null
          nome_razao_social: string
          telefone?: string | null
          tipo_pessoa: string
          updated_at?: string
        }
        Update: {
          cep?: string
          cidade?: string
          cpf_cnpj?: string
          created_at?: string
          email?: string | null
          empresa_id?: string
          endereco?: string
          estado?: string
          id?: string
          inscricao_estadual?: string | null
          nome_razao_social?: string
          telefone?: string | null
          tipo_pessoa?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clientes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      empresas: {
        Row: {
          ambiente_sefaz: string | null
          cep: string
          certificado_digital: string | null
          cidade: string
          cnpj: string
          created_at: string
          email: string | null
          endereco: string
          estado: string
          id: string
          inscricao_estadual: string | null
          inscricao_municipal: string | null
          nome_fantasia: string | null
          razao_social: string
          senha_certificado: string | null
          telefone: string | null
          updated_at: string
        }
        Insert: {
          ambiente_sefaz?: string | null
          cep: string
          certificado_digital?: string | null
          cidade: string
          cnpj: string
          created_at?: string
          email?: string | null
          endereco: string
          estado: string
          id?: string
          inscricao_estadual?: string | null
          inscricao_municipal?: string | null
          nome_fantasia?: string | null
          razao_social: string
          senha_certificado?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          ambiente_sefaz?: string | null
          cep?: string
          certificado_digital?: string | null
          cidade?: string
          cnpj?: string
          created_at?: string
          email?: string | null
          endereco?: string
          estado?: string
          id?: string
          inscricao_estadual?: string | null
          inscricao_municipal?: string | null
          nome_fantasia?: string | null
          razao_social?: string
          senha_certificado?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      itens_nota_fiscal: {
        Row: {
          created_at: string
          id: string
          nota_fiscal_id: string
          produto_id: string
          quantidade: number
          valor_total: number
          valor_unitario: number
        }
        Insert: {
          created_at?: string
          id?: string
          nota_fiscal_id: string
          produto_id: string
          quantidade: number
          valor_total: number
          valor_unitario: number
        }
        Update: {
          created_at?: string
          id?: string
          nota_fiscal_id?: string
          produto_id?: string
          quantidade?: number
          valor_total?: number
          valor_unitario?: number
        }
        Relationships: [
          {
            foreignKeyName: "itens_nota_fiscal_nota_fiscal_id_fkey"
            columns: ["nota_fiscal_id"]
            isOneToOne: false
            referencedRelation: "notas_fiscais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itens_nota_fiscal_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      notas_fiscais: {
        Row: {
          chave_acesso: string | null
          cliente_id: string
          created_at: string
          data_emissao: string
          empresa_id: string
          id: string
          numero: number
          observacoes: string | null
          protocolo_autorizacao: string | null
          serie: number
          status: string
          updated_at: string
          valor_cofins: number | null
          valor_icms: number | null
          valor_ipi: number | null
          valor_pis: number | null
          valor_total: number
          xml_nfe: string | null
        }
        Insert: {
          chave_acesso?: string | null
          cliente_id: string
          created_at?: string
          data_emissao?: string
          empresa_id: string
          id?: string
          numero: number
          observacoes?: string | null
          protocolo_autorizacao?: string | null
          serie?: number
          status?: string
          updated_at?: string
          valor_cofins?: number | null
          valor_icms?: number | null
          valor_ipi?: number | null
          valor_pis?: number | null
          valor_total?: number
          xml_nfe?: string | null
        }
        Update: {
          chave_acesso?: string | null
          cliente_id?: string
          created_at?: string
          data_emissao?: string
          empresa_id?: string
          id?: string
          numero?: number
          observacoes?: string | null
          protocolo_autorizacao?: string | null
          serie?: number
          status?: string
          updated_at?: string
          valor_cofins?: number | null
          valor_icms?: number | null
          valor_ipi?: number | null
          valor_pis?: number | null
          valor_total?: number
          xml_nfe?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notas_fiscais_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notas_fiscais_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      produtos: {
        Row: {
          cfop: string
          codigo: string
          cofins_aliquota: number | null
          created_at: string
          descricao: string
          empresa_id: string
          icms_aliquota: number | null
          id: string
          ipi_aliquota: number | null
          ncm: string | null
          pis_aliquota: number | null
          preco_unitario: number
          unidade: string
          updated_at: string
        }
        Insert: {
          cfop?: string
          codigo: string
          cofins_aliquota?: number | null
          created_at?: string
          descricao: string
          empresa_id: string
          icms_aliquota?: number | null
          id?: string
          ipi_aliquota?: number | null
          ncm?: string | null
          pis_aliquota?: number | null
          preco_unitario: number
          unidade?: string
          updated_at?: string
        }
        Update: {
          cfop?: string
          codigo?: string
          cofins_aliquota?: number | null
          created_at?: string
          descricao?: string
          empresa_id?: string
          icms_aliquota?: number | null
          id?: string
          ipi_aliquota?: number | null
          ncm?: string | null
          pis_aliquota?: number | null
          preco_unitario?: number
          unidade?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "produtos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
