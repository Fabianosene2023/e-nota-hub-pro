
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ConfiguracaoSefaz {
  id: string;
  empresa_id: string;
  ambiente: 'homologacao' | 'producao';
  csc_id: string | null;
  csc_token: string | null;
  serie_nfe: number;
  serie_nfce: number;
  proximo_numero_nfe: number;
  proximo_numero_nfce: number;
  timeout_sefaz: number;
  tentativas_reenvio: number;
  created_at: string;
  updated_at: string;
}

export const useConfiguracoesSefaz = (empresaId: string) => {
  return useQuery({
    queryKey: ['configuracoes-sefaz', empresaId],
    queryFn: async () => {
      if (!empresaId) return null;
      
      const { data, error } = await supabase
        .from('configuracoes_sefaz')
        .select('*')
        .eq('empresa_id', empresaId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar configurações SEFAZ:', error);
        throw error;
      }
      
      // Se não existe configuração, retorna valores padrão
      if (!data) {
        return {
          empresa_id: empresaId,
          ambiente: 'homologacao' as const,
          csc_id: '',
          csc_token: '',
          serie_nfe: 1,
          serie_nfce: 1,
          proximo_numero_nfe: 1,
          proximo_numero_nfce: 1,
          timeout_sefaz: 30000,
          tentativas_reenvio: 3
        };
      }
      
      return data as ConfiguracaoSefaz;
    },
    enabled: !!empresaId,
  });
};

export const useUpdateConfiguracoesSefaz = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (configData: {
      empresa_id: string;
      ambiente: 'homologacao' | 'producao';
      csc_id?: string;
      csc_token?: string;
      serie_nfe: number;
      serie_nfce: number;
      timeout_sefaz: number;
      tentativas_reenvio: number;
    }) => {
      const { data, error } = await supabase
        .from('configuracoes_sefaz')
        .upsert([{
          ...configData,
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['configuracoes-sefaz', variables.empresa_id] });
      toast({
        title: "Sucesso!",
        description: "Configurações SEFAZ atualizadas com sucesso",
      });
    },
    onError: (error) => {
      console.error('Erro ao atualizar configurações SEFAZ:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar configurações SEFAZ",
        variant: "destructive",
      });
    },
  });
};

export const useTestarConexaoSefaz = () => {
  return useMutation({
    mutationFn: async (empresaId: string) => {
      const { data, error } = await supabase.functions.invoke('sefaz-integration', {
        body: {
          operation: 'testar_conexao',
          data: { empresa_id: empresaId }
        }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: data.success ? "Sucesso!" : "Erro",
        description: data.mensagem || 'Teste de conexão realizado',
        variant: data.success ? "default" : "destructive",
      });
    },
    onError: (error) => {
      console.error('Erro ao testar conexão SEFAZ:', error);
      toast({
        title: "Erro",
        description: "Erro ao testar conexão com SEFAZ",
        variant: "destructive",
      });
    },
  });
};
