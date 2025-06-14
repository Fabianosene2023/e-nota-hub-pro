
-- Criar tabela para serviços
CREATE TABLE public.servicos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID NOT NULL,
  codigo TEXT NOT NULL,
  nome TEXT NOT NULL,
  descricao TEXT,
  preco_unitario NUMERIC NOT NULL DEFAULT 0,
  unidade TEXT NOT NULL DEFAULT 'UN',
  aliquota_iss NUMERIC DEFAULT 0,
  codigo_servico_municipal TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(empresa_id, codigo)
);

-- Adicionar RLS (Row Level Security)
ALTER TABLE public.servicos ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para serviços
CREATE POLICY "Users can view servicos from their company" 
  ON public.servicos 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create servicos" 
  ON public.servicos 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can update servicos" 
  ON public.servicos 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Users can delete servicos" 
  ON public.servicos 
  FOR DELETE 
  USING (true);

-- Criar índices para performance
CREATE INDEX idx_servicos_empresa_id ON public.servicos(empresa_id);
CREATE INDEX idx_servicos_codigo ON public.servicos(codigo);
CREATE INDEX idx_servicos_ativo ON public.servicos(ativo);
