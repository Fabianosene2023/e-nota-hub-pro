
-- Adiciona um campo de descrição para o item e torna o produto_id opcional
ALTER TABLE public.itens_cte ADD COLUMN descricao TEXT;
ALTER TABLE public.itens_cte ALTER COLUMN produto_id DROP NOT NULL;

-- Para garantir consistência, vamos garantir que ou a descrição ou o produto_id existam
ALTER TABLE public.itens_cte
ADD CONSTRAINT chk_produto_ou_descricao
CHECK (produto_id IS NOT NULL OR descricao IS NOT NULL);
