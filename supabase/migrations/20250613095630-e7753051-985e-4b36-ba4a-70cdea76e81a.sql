
-- Criar tabela de empresas
CREATE TABLE public.empresas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  razao_social TEXT NOT NULL,
  nome_fantasia TEXT,
  cnpj TEXT NOT NULL UNIQUE,
  inscricao_estadual TEXT,
  inscricao_municipal TEXT,
  endereco TEXT NOT NULL,
  cidade TEXT NOT NULL,
  estado TEXT NOT NULL,
  cep TEXT NOT NULL,
  telefone TEXT,
  email TEXT,
  certificado_digital TEXT,
  senha_certificado TEXT,
  ambiente_sefaz TEXT DEFAULT 'homologacao' CHECK (ambiente_sefaz IN ('homologacao', 'producao')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de clientes
CREATE TABLE public.clientes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID REFERENCES public.empresas(id) NOT NULL,
  tipo_pessoa TEXT NOT NULL CHECK (tipo_pessoa IN ('fisica', 'juridica')),
  nome_razao_social TEXT NOT NULL,
  cpf_cnpj TEXT NOT NULL,
  inscricao_estadual TEXT,
  endereco TEXT NOT NULL,
  cidade TEXT NOT NULL,
  estado TEXT NOT NULL,
  cep TEXT NOT NULL,
  telefone TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de produtos/serviços
CREATE TABLE public.produtos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID REFERENCES public.empresas(id) NOT NULL,
  codigo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  unidade TEXT NOT NULL DEFAULT 'UN',
  preco_unitario DECIMAL(10,2) NOT NULL,
  ncm TEXT,
  cfop TEXT NOT NULL DEFAULT '5102',
  icms_aliquota DECIMAL(5,2) DEFAULT 0,
  ipi_aliquota DECIMAL(5,2) DEFAULT 0,
  pis_aliquota DECIMAL(5,2) DEFAULT 0,
  cofins_aliquota DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de notas fiscais
CREATE TABLE public.notas_fiscais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID REFERENCES public.empresas(id) NOT NULL,
  cliente_id UUID REFERENCES public.clientes(id) NOT NULL,
  numero INTEGER NOT NULL,
  serie INTEGER NOT NULL DEFAULT 1,
  chave_acesso TEXT,
  protocolo_autorizacao TEXT,
  status TEXT NOT NULL DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'enviada', 'autorizada', 'cancelada', 'rejeitada')),
  data_emissao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  valor_total DECIMAL(10,2) NOT NULL DEFAULT 0,
  valor_icms DECIMAL(10,2) DEFAULT 0,
  valor_ipi DECIMAL(10,2) DEFAULT 0,
  valor_pis DECIMAL(10,2) DEFAULT 0,
  valor_cofins DECIMAL(10,2) DEFAULT 0,
  observacoes TEXT,
  xml_nfe TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de itens das notas fiscais
CREATE TABLE public.itens_nota_fiscal (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nota_fiscal_id UUID REFERENCES public.notas_fiscais(id) ON DELETE CASCADE NOT NULL,
  produto_id UUID REFERENCES public.produtos(id) NOT NULL,
  quantidade DECIMAL(10,3) NOT NULL,
  valor_unitario DECIMAL(10,2) NOT NULL,
  valor_total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inserir dados de exemplo para empresas
INSERT INTO public.empresas (razao_social, nome_fantasia, cnpj, inscricao_estadual, endereco, cidade, estado, cep, telefone, email) VALUES
('Tech Solutions Ltda', 'Tech Solutions', '12345678000190', '123456789', 'Rua das Flores, 123', 'São Paulo', 'SP', '01234-567', '(11) 99999-9999', 'contato@techsolutions.com.br'),
('Inovação Digital SA', 'Inovação Digital', '98765432000180', '987654321', 'Av. Paulista, 456', 'São Paulo', 'SP', '01310-100', '(11) 88888-8888', 'contato@inovacaodigital.com.br'),
('Consultoria Empresarial ME', 'Consultoria Pro', '11223344000170', '112233445', 'Rua do Comércio, 789', 'Rio de Janeiro', 'RJ', '20040-020', '(21) 77777-7777', 'info@consultoriapro.com.br');

-- Inserir dados de exemplo para clientes
INSERT INTO public.clientes (empresa_id, tipo_pessoa, nome_razao_social, cpf_cnpj, endereco, cidade, estado, cep, telefone, email)
SELECT 
  e.id,
  'juridica',
  'Cliente Exemplo Ltda',
  '55667788000160',
  'Rua dos Clientes, 100',
  'São Paulo',
  'SP',
  '04567-890',
  '(11) 66666-6666',
  'cliente@exemplo.com.br'
FROM public.empresas e
LIMIT 1;

-- Inserir dados de exemplo para produtos
INSERT INTO public.produtos (empresa_id, codigo, descricao, preco_unitario, ncm, cfop)
SELECT 
  e.id,
  'PROD001',
  'Consultoria em Tecnologia da Informação',
  150.00,
  '99999999',
  '5101'
FROM public.empresas e
LIMIT 1;

INSERT INTO public.produtos (empresa_id, codigo, descricao, preco_unitario, ncm, cfop)
SELECT 
  e.id,
  'SERV001',
  'Desenvolvimento de Software',
  200.00,
  '99999999',
  '5101'
FROM public.empresas e
LIMIT 1;

-- Inserir dados de exemplo para notas fiscais
INSERT INTO public.notas_fiscais (empresa_id, cliente_id, numero, valor_total, status)
SELECT 
  e.id,
  c.id,
  1001,
  1500.00,
  'autorizada'
FROM public.empresas e
CROSS JOIN public.clientes c
WHERE e.razao_social = 'Tech Solutions Ltda'
LIMIT 1;

-- Habilitar RLS nas tabelas
ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notas_fiscais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itens_nota_fiscal ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS (por enquanto permissivas para desenvolvimento)
CREATE POLICY "Permitir acesso a todas as empresas" ON public.empresas FOR ALL USING (true);
CREATE POLICY "Permitir acesso a todos os clientes" ON public.clientes FOR ALL USING (true);
CREATE POLICY "Permitir acesso a todos os produtos" ON public.produtos FOR ALL USING (true);
CREATE POLICY "Permitir acesso a todas as notas fiscais" ON public.notas_fiscais FOR ALL USING (true);
CREATE POLICY "Permitir acesso a todos os itens" ON public.itens_nota_fiscal FOR ALL USING (true);
