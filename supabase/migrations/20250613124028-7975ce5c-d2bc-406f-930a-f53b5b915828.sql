
-- Criar tabelas para fornecedores
CREATE TABLE IF NOT EXISTS public.fornecedores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  nome_razao_social TEXT NOT NULL,
  nome_fantasia TEXT,
  cpf_cnpj TEXT NOT NULL,
  tipo_pessoa TEXT NOT NULL CHECK (tipo_pessoa IN ('fisica', 'juridica')),
  inscricao_estadual TEXT,
  inscricao_municipal TEXT,
  endereco TEXT NOT NULL,
  cidade TEXT NOT NULL,
  estado TEXT NOT NULL,
  cep TEXT NOT NULL,
  telefone TEXT,
  email TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabelas para transportadoras (se não existe na tabela contatos)
CREATE TABLE IF NOT EXISTS public.transportadoras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  nome_razao_social TEXT NOT NULL,
  nome_fantasia TEXT,
  cpf_cnpj TEXT NOT NULL,
  tipo_pessoa TEXT NOT NULL CHECK (tipo_pessoa IN ('fisica', 'juridica')),
  inscricao_estadual TEXT,
  endereco TEXT NOT NULL,
  cidade TEXT NOT NULL,
  estado TEXT NOT NULL,
  cep TEXT NOT NULL,
  telefone TEXT,
  email TEXT,
  rntrc TEXT, -- Registro Nacional de Transportadores Rodoviários de Cargas
  placa_veiculo TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela para categorias de produtos
CREATE TABLE IF NOT EXISTS public.categorias_produtos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  descricao TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela para marcas
CREATE TABLE IF NOT EXISTS public.marcas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  descricao TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela para unidades de medida
CREATE TABLE IF NOT EXISTS public.unidades_medida (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT NOT NULL UNIQUE, -- UN, KG, MT, etc
  descricao TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir unidades de medida padrão
INSERT INTO public.unidades_medida (codigo, descricao) VALUES
('UN', 'Unidade'),
('KG', 'Quilograma'),
('MT', 'Metro'),
('M2', 'Metro Quadrado'),
('M3', 'Metro Cúbico'),
('LT', 'Litro'),
('PC', 'Peça'),
('CX', 'Caixa'),
('DZ', 'Dúzia'),
('PAR', 'Par')
ON CONFLICT (codigo) DO NOTHING;

-- Adicionar colunas nos produtos para relacionamentos
ALTER TABLE public.produtos 
ADD COLUMN IF NOT EXISTS categoria_id UUID REFERENCES public.categorias_produtos(id),
ADD COLUMN IF NOT EXISTS marca_id UUID REFERENCES public.marcas(id),
ADD COLUMN IF NOT EXISTS fornecedor_id UUID REFERENCES public.fornecedores(id);

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.fornecedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transportadoras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias_produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marcas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unidades_medida ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para fornecedores
CREATE POLICY "Users can manage fornecedores of their company" ON public.fornecedores
  FOR ALL USING (
    empresa_id IN (
      SELECT empresa_id FROM public.profiles WHERE id = auth.uid()
    )
  );

-- Políticas RLS para transportadoras
CREATE POLICY "Users can manage transportadoras of their company" ON public.transportadoras
  FOR ALL USING (
    empresa_id IN (
      SELECT empresa_id FROM public.profiles WHERE id = auth.uid()
    )
  );

-- Políticas RLS para categorias
CREATE POLICY "Users can manage categorias of their company" ON public.categorias_produtos
  FOR ALL USING (
    empresa_id IN (
      SELECT empresa_id FROM public.profiles WHERE id = auth.uid()
    )
  );

-- Políticas RLS para marcas
CREATE POLICY "Users can manage marcas of their company" ON public.marcas
  FOR ALL USING (
    empresa_id IN (
      SELECT empresa_id FROM public.profiles WHERE id = auth.uid()
    )
  );

-- Políticas para unidades de medida (público para leitura)
CREATE POLICY "Everyone can view unidades medida" ON public.unidades_medida
  FOR SELECT USING (true);

-- Melhorar as políticas RLS existentes se necessário
DROP POLICY IF EXISTS "Users can manage clientes of their company" ON public.clientes;
CREATE POLICY "Users can manage clientes of their company" ON public.clientes
  FOR ALL USING (
    empresa_id IN (
      SELECT empresa_id FROM public.profiles WHERE id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can manage produtos of their company" ON public.produtos;
CREATE POLICY "Users can manage produtos of their company" ON public.produtos
  FOR ALL USING (
    empresa_id IN (
      SELECT empresa_id FROM public.profiles WHERE id = auth.uid()
    )
  );
