
-- Política RLS para clientes
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Somente usuários da empresa podem gerenciar clientes"
  ON public.clientes
  FOR ALL
  USING (
    empresa_id IN (
      SELECT empresa_id FROM public.profiles WHERE id = auth.uid()
    )
  );

-- Política RLS para fornecedores
ALTER TABLE public.fornecedores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Somente usuários da empresa podem gerenciar fornecedores"
  ON public.fornecedores
  FOR ALL
  USING (
    empresa_id IN (
      SELECT empresa_id FROM public.profiles WHERE id = auth.uid()
    )
  );

-- Política RLS para produtos
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Somente usuários da empresa podem gerenciar produtos"
  ON public.produtos
  FOR ALL
  USING (
    empresa_id IN (
      SELECT empresa_id FROM public.profiles WHERE id = auth.uid()
    )
  );
