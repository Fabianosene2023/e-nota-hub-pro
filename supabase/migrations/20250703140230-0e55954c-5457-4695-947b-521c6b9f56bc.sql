
-- Add new fields to servicos table
ALTER TABLE public.servicos 
ADD COLUMN local_prestacao TEXT,
ADD COLUMN municipio_prestacao TEXT,
ADD COLUMN codigo_tributacao_nacional TEXT,
ADD COLUMN isencao_issqn BOOLEAN DEFAULT FALSE,
ADD COLUMN descricao_servico TEXT,
ADD COLUMN item_nbs TEXT,
ADD COLUMN numero_documento_responsabilidade_tecnica TEXT,
ADD COLUMN documento_referencia TEXT,
ADD COLUMN informacoes_complementares TEXT;

-- Add comments for clarity
COMMENT ON COLUMN public.servicos.local_prestacao IS 'Local onde o serviço será prestado';
COMMENT ON COLUMN public.servicos.municipio_prestacao IS 'Município onde o serviço será prestado';
COMMENT ON COLUMN public.servicos.codigo_tributacao_nacional IS 'Código de tributação nacional (NBS)';
COMMENT ON COLUMN public.servicos.isencao_issqn IS 'Indica se o serviço é caso de imunidade, exportação ou não incidência do ISSQN';
COMMENT ON COLUMN public.servicos.descricao_servico IS 'Descrição detalhada do serviço prestado';
COMMENT ON COLUMN public.servicos.item_nbs IS 'Item da NBS correspondente ao serviço prestado';
COMMENT ON COLUMN public.servicos.numero_documento_responsabilidade_tecnica IS 'Número do documento de responsabilidade técnica';
COMMENT ON COLUMN public.servicos.documento_referencia IS 'Documento de referência do serviço';
COMMENT ON COLUMN public.servicos.informacoes_complementares IS 'Informações complementares sobre o serviço';
