
-- Adicionar campos necessários para certificados digitais e configurações avançadas
ALTER TABLE configuracoes ADD COLUMN IF NOT EXISTS certificado_a1_data TEXT;
ALTER TABLE configuracoes ADD COLUMN IF NOT EXISTS certificado_a1_senha TEXT;
ALTER TABLE configuracoes ADD COLUMN IF NOT EXISTS serie_nfe INTEGER DEFAULT 1;
ALTER TABLE configuracoes ADD COLUMN IF NOT EXISTS serie_nfce INTEGER DEFAULT 1;
ALTER TABLE configuracoes ADD COLUMN IF NOT EXISTS csc_id TEXT;

-- Criar tabela para logs de operações (auditoria)
CREATE TABLE IF NOT EXISTS public.logs_operacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID NOT NULL,
  usuario_id UUID,
  tipo_operacao TEXT NOT NULL,
  descricao TEXT NOT NULL,
  dados_operacao JSONB,
  ip_origem TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para usuários do sistema (perfis)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'visualizador',
  empresa_id UUID NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para armazenar XMLs e PDFs das notas
CREATE TABLE IF NOT EXISTS public.documentos_fiscais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nota_fiscal_id UUID NOT NULL,
  tipo_documento TEXT NOT NULL,
  nome_arquivo TEXT NOT NULL,
  url_arquivo TEXT,
  conteudo_base64 TEXT,
  tamanho_bytes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para histórico de status das notas
CREATE TABLE IF NOT EXISTS public.historico_notas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nota_fiscal_id UUID NOT NULL,
  status_anterior TEXT,
  status_novo TEXT NOT NULL,
  observacao TEXT,
  dados_retorno JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar campos para controle de numeração automática
ALTER TABLE empresas ADD COLUMN IF NOT EXISTS proximo_numero_nfe INTEGER DEFAULT 1;
ALTER TABLE empresas ADD COLUMN IF NOT EXISTS proximo_numero_nfce INTEGER DEFAULT 1;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_logs_operacoes_empresa_data ON logs_operacoes(empresa_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_historico_notas_nota_fiscal ON historico_notas(nota_fiscal_id);
CREATE INDEX IF NOT EXISTS idx_documentos_fiscais_nota_fiscal ON documentos_fiscais(nota_fiscal_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_empresa ON user_profiles(empresa_id);

-- RLS policies
ALTER TABLE logs_operacoes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Logs visíveis para empresa" ON logs_operacoes;
CREATE POLICY "Logs visíveis para empresa" ON logs_operacoes FOR SELECT USING (true);
DROP POLICY IF EXISTS "Inserir logs da empresa" ON logs_operacoes;
CREATE POLICY "Inserir logs da empresa" ON logs_operacoes FOR INSERT WITH CHECK (true);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Perfis visíveis para empresa" ON user_profiles;
CREATE POLICY "Perfis visíveis para empresa" ON user_profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Gerenciar perfis da empresa" ON user_profiles;
CREATE POLICY "Gerenciar perfis da empresa" ON user_profiles FOR ALL USING (true);

ALTER TABLE documentos_fiscais ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Documentos visíveis para todos" ON documentos_fiscais;
CREATE POLICY "Documentos visíveis para todos" ON documentos_fiscais FOR SELECT USING (true);
DROP POLICY IF EXISTS "Inserir documentos" ON documentos_fiscais;
CREATE POLICY "Inserir documentos" ON documentos_fiscais FOR INSERT WITH CHECK (true);

ALTER TABLE historico_notas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Histórico visível para todos" ON historico_notas;
CREATE POLICY "Histórico visível para todos" ON historico_notas FOR SELECT USING (true);
DROP POLICY IF EXISTS "Inserir histórico" ON historico_notas;
CREATE POLICY "Inserir histórico" ON historico_notas FOR INSERT WITH CHECK (true);
