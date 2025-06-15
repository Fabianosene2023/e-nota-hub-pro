
-- Tabela principal de NFCe
CREATE TABLE public.nfce (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,
  cliente_id uuid NOT NULL,
  numero integer NOT NULL,
  serie integer NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'rascunho',
  chave_acesso text, 
  protocolo_autorizacao text,
  xml_nfce text,
  danfe_pdf_url text,
  valor_total numeric NOT NULL,
  natureza_operacao text DEFAULT 'Venda de mercadoria',
  data_emissao timestamptz NOT NULL DEFAULT now(),
  data_autorizacao timestamptz,
  ambiente_emissao text DEFAULT 'homologacao',
  justificativa_cancelamento text,
  data_cancelamento timestamptz,
  mensagem_retorno_sefaz text,
  codigo_retorno_sefaz text,
  observacoes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Itens da NFCe
CREATE TABLE public.itens_nfce (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nfce_id uuid NOT NULL REFERENCES public.nfce(id) ON DELETE CASCADE,
  produto_id uuid NOT NULL,
  quantidade numeric NOT NULL,
  valor_unitario numeric NOT NULL,
  valor_total numeric NOT NULL,
  cfop text DEFAULT '5102',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Políticas RLS: Somente usuários da empresa podem manipular as notas NFCe e seus itens
ALTER TABLE public.nfce ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Só empresa pode acessar NFCe" ON public.nfce
  FOR ALL
  USING (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));

ALTER TABLE public.itens_nfce ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Só empresa pode acessar itens NFCe" ON public.itens_nfce
  FOR ALL
  USING (
    nfce_id IN (
      SELECT nfce.id FROM public.nfce 
      WHERE nfce.empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid())
    )
  );
