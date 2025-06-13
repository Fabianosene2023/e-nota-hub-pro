
-- Primeiro, vamos criar a tabela contatos sem migrar os dados ainda
CREATE TABLE IF NOT EXISTS public.contatos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID REFERENCES public.empresas(id) NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('cliente', 'fornecedor', 'transportadora')),
  nome_razao_social TEXT NOT NULL,
  cpf_cnpj TEXT NOT NULL,
  inscricao_estadual TEXT,
  endereco TEXT NOT NULL,
  cidade TEXT NOT NULL,
  estado TEXT NOT NULL,
  cep TEXT NOT NULL,
  telefone TEXT,
  email TEXT,
  placa_veiculo TEXT, -- para transportadoras
  rntrc TEXT, -- para transportadoras
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar campos faltantes na tabela empresas
ALTER TABLE public.empresas ADD COLUMN IF NOT EXISTS regime_tributario TEXT DEFAULT 'simples_nacional';
ALTER TABLE public.empresas ADD COLUMN IF NOT EXISTS certificado_digital_url TEXT;

-- Atualizar tabela produtos com campos adicionais
ALTER TABLE public.produtos ADD COLUMN IF NOT EXISTS nome TEXT;
ALTER TABLE public.produtos ADD COLUMN IF NOT EXISTS codigo_interno TEXT;
ALTER TABLE public.produtos ADD COLUMN IF NOT EXISTS ean TEXT;
ALTER TABLE public.produtos ADD COLUMN IF NOT EXISTS cst_icms TEXT;
ALTER TABLE public.produtos ADD COLUMN IF NOT EXISTS csosn TEXT;
ALTER TABLE public.produtos ADD COLUMN IF NOT EXISTS estoque_atual INTEGER DEFAULT 0;
ALTER TABLE public.produtos ADD COLUMN IF NOT EXISTS estoque_minimo INTEGER DEFAULT 0;

-- Migrar dados da tabela clientes para contatos (preservando os IDs)
INSERT INTO public.contatos (id, empresa_id, tipo, nome_razao_social, cpf_cnpj, inscricao_estadual, endereco, cidade, estado, cep, telefone, email, created_at, updated_at)
SELECT id, empresa_id, 'cliente', nome_razao_social, cpf_cnpj, inscricao_estadual, endereco, cidade, estado, cep, telefone, email, created_at, updated_at
FROM public.clientes
ON CONFLICT (id) DO NOTHING;

-- Inserir dados de exemplo para fornecedores e transportadoras
INSERT INTO public.contatos (empresa_id, tipo, nome_razao_social, cpf_cnpj, endereco, cidade, estado, cep, telefone, email)
SELECT 
  e.id,
  'fornecedor',
  'Fornecedor ABC Ltda',
  '12312312000123',
  'Rua dos Fornecedores, 200',
  'São Paulo',
  'SP',
  '01234-890',
  '(11) 55555-5555',
  'contato@fornecedorabc.com.br'
FROM public.empresas e
WHERE NOT EXISTS (SELECT 1 FROM public.contatos WHERE tipo = 'fornecedor')
LIMIT 1;

INSERT INTO public.contatos (empresa_id, tipo, nome_razao_social, cpf_cnpj, endereco, cidade, estado, cep, telefone, email, placa_veiculo, rntrc)
SELECT 
  e.id,
  'transportadora',
  'Transportadora XYZ SA',
  '45645645000145',
  'Av. das Transportadoras, 500',
  'Rio de Janeiro',
  'RJ',
  '20000-100',
  '(21) 44444-4444',
  'contato@transportadoraxyz.com.br',
  'ABC-1234',
  '123456789'
FROM public.empresas e
WHERE NOT EXISTS (SELECT 1 FROM public.contatos WHERE tipo = 'transportadora')
LIMIT 1;

-- Atualizar tabela notas_fiscais com campos adicionais
ALTER TABLE public.notas_fiscais ADD COLUMN IF NOT EXISTS transportadora_id UUID REFERENCES public.contatos(id);
ALTER TABLE public.notas_fiscais ADD COLUMN IF NOT EXISTS natureza_operacao TEXT DEFAULT 'Venda de mercadoria adquirida ou produzida pelo estabelecimento';
ALTER TABLE public.notas_fiscais ADD COLUMN IF NOT EXISTS modalidade_frete TEXT DEFAULT 'sem_frete';
ALTER TABLE public.notas_fiscais ADD COLUMN IF NOT EXISTS xml_url TEXT;
ALTER TABLE public.notas_fiscais ADD COLUMN IF NOT EXISTS danfe_pdf_url TEXT;

-- Adicionar campos nos itens da nota fiscal
ALTER TABLE public.itens_nota_fiscal ADD COLUMN IF NOT EXISTS cfop TEXT DEFAULT '5102';

-- Criar tabela de configurações
CREATE TABLE IF NOT EXISTS public.configuracoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID REFERENCES public.empresas(id) NOT NULL UNIQUE,
  email_padrao_envio TEXT,
  proxima_num_nf INTEGER DEFAULT 1,
  csc_token TEXT,
  layout_danfe TEXT DEFAULT 'retrato',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inserir configurações padrão para as empresas
INSERT INTO public.configuracoes (empresa_id, email_padrao_envio, proxima_num_nf)
SELECT id, email, 1002
FROM public.empresas
WHERE id NOT IN (SELECT empresa_id FROM public.configuracoes);

-- Atualizar produtos com dados mais completos
UPDATE public.produtos 
SET nome = COALESCE(nome, descricao),
    codigo_interno = COALESCE(codigo_interno, codigo),
    cst_icms = COALESCE(cst_icms, '060'),
    estoque_atual = COALESCE(estoque_atual, 100),
    estoque_minimo = COALESCE(estoque_minimo, 10);

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.contatos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuracoes ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para as novas tabelas
CREATE POLICY "Permitir acesso a todos os contatos" ON public.contatos FOR ALL USING (true);
CREATE POLICY "Permitir acesso a todas as configurações" ON public.configuracoes FOR ALL USING (true);
