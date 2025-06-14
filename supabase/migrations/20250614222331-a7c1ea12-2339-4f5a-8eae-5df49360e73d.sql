
-- Adicionar restrição UNIQUE composta na tabela clientes
ALTER TABLE public.clientes
  ADD CONSTRAINT clientes_empresa_id_cpf_cnpj_unique
  UNIQUE (empresa_id, cpf_cnpj);
