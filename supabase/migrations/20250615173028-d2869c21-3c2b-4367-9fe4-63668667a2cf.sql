
-- Habilitar RLS na tabela unidades_medida
ALTER TABLE public.unidades_medida ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir SELECT para todos os usuários autenticados
CREATE POLICY "Allow select for authenticated users" 
ON public.unidades_medida 
FOR SELECT 
TO authenticated 
USING (true);

-- Criar política para permitir INSERT para todos os usuários autenticados
CREATE POLICY "Allow insert for authenticated users" 
ON public.unidades_medida 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Criar política para permitir UPDATE para todos os usuários autenticados
CREATE POLICY "Allow update for authenticated users" 
ON public.unidades_medida 
FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Criar política para permitir DELETE para todos os usuários autenticados
CREATE POLICY "Allow delete for authenticated users" 
ON public.unidades_medida 
FOR DELETE 
TO authenticated 
USING (true);
