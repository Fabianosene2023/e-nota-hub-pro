
-- Tabela principal de CT-e
CREATE TABLE public.cte (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL,
  numero integer NOT NULL,
  serie integer NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'rascunho',
  chave_acesso text,
  protocolo_autorizacao text,
  xml_cte text,
  pdf_dacte_url text,
  valor_total numeric NOT NULL,
  natureza_operacao text DEFAULT 'Transporte de cargas',
  data_emissao timestamptz NOT NULL DEFAULT now(),
  data_autorizacao timestamptz,
  ambiente_emissao text DEFAULT 'homologacao',
  justificativa_cancelamento text,
  data_cancelamento timestamptz,
  mensagem_retorno_sefaz text,
  codigo_retorno_sefaz text,
  observacoes text,
  remetente_id uuid,
  destinatario_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Itens do CT-e (mercadorias transportadas)
CREATE TABLE public.itens_cte (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cte_id uuid NOT NULL REFERENCES public.cte(id) ON DELETE CASCADE,
  produto_id uuid NOT NULL,
  quantidade numeric NOT NULL,
  valor_unitario numeric NOT NULL,
  valor_total numeric NOT NULL,
  cfop text DEFAULT '5351',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Eventos do CT-e (registro de qualquer evento, inclusive emissão/desacordo)
CREATE TABLE public.eventos_cte (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cte_id uuid NOT NULL REFERENCES public.cte(id) ON DELETE CASCADE,
  tipo_evento text NOT NULL, -- 'emissao' | 'desacordo' | etc
  data_evento timestamptz NOT NULL DEFAULT now(),
  justificativa text,
  usuario_id uuid, -- quem registrou o evento
  dados jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Tabela específica de emissão de desacordo no CT-e
CREATE TABLE public.desacordo_cte (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cte_id uuid NOT NULL REFERENCES public.cte(id) ON DELETE CASCADE,
  usuario_id uuid,
  justificativa text NOT NULL,
  data_desacordo timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'pendente', -- 'pendente', 'aceito', 'rejeitado'
  created_at timestamptz NOT NULL DEFAULT now()
);

-- RLS: Apenas usuários da empresa podem manipular registros de cte, itens, eventos e desacordo
ALTER TABLE public.cte ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Só empresa pode acessar CT-e" ON public.cte
  FOR ALL
  USING (empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid()));

ALTER TABLE public.itens_cte ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Só empresa pode acessar itens CT-e" ON public.itens_cte
  FOR ALL
  USING (
    cte_id IN (
      SELECT cte.id FROM public.cte
      WHERE cte.empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid())
    )
  );

ALTER TABLE public.eventos_cte ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Só empresa pode acessar eventos CT-e" ON public.eventos_cte
  FOR ALL
  USING (
    cte_id IN (
      SELECT cte.id FROM public.cte
      WHERE cte.empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid())
    )
  );

ALTER TABLE public.desacordo_cte ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Só empresa pode acessar desacordo CT-e" ON public.desacordo_cte
  FOR ALL
  USING (
    cte_id IN (
      SELECT cte.id FROM public.cte
      WHERE cte.empresa_id IN (SELECT empresa_id FROM public.profiles WHERE id = auth.uid())
    )
  );
