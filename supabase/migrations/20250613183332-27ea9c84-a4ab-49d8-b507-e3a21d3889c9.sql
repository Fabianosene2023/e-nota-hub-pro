
-- Criar tabela para armazenar certificados digitais de forma segura
CREATE TABLE IF NOT EXISTS public.certificados_digitais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  nome_arquivo TEXT NOT NULL,
  conteudo_criptografado TEXT NOT NULL, -- Certificado .p12/.pfx criptografado
  senha_hash TEXT NOT NULL, -- Hash da senha do certificado
  validade_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
  validade_fim TIMESTAMP WITH TIME ZONE NOT NULL,
  tipo_certificado TEXT NOT NULL DEFAULT 'A1' CHECK (tipo_certificado IN ('A1', 'A3')),
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(empresa_id, ativo) -- Apenas um certificado ativo por empresa
);

-- Habilitar RLS
ALTER TABLE public.certificados_digitais ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para certificados
CREATE POLICY "Empresas podem ver seus certificados" 
  ON public.certificados_digitais 
  FOR SELECT 
  USING (empresa_id IN (SELECT id FROM public.empresas));

CREATE POLICY "Empresas podem inserir seus certificados" 
  ON public.certificados_digitais 
  FOR INSERT 
  WITH CHECK (empresa_id IN (SELECT id FROM public.empresas));

CREATE POLICY "Empresas podem atualizar seus certificados" 
  ON public.certificados_digitais 
  FOR UPDATE 
  USING (empresa_id IN (SELECT id FROM public.empresas));

-- Criar tabela para logs detalhados da SEFAZ
CREATE TABLE IF NOT EXISTS public.logs_sefaz (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  nota_fiscal_id UUID REFERENCES public.notas_fiscais(id) ON DELETE SET NULL,
  operacao TEXT NOT NULL CHECK (operacao IN ('emissao', 'consulta', 'cancelamento', 'inutilizacao')),
  status_operacao TEXT NOT NULL CHECK (status_operacao IN ('sucesso', 'erro', 'pendente', 'timeout')),
  codigo_retorno TEXT,
  mensagem_retorno TEXT,
  chave_acesso TEXT,
  protocolo TEXT,
  tempo_resposta_ms INTEGER,
  xml_enviado TEXT,
  xml_retorno TEXT,
  ip_origem INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS para logs SEFAZ
ALTER TABLE public.logs_sefaz ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para logs SEFAZ
CREATE POLICY "Empresas podem ver seus logs SEFAZ" 
  ON public.logs_sefaz 
  FOR SELECT 
  USING (empresa_id IN (SELECT id FROM public.empresas));

CREATE POLICY "Sistema pode inserir logs SEFAZ" 
  ON public.logs_sefaz 
  FOR INSERT 
  WITH CHECK (true); -- Permitir inserção de logs pelo sistema

-- Criar tabela para configurações SEFAZ por empresa
CREATE TABLE IF NOT EXISTS public.configuracoes_sefaz (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  ambiente TEXT NOT NULL DEFAULT 'homologacao' CHECK (ambiente IN ('homologacao', 'producao')),
  csc_id TEXT, -- Código de Segurança do Contribuinte - ID
  csc_token TEXT, -- Token CSC (será criptografado)
  serie_nfe INTEGER NOT NULL DEFAULT 1,
  serie_nfce INTEGER NOT NULL DEFAULT 1,
  proximo_numero_nfe INTEGER NOT NULL DEFAULT 1,
  proximo_numero_nfce INTEGER NOT NULL DEFAULT 1,
  timeout_sefaz INTEGER NOT NULL DEFAULT 30000, -- 30 segundos
  tentativas_reenvio INTEGER NOT NULL DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(empresa_id)
);

-- Habilitar RLS para configurações SEFAZ
ALTER TABLE public.configuracoes_sefaz ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para configurações SEFAZ
CREATE POLICY "Empresas podem gerenciar suas configurações SEFAZ" 
  ON public.configuracoes_sefaz 
  FOR ALL 
  USING (empresa_id IN (SELECT id FROM public.empresas));

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_certificados_empresa_ativo ON public.certificados_digitais(empresa_id, ativo);
CREATE INDEX IF NOT EXISTS idx_logs_sefaz_empresa_data ON public.logs_sefaz(empresa_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logs_sefaz_chave_acesso ON public.logs_sefaz(chave_acesso);
CREATE INDEX IF NOT EXISTS idx_configuracoes_sefaz_empresa ON public.configuracoes_sefaz(empresa_id);

-- Atualizar tabela de notas fiscais para incluir campos necessários para SEFAZ
ALTER TABLE public.notas_fiscais 
ADD COLUMN IF NOT EXISTS ambiente_emissao TEXT DEFAULT 'homologacao' CHECK (ambiente_emissao IN ('homologacao', 'producao')),
ADD COLUMN IF NOT EXISTS codigo_retorno_sefaz TEXT,
ADD COLUMN IF NOT EXISTS mensagem_retorno_sefaz TEXT,
ADD COLUMN IF NOT EXISTS data_autorizacao TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS justificativa_cancelamento TEXT,
ADD COLUMN IF NOT EXISTS data_cancelamento TIMESTAMP WITH TIME ZONE;

-- Criar função para validar CNPJ
CREATE OR REPLACE FUNCTION public.validar_cnpj(cnpj TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  cnpj_limpo TEXT;
  soma INTEGER;
  resto INTEGER;
  digito1 INTEGER;
  digito2 INTEGER;
BEGIN
  -- Remove caracteres não numéricos
  cnpj_limpo := regexp_replace(cnpj, '[^0-9]', '', 'g');
  
  -- Verifica se tem 14 dígitos
  IF length(cnpj_limpo) != 14 THEN
    RETURN FALSE;
  END IF;
  
  -- Verifica sequências inválidas
  IF cnpj_limpo IN ('00000000000000', '11111111111111', '22222222222222', 
                    '33333333333333', '44444444444444', '55555555555555',
                    '66666666666666', '77777777777777', '88888888888888', '99999999999999') THEN
    RETURN FALSE;
  END IF;
  
  -- Calcula primeiro dígito verificador
  soma := 0;
  FOR i IN 1..12 LOOP
    IF i <= 4 THEN
      soma := soma + (substring(cnpj_limpo, i, 1)::INTEGER * (6 - i));
    ELSE
      soma := soma + (substring(cnpj_limpo, i, 1)::INTEGER * (14 - i));
    END IF;
  END LOOP;
  
  resto := soma % 11;
  IF resto < 2 THEN
    digito1 := 0;
  ELSE
    digito1 := 11 - resto;
  END IF;
  
  -- Verifica primeiro dígito
  IF digito1 != substring(cnpj_limpo, 13, 1)::INTEGER THEN
    RETURN FALSE;
  END IF;
  
  -- Calcula segundo dígito verificador
  soma := 0;
  FOR i IN 1..13 LOOP
    IF i <= 5 THEN
      soma := soma + (substring(cnpj_limpo, i, 1)::INTEGER * (7 - i));
    ELSE
      soma := soma + (substring(cnpj_limpo, i, 1)::INTEGER * (15 - i));
    END IF;
  END LOOP;
  
  resto := soma % 11;
  IF resto < 2 THEN
    digito2 := 0;
  ELSE
    digito2 := 11 - resto;
  END IF;
  
  -- Verifica segundo dígito
  RETURN digito2 = substring(cnpj_limpo, 14, 1)::INTEGER;
END;
$$;

-- Criar função para validar CPF
CREATE OR REPLACE FUNCTION public.validar_cpf(cpf TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  cpf_limpo TEXT;
  soma INTEGER;
  resto INTEGER;
  digito1 INTEGER;
  digito2 INTEGER;
BEGIN
  -- Remove caracteres não numéricos
  cpf_limpo := regexp_replace(cpf, '[^0-9]', '', 'g');
  
  -- Verifica se tem 11 dígitos
  IF length(cpf_limpo) != 11 THEN
    RETURN FALSE;
  END IF;
  
  -- Verifica sequências inválidas
  IF cpf_limpo IN ('00000000000', '11111111111', '22222222222', '33333333333', 
                   '44444444444', '55555555555', '66666666666', '77777777777', 
                   '88888888888', '99999999999') THEN
    RETURN FALSE;
  END IF;
  
  -- Calcula primeiro dígito verificador
  soma := 0;
  FOR i IN 1..9 LOOP
    soma := soma + (substring(cpf_limpo, i, 1)::INTEGER * (11 - i));
  END LOOP;
  
  resto := soma % 11;
  IF resto < 2 THEN
    digito1 := 0;
  ELSE
    digito1 := 11 - resto;
  END IF;
  
  -- Verifica primeiro dígito
  IF digito1 != substring(cpf_limpo, 10, 1)::INTEGER THEN
    RETURN FALSE;
  END IF;
  
  -- Calcula segundo dígito verificador
  soma := 0;
  FOR i IN 1..10 LOOP
    soma := soma + (substring(cpf_limpo, i, 1)::INTEGER * (12 - i));
  END LOOP;
  
  resto := soma % 11;
  IF resto < 2 THEN
    digito2 := 0;
  ELSE
    digito2 := 11 - resto;
  END IF;
  
  -- Verifica segundo dígito
  RETURN digito2 = substring(cpf_limpo, 11, 1)::INTEGER;
END;
$$;
