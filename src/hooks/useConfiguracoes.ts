
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useConfiguracoes = (empresaId: string) => {
  return useQuery({
    queryKey: ['configuracoes', empresaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('configuracoes')
        .select('*')
        .eq('empresa_id', empresaId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!empresaId,
  });
};

export const useUpdateConfiguracoes = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ empresaId, configuracoes }: { empresaId: string, configuracoes: any }) => {
      const { data, error } = await supabase
        .from('configuracoes')
        .upsert([{ empresa_id: empresaId, ...configuracoes }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['configuracoes', variables.empresaId] });
      toast({
        title: "Sucesso!",
        description: "Configurações atualizadas com sucesso",
      });
    },
    onError: (error) => {
      console.error('Erro ao atualizar configurações:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar configurações",
        variant: "destructive",
      });
    },
  });
};
