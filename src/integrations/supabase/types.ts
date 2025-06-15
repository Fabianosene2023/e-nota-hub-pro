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
      categorias_produtos: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          descricao: string | null
          empresa_id: string
          id: string
          nome: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          empresa_id: string
          id?: string
          nome: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          empresa_id?: string
          id?: string
          nome?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categorias_produtos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      certificados_digitais: {
        Row: {
          ativo: boolean
          conteudo_criptografado: string
          created_at: string
          empresa_id: string
          id: string
          nome_arquivo: string
          senha_hash: string
          tipo_certificado: string
          updated_at: string
          validade_fim: string
          validade_inicio: string
        }
        Insert: {
          ativo?: boolean
          conteudo_criptografado: string
          created_at?: string
          empresa_id: string
          id?: string
          nome_arquivo: string
          senha_hash: string
          tipo_certificado?: string
          updated_at?: string
          validade_fim: string
          validade_inicio: string
        }
        Update: {
          ativo?: boolean
          conteudo_criptografado?: string
          created_at?: string
          empresa_id?: string
          id?: string
          nome_arquivo?: string
          senha_hash?: string
          tipo_certificado?: string
          updated_at?: string
          validade_fim?: string
          validade_inicio?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificados_digitais_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      certificados_vault: {
        Row: {
          ativo: boolean
          cnpj_proprietario: string
          created_at: string
          empresa_id: string
          id: string
          nome_certificado: string
          tipo_certificado: string
          updated_at: string
          validade_fim: string
          validade_inicio: string
          vault_secret_id: string
        }
        Insert: {
          ativo?: boolean
          cnpj_proprietario: string
          created_at?: string
          empresa_id: string
          id?: string
          nome_certificado: string
          tipo_certificado: string
          updated_at?: string
          validade_fim: string
          validade_inicio: string
          vault_secret_id: string
        }
        Update: {
          ativo?: boolean
          cnpj_proprietario?: string
          created_at?: string
          empresa_id?: string
          id?: string
          nome_certificado?: string
          tipo_certificado?: string
          updated_at?: string
          validade_fim?: string
          validade_inicio?: string
          vault_secret_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificados_vault_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
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
      configuracoes: {
        Row: {
          certificado_a1_data: string | null
          certificado_a1_senha: string | null
          created_at: string
          csc_id: string | null
          csc_token: string | null
          email_padrao_envio: string | null
          empresa_id: string
          id: string
          layout_danfe: string | null
          proxima_num_nf: number | null
          serie_nfce: number | null
          serie_nfe: number | null
          updated_at: string
        }
        Insert: {
          certificado_a1_data?: string | null
          certificado_a1_senha?: string | null
          created_at?: string
          csc_id?: string | null
          csc_token?: string | null
          email_padrao_envio?: string | null
          empresa_id: string
          id?: string
          layout_danfe?: string | null
          proxima_num_nf?: number | null
          serie_nfce?: number | null
          serie_nfe?: number | null
          updated_at?: string
        }
        Update: {
          certificado_a1_data?: string | null
          certificado_a1_senha?: string | null
          created_at?: string
          csc_id?: string | null
          csc_token?: string | null
          email_padrao_envio?: string | null
          empresa_id?: string
          id?: string
          layout_danfe?: string | null
          proxima_num_nf?: number | null
          serie_nfce?: number | null
          serie_nfe?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "configuracoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: true
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      configuracoes_sefaz: {
        Row: {
          ambiente: string
          created_at: string
          csc_id: string | null
          csc_token: string | null
          empresa_id: string
          id: string
          proximo_numero_nfce: number
          proximo_numero_nfe: number
          serie_nfce: number
          serie_nfe: number
          tentativas_reenvio: number
          timeout_sefaz: number
          updated_at: string
        }
        Insert: {
          ambiente?: string
          created_at?: string
          csc_id?: string | null
          csc_token?: string | null
          empresa_id: string
          id?: string
          proximo_numero_nfce?: number
          proximo_numero_nfe?: number
          serie_nfce?: number
          serie_nfe?: number
          tentativas_reenvio?: number
          timeout_sefaz?: number
          updated_at?: string
        }
        Update: {
          ambiente?: string
          created_at?: string
          csc_id?: string | null
          csc_token?: string | null
          empresa_id?: string
          id?: string
          proximo_numero_nfce?: number
          proximo_numero_nfe?: number
          serie_nfce?: number
          serie_nfe?: number
          tentativas_reenvio?: number
          timeout_sefaz?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "configuracoes_sefaz_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: true
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      contatos: {
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
          placa_veiculo: string | null
          rntrc: string | null
          telefone: string | null
          tipo: string
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
          placa_veiculo?: string | null
          rntrc?: string | null
          telefone?: string | null
          tipo: string
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
          placa_veiculo?: string | null
          rntrc?: string | null
          telefone?: string | null
          tipo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contatos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      documentos_fiscais: {
        Row: {
          conteudo_base64: string | null
          created_at: string
          id: string
          nome_arquivo: string
          nota_fiscal_id: string
          tamanho_bytes: number | null
          tipo_documento: string
          url_arquivo: string | null
        }
        Insert: {
          conteudo_base64?: string | null
          created_at?: string
          id?: string
          nome_arquivo: string
          nota_fiscal_id: string
          tamanho_bytes?: number | null
          tipo_documento: string
          url_arquivo?: string | null
        }
        Update: {
          conteudo_base64?: string | null
          created_at?: string
          id?: string
          nome_arquivo?: string
          nota_fiscal_id?: string
          tamanho_bytes?: number | null
          tipo_documento?: string
          url_arquivo?: string | null
        }
        Relationships: []
      }
      empresas: {
        Row: {
          ambiente_sefaz: string | null
          cep: string
          certificado_digital: string | null
          certificado_digital_url: string | null
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
          proximo_numero_nfce: number | null
          proximo_numero_nfe: number | null
          razao_social: string
          regime_tributario: string | null
          senha_certificado: string | null
          telefone: string | null
          updated_at: string
        }
        Insert: {
          ambiente_sefaz?: string | null
          cep: string
          certificado_digital?: string | null
          certificado_digital_url?: string | null
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
          proximo_numero_nfce?: number | null
          proximo_numero_nfe?: number | null
          razao_social: string
          regime_tributario?: string | null
          senha_certificado?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          ambiente_sefaz?: string | null
          cep?: string
          certificado_digital?: string | null
          certificado_digital_url?: string | null
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
          proximo_numero_nfce?: number | null
          proximo_numero_nfe?: number | null
          razao_social?: string
          regime_tributario?: string | null
          senha_certificado?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      fornecedores: {
        Row: {
          ativo: boolean | null
          cep: string
          cidade: string
          cpf_cnpj: string
          created_at: string | null
          email: string | null
          empresa_id: string
          endereco: string
          estado: string
          id: string
          inscricao_estadual: string | null
          inscricao_municipal: string | null
          nome_fantasia: string | null
          nome_razao_social: string
          telefone: string | null
          tipo_pessoa: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          cep: string
          cidade: string
          cpf_cnpj: string
          created_at?: string | null
          email?: string | null
          empresa_id: string
          endereco: string
          estado: string
          id?: string
          inscricao_estadual?: string | null
          inscricao_municipal?: string | null
          nome_fantasia?: string | null
          nome_razao_social: string
          telefone?: string | null
          tipo_pessoa: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          cep?: string
          cidade?: string
          cpf_cnpj?: string
          created_at?: string | null
          email?: string | null
          empresa_id?: string
          endereco?: string
          estado?: string
          id?: string
          inscricao_estadual?: string | null
          inscricao_municipal?: string | null
          nome_fantasia?: string | null
          nome_razao_social?: string
          telefone?: string | null
          tipo_pessoa?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fornecedores_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      historico_notas: {
        Row: {
          created_at: string
          dados_retorno: Json | null
          id: string
          nota_fiscal_id: string
          observacao: string | null
          status_anterior: string | null
          status_novo: string
        }
        Insert: {
          created_at?: string
          dados_retorno?: Json | null
          id?: string
          nota_fiscal_id: string
          observacao?: string | null
          status_anterior?: string | null
          status_novo: string
        }
        Update: {
          created_at?: string
          dados_retorno?: Json | null
          id?: string
          nota_fiscal_id?: string
          observacao?: string | null
          status_anterior?: string | null
          status_novo?: string
        }
        Relationships: []
      }
      itens_nfce: {
        Row: {
          cfop: string | null
          created_at: string
          id: string
          nfce_id: string
          produto_id: string
          quantidade: number
          valor_total: number
          valor_unitario: number
        }
        Insert: {
          cfop?: string | null
          created_at?: string
          id?: string
          nfce_id: string
          produto_id: string
          quantidade: number
          valor_total: number
          valor_unitario: number
        }
        Update: {
          cfop?: string | null
          created_at?: string
          id?: string
          nfce_id?: string
          produto_id?: string
          quantidade?: number
          valor_total?: number
          valor_unitario?: number
        }
        Relationships: [
          {
            foreignKeyName: "itens_nfce_nfce_id_fkey"
            columns: ["nfce_id"]
            isOneToOne: false
            referencedRelation: "nfce"
            referencedColumns: ["id"]
          },
        ]
      }
      itens_nota_fiscal: {
        Row: {
          cfop: string | null
          created_at: string
          id: string
          nota_fiscal_id: string
          produto_id: string
          quantidade: number
          valor_total: number
          valor_unitario: number
        }
        Insert: {
          cfop?: string | null
          created_at?: string
          id?: string
          nota_fiscal_id: string
          produto_id: string
          quantidade: number
          valor_total: number
          valor_unitario: number
        }
        Update: {
          cfop?: string | null
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
      logs_operacoes: {
        Row: {
          created_at: string
          dados_operacao: Json | null
          descricao: string
          empresa_id: string
          id: string
          ip_origem: string | null
          tipo_operacao: string
          usuario_id: string | null
        }
        Insert: {
          created_at?: string
          dados_operacao?: Json | null
          descricao: string
          empresa_id: string
          id?: string
          ip_origem?: string | null
          tipo_operacao: string
          usuario_id?: string | null
        }
        Update: {
          created_at?: string
          dados_operacao?: Json | null
          descricao?: string
          empresa_id?: string
          id?: string
          ip_origem?: string | null
          tipo_operacao?: string
          usuario_id?: string | null
        }
        Relationships: []
      }
      logs_sefaz: {
        Row: {
          chave_acesso: string | null
          codigo_retorno: string | null
          created_at: string
          empresa_id: string
          id: string
          ip_origem: unknown | null
          mensagem_retorno: string | null
          nota_fiscal_id: string | null
          operacao: string
          protocolo: string | null
          status_operacao: string
          tempo_resposta_ms: number | null
          user_agent: string | null
          xml_enviado: string | null
          xml_retorno: string | null
        }
        Insert: {
          chave_acesso?: string | null
          codigo_retorno?: string | null
          created_at?: string
          empresa_id: string
          id?: string
          ip_origem?: unknown | null
          mensagem_retorno?: string | null
          nota_fiscal_id?: string | null
          operacao: string
          protocolo?: string | null
          status_operacao: string
          tempo_resposta_ms?: number | null
          user_agent?: string | null
          xml_enviado?: string | null
          xml_retorno?: string | null
        }
        Update: {
          chave_acesso?: string | null
          codigo_retorno?: string | null
          created_at?: string
          empresa_id?: string
          id?: string
          ip_origem?: unknown | null
          mensagem_retorno?: string | null
          nota_fiscal_id?: string | null
          operacao?: string
          protocolo?: string | null
          status_operacao?: string
          tempo_resposta_ms?: number | null
          user_agent?: string | null
          xml_enviado?: string | null
          xml_retorno?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "logs_sefaz_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "logs_sefaz_nota_fiscal_id_fkey"
            columns: ["nota_fiscal_id"]
            isOneToOne: false
            referencedRelation: "notas_fiscais"
            referencedColumns: ["id"]
          },
        ]
      }
      marcas: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          descricao: string | null
          empresa_id: string
          id: string
          nome: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          empresa_id: string
          id?: string
          nome: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          empresa_id?: string
          id?: string
          nome?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marcas_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      nfce: {
        Row: {
          ambiente_emissao: string | null
          chave_acesso: string | null
          cliente_id: string
          codigo_retorno_sefaz: string | null
          created_at: string
          danfe_pdf_url: string | null
          data_autorizacao: string | null
          data_cancelamento: string | null
          data_emissao: string
          empresa_id: string
          id: string
          justificativa_cancelamento: string | null
          mensagem_retorno_sefaz: string | null
          natureza_operacao: string | null
          numero: number
          observacoes: string | null
          protocolo_autorizacao: string | null
          serie: number
          status: string
          updated_at: string
          valor_total: number
          xml_nfce: string | null
        }
        Insert: {
          ambiente_emissao?: string | null
          chave_acesso?: string | null
          cliente_id: string
          codigo_retorno_sefaz?: string | null
          created_at?: string
          danfe_pdf_url?: string | null
          data_autorizacao?: string | null
          data_cancelamento?: string | null
          data_emissao?: string
          empresa_id: string
          id?: string
          justificativa_cancelamento?: string | null
          mensagem_retorno_sefaz?: string | null
          natureza_operacao?: string | null
          numero: number
          observacoes?: string | null
          protocolo_autorizacao?: string | null
          serie?: number
          status?: string
          updated_at?: string
          valor_total: number
          xml_nfce?: string | null
        }
        Update: {
          ambiente_emissao?: string | null
          chave_acesso?: string | null
          cliente_id?: string
          codigo_retorno_sefaz?: string | null
          created_at?: string
          danfe_pdf_url?: string | null
          data_autorizacao?: string | null
          data_cancelamento?: string | null
          data_emissao?: string
          empresa_id?: string
          id?: string
          justificativa_cancelamento?: string | null
          mensagem_retorno_sefaz?: string | null
          natureza_operacao?: string | null
          numero?: number
          observacoes?: string | null
          protocolo_autorizacao?: string | null
          serie?: number
          status?: string
          updated_at?: string
          valor_total?: number
          xml_nfce?: string | null
        }
        Relationships: []
      }
      notas_fiscais: {
        Row: {
          ambiente_emissao: string | null
          chave_acesso: string | null
          cliente_id: string
          codigo_retorno_sefaz: string | null
          created_at: string
          danfe_pdf_url: string | null
          data_autorizacao: string | null
          data_cancelamento: string | null
          data_emissao: string
          empresa_id: string
          id: string
          justificativa_cancelamento: string | null
          mensagem_retorno_sefaz: string | null
          modalidade_frete: string | null
          natureza_operacao: string | null
          numero: number
          observacoes: string | null
          protocolo_autorizacao: string | null
          serie: number
          status: string
          transportadora_id: string | null
          updated_at: string
          valor_cofins: number | null
          valor_icms: number | null
          valor_ipi: number | null
          valor_pis: number | null
          valor_total: number
          xml_nfe: string | null
          xml_url: string | null
        }
        Insert: {
          ambiente_emissao?: string | null
          chave_acesso?: string | null
          cliente_id: string
          codigo_retorno_sefaz?: string | null
          created_at?: string
          danfe_pdf_url?: string | null
          data_autorizacao?: string | null
          data_cancelamento?: string | null
          data_emissao?: string
          empresa_id: string
          id?: string
          justificativa_cancelamento?: string | null
          mensagem_retorno_sefaz?: string | null
          modalidade_frete?: string | null
          natureza_operacao?: string | null
          numero: number
          observacoes?: string | null
          protocolo_autorizacao?: string | null
          serie?: number
          status?: string
          transportadora_id?: string | null
          updated_at?: string
          valor_cofins?: number | null
          valor_icms?: number | null
          valor_ipi?: number | null
          valor_pis?: number | null
          valor_total?: number
          xml_nfe?: string | null
          xml_url?: string | null
        }
        Update: {
          ambiente_emissao?: string | null
          chave_acesso?: string | null
          cliente_id?: string
          codigo_retorno_sefaz?: string | null
          created_at?: string
          danfe_pdf_url?: string | null
          data_autorizacao?: string | null
          data_cancelamento?: string | null
          data_emissao?: string
          empresa_id?: string
          id?: string
          justificativa_cancelamento?: string | null
          mensagem_retorno_sefaz?: string | null
          modalidade_frete?: string | null
          natureza_operacao?: string | null
          numero?: number
          observacoes?: string | null
          protocolo_autorizacao?: string | null
          serie?: number
          status?: string
          transportadora_id?: string | null
          updated_at?: string
          valor_cofins?: number | null
          valor_icms?: number | null
          valor_ipi?: number | null
          valor_pis?: number | null
          valor_total?: number
          xml_nfe?: string | null
          xml_url?: string | null
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
          {
            foreignKeyName: "notas_fiscais_transportadora_id_fkey"
            columns: ["transportadora_id"]
            isOneToOne: false
            referencedRelation: "contatos"
            referencedColumns: ["id"]
          },
        ]
      }
      produtos: {
        Row: {
          categoria_id: string | null
          cfop: string
          codigo: string
          codigo_interno: string | null
          cofins_aliquota: number | null
          created_at: string
          csosn: string | null
          cst_icms: string | null
          descricao: string
          ean: string | null
          empresa_id: string
          estoque_atual: number | null
          estoque_minimo: number | null
          fornecedor_id: string | null
          icms_aliquota: number | null
          id: string
          ipi_aliquota: number | null
          marca_id: string | null
          ncm: string | null
          nome: string | null
          pis_aliquota: number | null
          preco_unitario: number
          unidade: string
          updated_at: string
        }
        Insert: {
          categoria_id?: string | null
          cfop?: string
          codigo: string
          codigo_interno?: string | null
          cofins_aliquota?: number | null
          created_at?: string
          csosn?: string | null
          cst_icms?: string | null
          descricao: string
          ean?: string | null
          empresa_id: string
          estoque_atual?: number | null
          estoque_minimo?: number | null
          fornecedor_id?: string | null
          icms_aliquota?: number | null
          id?: string
          ipi_aliquota?: number | null
          marca_id?: string | null
          ncm?: string | null
          nome?: string | null
          pis_aliquota?: number | null
          preco_unitario: number
          unidade?: string
          updated_at?: string
        }
        Update: {
          categoria_id?: string | null
          cfop?: string
          codigo?: string
          codigo_interno?: string | null
          cofins_aliquota?: number | null
          created_at?: string
          csosn?: string | null
          cst_icms?: string | null
          descricao?: string
          ean?: string | null
          empresa_id?: string
          estoque_atual?: number | null
          estoque_minimo?: number | null
          fornecedor_id?: string | null
          icms_aliquota?: number | null
          id?: string
          ipi_aliquota?: number | null
          marca_id?: string | null
          ncm?: string | null
          nome?: string | null
          pis_aliquota?: number | null
          preco_unitario?: number
          unidade?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "produtos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias_produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_marca_id_fkey"
            columns: ["marca_id"]
            isOneToOne: false
            referencedRelation: "marcas"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          empresa_id: string | null
          id: string
          nome: string
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          empresa_id?: string | null
          id: string
          nome: string
          role?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          empresa_id?: string | null
          id?: string
          nome?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      servicos: {
        Row: {
          aliquota_iss: number | null
          ativo: boolean
          codigo: string
          codigo_servico_municipal: string | null
          created_at: string
          descricao: string | null
          empresa_id: string
          id: string
          nome: string
          preco_unitario: number
          unidade: string
          updated_at: string
        }
        Insert: {
          aliquota_iss?: number | null
          ativo?: boolean
          codigo: string
          codigo_servico_municipal?: string | null
          created_at?: string
          descricao?: string | null
          empresa_id: string
          id?: string
          nome: string
          preco_unitario?: number
          unidade?: string
          updated_at?: string
        }
        Update: {
          aliquota_iss?: number | null
          ativo?: boolean
          codigo?: string
          codigo_servico_municipal?: string | null
          created_at?: string
          descricao?: string | null
          empresa_id?: string
          id?: string
          nome?: string
          preco_unitario?: number
          unidade?: string
          updated_at?: string
        }
        Relationships: []
      }
      transportadoras: {
        Row: {
          ativo: boolean | null
          cep: string
          cidade: string
          cpf_cnpj: string
          created_at: string | null
          email: string | null
          empresa_id: string
          endereco: string
          estado: string
          id: string
          inscricao_estadual: string | null
          nome_fantasia: string | null
          nome_razao_social: string
          placa_veiculo: string | null
          rntrc: string | null
          telefone: string | null
          tipo_pessoa: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          cep: string
          cidade: string
          cpf_cnpj: string
          created_at?: string | null
          email?: string | null
          empresa_id: string
          endereco: string
          estado: string
          id?: string
          inscricao_estadual?: string | null
          nome_fantasia?: string | null
          nome_razao_social: string
          placa_veiculo?: string | null
          rntrc?: string | null
          telefone?: string | null
          tipo_pessoa: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          cep?: string
          cidade?: string
          cpf_cnpj?: string
          created_at?: string | null
          email?: string | null
          empresa_id?: string
          endereco?: string
          estado?: string
          id?: string
          inscricao_estadual?: string | null
          nome_fantasia?: string | null
          nome_razao_social?: string
          placa_veiculo?: string | null
          rntrc?: string | null
          telefone?: string | null
          tipo_pessoa?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transportadoras_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      unidades_medida: {
        Row: {
          codigo: string
          created_at: string | null
          descricao: string
          id: string
        }
        Insert: {
          codigo: string
          created_at?: string | null
          descricao: string
          id?: string
        }
        Update: {
          codigo?: string
          created_at?: string | null
          descricao?: string
          id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          ativo: boolean | null
          created_at: string
          email: string
          empresa_id: string
          id: string
          nome: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string
          email: string
          empresa_id: string
          id?: string
          nome: string
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ativo?: boolean | null
          created_at?: string
          email?: string
          empresa_id?: string
          id?: string
          nome?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      validar_cnpj: {
        Args: { cnpj: string }
        Returns: boolean
      }
      validar_cpf: {
        Args: { cpf: string }
        Returns: boolean
      }
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
