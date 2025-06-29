
-- Add missing freight-related columns to notas_fiscais table
ALTER TABLE notas_fiscais 
ADD COLUMN IF NOT EXISTS freight_mode text,
ADD COLUMN IF NOT EXISTS freight_value numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS insurance_value numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS volume_quantity integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS weight_gross numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS weight_net numeric DEFAULT 0;

-- Add transporter reference if not exists
ALTER TABLE notas_fiscais 
ADD COLUMN IF NOT EXISTS transporter_id uuid REFERENCES transportadoras(id);

-- Update existing modalidade_frete column to use freight_mode for consistency
UPDATE notas_fiscais SET freight_mode = modalidade_frete WHERE modalidade_frete IS NOT NULL;
