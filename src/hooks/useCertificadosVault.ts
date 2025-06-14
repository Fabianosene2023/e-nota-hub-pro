
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface CertificadoVault {
  id: string;
  empresa_id: string;
  nome_certificado: string;
  vault_secret_id: string;
  tipo_certificado: 'A1' | 'A3';
  validade_inicio: string;
  validade_fim: string;
  cnpj_proprietario: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export const useCertificadosVault = (empresaId: string) => {
  return useQuery({
    queryKey: ['certificados-vault', empresaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('certificados_vault')
        .select('*')
        .eq('empresa_id', empresaId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as CertificadoVault[];
    },
    enabled: !!empresaId,
  });
};

export const useArmazenarCertificadoVault = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (certificadoData: {
      empresa_id: string;
      nome_certificado: string;
      arquivo: File;
      senha: string;
      validade_inicio: string;
      validade_fim: string;
      tipo_certificado: 'A1' | 'A3';
    }) => {
      try {
        // Validar arquivo
        if (!certificadoData.arquivo.name.match(/\.(p12|pfx)$/i)) {
          throw new Error('Arquivo deve ser .p12 ou .pfx');
        }

        // Ler arquivo como base64
        const arrayBuffer = await certificadoData.arquivo.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64Content = btoa(binary);

        // Chamar Edge Function para armazenar no Vault
        const { data: vaultResult, error: vaultError } = await supabase.functions.invoke('certificado-vault', {
          body: {
            operation: 'store',
            data: {
              empresa_id: certificadoData.empresa_id,
              nome_certificado: certificadoData.nome_certificado,
              certificado_content: base64Content,
              senha: certificadoData.senha,
              validade_inicio: certificadoData.validade_inicio,
              validade_fim: certificadoData.validade_fim,
              tipo_certificado: certificadoData.tipo_certificado
            }
          }
        });

        if (vaultError) throw vaultError;

        if (!vaultResult.success) {
          throw new Error(vaultResult.error || 'Erro ao armazenar certificado no Vault');
        }

        // Desativar certificados anteriores
        await supabase
          .from('certificados_vault')
          .update({ ativo: false, updated_at: new Date().toISOString() })
          .eq('empresa_id', certificadoData.empresa_id)
          .eq('ativo', true);

        // Salvar referência no banco
        const { data, error } = await supabase
          .from('certificados_vault')
          .insert([{
            empresa_id: certificadoData.empresa_id,
            nome_certificado: certificadoData.nome_certificado,
            vault_secret_id: vaultResult.vault_secret_id,
            tipo_certificado: certificadoData.tipo_certificado,
            validade_inicio: certificadoData.validade_inicio,
            validade_fim: certificadoData.validade_fim,
            cnpj_proprietario: vaultResult.cnpj_proprietario || '',
            ativo: true
          }])
          .select()
          .single();

        if (error) throw error;
        return data;

      } catch (error) {
        console.error('Erro ao armazenar certificado no Vault:', error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['certificados-vault', variables.empresa_id] });
      toast({
        title: "Sucesso!",
        description: "Certificado armazenado com segurança no Supabase Vault",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro no Vault",
        description: error instanceof Error ? error.message : "Erro ao armazenar certificado",
        variant: "destructive",
      });
    },
  });
};

export const useRecuperarCertificadoVault = () => {
  return useMutation({
    mutationFn: async (certificadoId: string): Promise<{
      p12Buffer: Buffer;
      senha: string;
      dados: any;
    }> => {
      try {
        const { data: vaultResult, error: vaultError } = await supabase.functions.invoke('certificado-vault', {
          body: {
            operation: 'retrieve',
            certificado_id: certificadoId
          }
        });

        if (vaultError) throw vaultError;

        if (!vaultResult.success) {
          throw new Error(vaultResult.error || 'Erro ao recuperar certificado do Vault');
        }

        // Converter base64 de volta para Buffer
        const p12Buffer = Buffer.from(vaultResult.certificado_content, 'base64');

        return {
          p12Buffer,
          senha: vaultResult.senha,
          dados: vaultResult.dados_certificado
        };

      } catch (error) {
        console.error('Erro ao recuperar certificado do Vault:', error);
        throw error;
      }
    },
    onError: (error) => {
      toast({
        title: "Erro no Vault",
        description: "Erro ao recuperar certificado do Vault",
        variant: "destructive",
      });
    },
  });
};

export const useRemoverCertificadoVault = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (certificadoId: string) => {
      // Remover do Vault via Edge Function
      const { data: vaultResult, error: vaultError } = await supabase.functions.invoke('certificado-vault', {
        body: {
          operation: 'delete',
          certificado_id: certificadoId
        }
      });

      if (vaultError) throw vaultError;

      // Remover referência do banco
      const { error } = await supabase
        .from('certificados_vault')
        .delete()
        .eq('id', certificadoId);
      
      if (error) throw error;
      
      return certificadoId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificados-vault'] });
      toast({
        title: "Sucesso!",
        description: "Certificado removido com segurança do Vault",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao remover certificado do Vault",
        variant: "destructive",
      });
    },
  });
};
