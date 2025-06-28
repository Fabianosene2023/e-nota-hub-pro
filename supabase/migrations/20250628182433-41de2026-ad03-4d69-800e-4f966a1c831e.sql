
-- Criar tabela de prestadores de serviço
CREATE TABLE public.prestadores_servico (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID NOT NULL,
  cnpj TEXT NOT NULL,
  inscricao_municipal TEXT,
  regime_tributario TEXT NOT NULL DEFAULT 'simples_nacional',
  certificado_digital_id UUID,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Atualizar tabela de serviços para incluir código do serviço municipal
ALTER TABLE public.servicos 
ADD COLUMN IF NOT EXISTS codigo_servico_municipal TEXT,
ADD COLUMN IF NOT EXISTS aliquota_iss NUMERIC DEFAULT 0;

-- Criar tabela de configurações de NFSe por município
CREATE TABLE public.configuracoes_nfse (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prestador_id UUID NOT NULL REFERENCES prestadores_servico(id),
  municipio_codigo TEXT NOT NULL,
  municipio_nome TEXT NOT NULL,
  padrao_nfse TEXT NOT NULL DEFAULT 'ginfes', -- ginfes, issnet, nfse_sp, etc
  url_webservice TEXT NOT NULL,
  ambiente TEXT NOT NULL DEFAULT 'homologacao',
  proximo_numero_rps INTEGER NOT NULL DEFAULT 1,
  serie_rps TEXT NOT NULL DEFAULT 'RPS',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de RPS/NFSe emitidas
CREATE TABLE public.rps_nfse (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prestador_id UUID NOT NULL REFERENCES prestadores_servico(id),
  numero_rps INTEGER NOT NULL,
  serie_rps TEXT NOT NULL DEFAULT 'RPS',
  tipo_rps TEXT NOT NULL DEFAULT 'RPS',
  data_emissao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'rascunho',
  tomador_cnpj_cpf TEXT,
  tomador_nome TEXT NOT NULL,
  tomador_endereco TEXT,
  tomador_email TEXT,
  valor_servicos NUMERIC NOT NULL DEFAULT 0,
  valor_iss NUMERIC NOT NULL DEFAULT 0,
  valor_liquido NUMERIC NOT NULL DEFAULT 0,
  discriminacao TEXT NOT NULL,
  codigo_servico TEXT,
  aliquota_iss NUMERIC NOT NULL DEFAULT 0,
  iss_retido BOOLEAN NOT NULL DEFAULT false,
  numero_nfse TEXT,
  codigo_verificacao TEXT,
  protocolo TEXT,
  xml_rps TEXT,
  xml_nfse TEXT,
  pdf_url TEXT,
  data_processamento TIMESTAMP WITH TIME ZONE,
  mensagem_retorno TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de itens de RPS/NFSe
CREATE TABLE public.itens_rps_nfse (
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

-- Habilitar RLS para todas as tabelas
ALTER TABLE public.prestadores_servico ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuracoes_nfse ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rps_nfse ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itens_rps_nfse ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS básicas (usuários autenticados podem acessar dados de sua empresa)
CREATE POLICY "Users can manage prestadores of their company" ON prestadores_servico
  FOR ALL USING (empresa_id IN (
    SELECT empresa_id FROM profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Users can manage configuracoes_nfse" ON configuracoes_nfse
  FOR ALL USING (prestador_id IN (
    SELECT id FROM prestadores_servico WHERE empresa_id IN (
      SELECT empresa_id FROM profiles WHERE id = auth.uid()
    )
  ));

CREATE POLICY "Users can manage rps_nfse" ON rps_nfse
  FOR ALL USING (prestador_id IN (
    SELECT id FROM prestadores_servico WHERE empresa_id IN (
      SELECT empresa_id FROM profiles WHERE id = auth.uid()
    )
  ));

CREATE POLICY "Users can manage itens_rps_nfse" ON itens_rps_nfse
  FOR ALL USING (rps_id IN (
    SELECT id FROM rps_nfse WHERE prestador_id IN (
      SELECT id FROM prestadores_servico WHERE empresa_id IN (
        SELECT empresa_id FROM profiles WHERE id = auth.uid()
      )
    )
  ));

-- Criar índices para performance
CREATE INDEX idx_prestadores_servico_empresa_id ON prestadores_servico(empresa_id);
CREATE INDEX idx_configuracoes_nfse_prestador_id ON configuracoes_nfse(prestador_id);
CREATE INDEX idx_rps_nfse_prestador_id ON rps_nfse(prestador_id);
CREATE INDEX idx_rps_nfse_numero_serie ON rps_nfse(numero_rps, serie_rps);
CREATE INDEX idx_itens_rps_nfse_rps_id ON itens_rps_nfse(rps_id);
