
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ConfiguracaoNfse {
  id: string;
  prestador_id: string;
  municipio_codigo: string;
  municipio_nome: string;
  padrao_nfse: string;
  url_webservice: string;
  ambiente: string;
  proximo_numero_rps: number;
  serie_rps: string;
  created_at: string;
  updated_at: string;
}

export const useConfiguracaoNfse = (prestadorId: string) => {
  return useQuery({
    queryKey: ['configuracao-nfse', prestadorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('configuracoes_nfse')
        .select('*')
        .eq('prestador_id', prestadorId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data as ConfiguracaoNfse | null;
    },
    enabled: !!prestadorId,
  });
};

export const useCreateOrUpdateConfiguracaoNfse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (configData: {
      prestador_id: string;
      municipio_codigo: string;
      municipio_nome: string;
      padrao_nfse: string;
      url_webservice: string;
      ambiente: string;
      serie_rps?: string;
    }) => {
      const { data, error } = await supabase
        .from('configuracoes_nfse')
        .upsert([{
          ...configData,
          serie_rps: configData.serie_rps || 'RPS',
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['configuracao-nfse', variables.prestador_id] });
      toast({
        title: "Sucesso!",
        description: "Configuração NFSe atualizada com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar configuração NFSe",
        variant: "destructive",
      });
    },
  });
};
