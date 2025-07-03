
-- Add municipality fields to empresas table
ALTER TABLE public.empresas 
ADD COLUMN municipio_codigo TEXT,
ADD COLUMN municipio_nome TEXT;

-- Add some comments for clarity
COMMENT ON COLUMN public.empresas.municipio_codigo IS 'Código IBGE do município';
COMMENT ON COLUMN public.empresas.municipio_nome IS 'Nome do município';
