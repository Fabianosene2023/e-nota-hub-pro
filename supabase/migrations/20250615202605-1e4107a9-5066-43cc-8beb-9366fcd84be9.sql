
-- Criar tabela para armazenar MDFe recebidos
CREATE TABLE public.mdfe_recebidos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID NOT NULL,
  chave_acesso TEXT NOT NULL UNIQUE,
  numero_mdfe TEXT NOT NULL,
  serie TEXT NOT NULL DEFAULT '1',
  data_emissao TIMESTAMP WITH TIME ZONE NOT NULL,
  data_recebimento TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  remetente_cnpj TEXT NOT NULL,
  remetente_nome TEXT NOT NULL,
  destinatario_cnpj TEXT,
  destinatario_nome TEXT,
  valor_total NUMERIC(15,2) NOT NULL DEFAULT 0,
  peso_total NUMERIC(15,3) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'recebido',
  protocolo_autorizacao TEXT,
  xml_mdfe TEXT,
  observacoes TEXT,
  ambiente_emissao TEXT NOT NULL DEFAULT 'homologacao',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para itens/cargas do MDFe
CREATE TABLE public.itens_mdfe (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mdfe_id UUID NOT NULL REFERENCES public.mdfe_recebidos(id) ON DELETE CASCADE,
  codigo_produto TEXT,
  descricao_produto TEXT NOT NULL,
  quantidade NUMERIC(15,3) NOT NULL DEFAULT 0,
  peso_item NUMERIC(15,3) NOT NULL DEFAULT 0,
  valor_item NUMERIC(15,2) NOT NULL DEFAULT 0,
  cfop TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para histórico de eventos dos MDFe
CREATE TABLE public.historico_mdfe (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mdfe_id UUID NOT NULL REFERENCES public.mdfe_recebidos(id) ON DELETE CASCADE,
  evento TEXT NOT NULL,
  descricao TEXT,
  data_evento TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  usuario_id UUID,
  dados_evento JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar índices para melhor performance
CREATE INDEX idx_mdfe_recebidos_empresa_id ON public.mdfe_recebidos(empresa_id);
CREATE INDEX idx_mdfe_recebidos_chave_acesso ON public.mdfe_recebidos(chave_acesso);
CREATE INDEX idx_mdfe_recebidos_data_emissao ON public.mdfe_recebidos(data_emissao);
CREATE INDEX idx_mdfe_recebidos_status ON public.mdfe_recebidos(status);
CREATE INDEX idx_itens_mdfe_mdfe_id ON public.itens_mdfe(mdfe_id);
CREATE INDEX idx_historico_mdfe_mdfe_id ON public.historico_mdfe(mdfe_id);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.mdfe_recebidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itens_mdfe ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historico_mdfe ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS (assumindo que usuários só podem ver dados de sua empresa)
CREATE POLICY "Users can view their company MDFe" 
  ON public.mdfe_recebidos 
  FOR SELECT 
  USING (true); -- Por enquanto permitir acesso total, ajustar conforme necessário

CREATE POLICY "Users can insert their company MDFe" 
  ON public.mdfe_recebidos 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can update their company MDFe" 
  ON public.mdfe_recebidos 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Users can view MDFe items" 
  ON public.itens_mdfe 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert MDFe items" 
  ON public.itens_mdfe 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can view MDFe history" 
  ON public.historico_mdfe 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert MDFe history" 
  ON public.historico_mdfe 
  FOR INSERT 
  WITH CHECK (true);
