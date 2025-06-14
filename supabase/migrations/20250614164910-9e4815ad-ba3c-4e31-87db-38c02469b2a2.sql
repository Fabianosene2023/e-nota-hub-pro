
-- Create certificados_vault table for secure certificate storage
CREATE TABLE public.certificados_vault (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  nome_certificado TEXT NOT NULL,
  vault_secret_id TEXT NOT NULL,
  tipo_certificado TEXT NOT NULL CHECK (tipo_certificado IN ('A1', 'A3')),
  validade_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
  validade_fim TIMESTAMP WITH TIME ZONE NOT NULL,
  cnpj_proprietario TEXT NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.certificados_vault ENABLE ROW LEVEL SECURITY;

-- Create policies for certificados_vault
CREATE POLICY "Users can view certificates for their companies" 
  ON public.certificados_vault 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up 
      WHERE up.user_id = auth.uid() 
      AND up.empresa_id = certificados_vault.empresa_id
    )
  );

CREATE POLICY "Users can insert certificates for their companies" 
  ON public.certificados_vault 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles up 
      WHERE up.user_id = auth.uid() 
      AND up.empresa_id = certificados_vault.empresa_id
    )
  );

CREATE POLICY "Users can update certificates for their companies" 
  ON public.certificados_vault 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up 
      WHERE up.user_id = auth.uid() 
      AND up.empresa_id = certificados_vault.empresa_id
    )
  );

CREATE POLICY "Users can delete certificates for their companies" 
  ON public.certificados_vault 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up 
      WHERE up.user_id = auth.uid() 
      AND up.empresa_id = certificados_vault.empresa_id
    )
  );

-- Create index for performance
CREATE INDEX idx_certificados_vault_empresa_id ON public.certificados_vault(empresa_id);
CREATE INDEX idx_certificados_vault_ativo ON public.certificados_vault(ativo);
