
-- Criar tabela de serviços (complementar à existente)
CREATE TABLE IF NOT EXISTS public.servicos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID NOT NULL,
  codigo TEXT NOT NULL,
  nome TEXT NOT NULL,
  descricao TEXT,
  preco_unitario NUMERIC NOT NULL DEFAULT 0,
  unidade TEXT NOT NULL DEFAULT 'UN',
  codigo_servico_municipal TEXT,
  aliquota_iss NUMERIC(5,2) DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS para serviços
ALTER TABLE public.servicos ENABLE ROW LEVEL SECURITY;

-- Criar política RLS para serviços
CREATE POLICY "Users can manage servicos of their company" ON servicos
  FOR ALL USING (empresa_id IN (
    SELECT empresa_id FROM profiles WHERE id = auth.uid()
  ));

-- Criar tabela RPS NFSe (complementar à nfse_emitidas existente)
CREATE TABLE IF NOT EXISTS public.rps_nfse (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prestador_id UUID NOT NULL,
  numero_rps INTEGER NOT NULL,
  serie_rps TEXT NOT NULL DEFAULT 'RPS',
  tipo_rps TEXT NOT NULL DEFAULT 'RPS',
  data_emissao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'rascunho',
  tomador_nome TEXT NOT NULL,
  tomador_cnpj_cpf TEXT,
  tomador_endereco TEXT,
  tomador_email TEXT,
  discriminacao TEXT NOT NULL,
  valor_servicos NUMERIC NOT NULL DEFAULT 0,
  valor_iss NUMERIC NOT NULL DEFAULT 0,
  valor_liquido NUMERIC NOT NULL DEFAULT 0,
  aliquota_iss NUMERIC NOT NULL DEFAULT 0,
  iss_retido BOOLEAN NOT NULL DEFAULT false,
  codigo_servico TEXT,
  numero_nfse TEXT,
  codigo_verificacao TEXT,
  protocolo TEXT,
  xml_rps TEXT,
  xml_nfse TEXT,
  pdf_url TEXT,
  mensagem_retorno TEXT,
  data_processamento TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS para RPS NFSe
ALTER TABLE public.rps_nfse ENABLE ROW LEVEL SECURITY;

-- Criar política RLS para RPS NFSe
CREATE POLICY "Users can manage rps_nfse of their company" ON rps_nfse
  FOR ALL USING (prestador_id IN (
    SELECT id FROM empresas WHERE id IN (
      SELECT empresa_id FROM profiles WHERE id = auth.uid()
    )
  ));

-- Criar tabela de itens do RPS NFSe
CREATE TABLE IF NOT EXISTS public.itens_rps_nfse (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rps_id UUID NOT NULL REFERENCES rps_nfse(id) ON DELETE CASCADE,
  servico_id UUID REFERENCES servicos(id),
  descricao TEXT NOT NULL,
  quantidade NUMERIC NOT NULL DEFAULT 1,
  valor_unitario NUMERIC NOT NULL DEFAULT 0,
  valor_total NUMERIC NOT NULL DEFAULT 0,
  codigo_servico TEXT,
  aliquota_iss NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS para itens RPS NFSe
ALTER TABLE public.itens_rps_nfse ENABLE ROW LEVEL SECURITY;

-- Criar política RLS para itens RPS NFSe
CREATE POLICY "Users can manage itens_rps_nfse through rps" ON itens_rps_nfse
  FOR ALL USING (rps_id IN (
    SELECT id FROM rps_nfse WHERE prestador_id IN (
      SELECT id FROM empresas WHERE id IN (
        SELECT empresa_id FROM profiles WHERE id = auth.uid()
      )
    )
  ));

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_servicos_empresa_id ON servicos(empresa_id);
CREATE INDEX IF NOT EXISTS idx_servicos_codigo ON servicos(codigo);
CREATE INDEX IF NOT EXISTS idx_rps_nfse_prestador_id ON rps_nfse(prestador_id);
CREATE INDEX IF NOT EXISTS idx_rps_nfse_numero_serie ON rps_nfse(numero_rps, serie_rps);
CREATE INDEX IF NOT EXISTS idx_itens_rps_nfse_rps_id ON itens_rps_nfse(rps_id);
CREATE INDEX IF NOT EXISTS idx_itens_rps_nfse_servico_id ON itens_rps_nfse(servico_id);
