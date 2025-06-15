
-- Tornar o campo empresa_id opcional na tabela user_profiles
ALTER TABLE public.user_profiles ALTER COLUMN empresa_id DROP NOT NULL;

-- Adicionar um comentário explicativo
COMMENT ON COLUMN public.user_profiles.empresa_id IS 'ID da empresa (opcional - null para usuários sem vínculo específico)';
