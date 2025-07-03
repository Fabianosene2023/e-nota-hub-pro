
-- Add new fields for NFSe tax values to servicos table
ALTER TABLE public.servicos 
ADD COLUMN valor_servico_prestado NUMERIC DEFAULT 0,
ADD COLUMN opcao_tributos INTEGER DEFAULT 3,
ADD COLUMN valor_tributos_federais NUMERIC DEFAULT 0,
ADD COLUMN valor_tributos_estaduais NUMERIC DEFAULT 0,
ADD COLUMN valor_tributos_municipais NUMERIC DEFAULT 0,
ADD COLUMN percentual_tributos_federais NUMERIC DEFAULT 0,
ADD COLUMN percentual_tributos_estaduais NUMERIC DEFAULT 0,
ADD COLUMN percentual_tributos_municipais NUMERIC DEFAULT 0;

-- Add comments for clarity
COMMENT ON COLUMN public.servicos.valor_servico_prestado IS 'Valor do serviço prestado';
COMMENT ON COLUMN public.servicos.opcao_tributos IS '1-Preencher valores monetários, 2-Configurar percentuais, 3-Não informar';
COMMENT ON COLUMN public.servicos.valor_tributos_federais IS 'Valor dos tributos federais (opção 1)';
COMMENT ON COLUMN public.servicos.valor_tributos_estaduais IS 'Valor dos tributos estaduais (opção 1)';
COMMENT ON COLUMN public.servicos.valor_tributos_municipais IS 'Valor dos tributos municipais (opção 1)';
COMMENT ON COLUMN public.servicos.percentual_tributos_federais IS 'Percentual dos tributos federais (opção 2)';
COMMENT ON COLUMN public.servicos.percentual_tributos_estaduais IS 'Percentual dos tributos estaduais (opção 2)';
COMMENT ON COLUMN public.servicos.percentual_tributos_municipais IS 'Percentual dos tributos municipais (opção 2)';

-- Also add the same fields to rps_nfse table for NFSe emission
ALTER TABLE public.rps_nfse 
ADD COLUMN valor_servico_prestado NUMERIC DEFAULT 0,
ADD COLUMN opcao_tributos INTEGER DEFAULT 3,
ADD COLUMN valor_tributos_federais NUMERIC DEFAULT 0,
ADD COLUMN valor_tributos_estaduais NUMERIC DEFAULT 0,
ADD COLUMN valor_tributos_municipais NUMERIC DEFAULT 0,
ADD COLUMN percentual_tributos_federais NUMERIC DEFAULT 0,
ADD COLUMN percentual_tributos_estaduais NUMERIC DEFAULT 0,
ADD COLUMN percentual_tributos_municipais NUMERIC DEFAULT 0;
