
-- Add foreign key constraint between prestadores_servico and empresas tables
ALTER TABLE prestadores_servico 
ADD CONSTRAINT prestadores_servico_empresa_id_fkey 
FOREIGN KEY (empresa_id) REFERENCES empresas(id);
