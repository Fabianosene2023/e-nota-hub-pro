
-- Add new fiscal configuration columns to the configuracoes table
ALTER TABLE configuracoes 
ADD COLUMN regime_fiscal text DEFAULT 'simples_nacional',
ADD COLUMN regime_tributario text DEFAULT 'simples_nacional',
ADD COLUMN enviar_nfe_por_email boolean DEFAULT false;
