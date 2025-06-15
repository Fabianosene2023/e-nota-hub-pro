
-- Criar tabela para armazenar NFSe emitidas
CREATE TABLE public.nfse_emitidas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID NOT NULL,
  numero_nfse TEXT NOT NULL,
  numero_rps BIGINT NOT NULL,
  serie_rps TEXT NOT NULL DEFAULT 'RPS',
  tomador_nome TEXT NOT NULL,
  tomador_cpf_cnpj TEXT,
  descricao_servico TEXT NOT NULL,
  valor_servico NUMERIC(10,2) NOT NULL,
  codigo_verificacao TEXT,
  data_emissao DATE NOT NULL,
  xml_nfse TEXT,
  protocolo TEXT,
  ambiente TEXT NOT NULL DEFAULT 'homologacao',
  status TEXT NOT NULL DEFAULT 'emitida',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.nfse_emitidas ENABLE ROW LEVEL SECURITY;

-- Políticas RLS básicas (ajustar conforme necessário)
CREATE POLICY "Acesso por empresa" ON public.nfse_emitidas
  FOR ALL USING (true);

-- Índices para melhor performance
CREATE INDEX idx_nfse_emitidas_empresa_id ON public.nfse_emitidas(empresa_id);
CREATE INDEX idx_nfse_emitidas_numero_nfse ON public.nfse_emitidas(numero_nfse);
