
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useHistoricoNotas = (notaFiscalId?: string) => {
  return useQuery({
    queryKey: ['historico-notas', notaFiscalId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('historico_notas')
        .select('*')
        .eq('nota_fiscal_id', notaFiscalId!)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!notaFiscalId,
  });
};

export const useCreateHistorico = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (historicoData: {
      nota_fiscal_id: string;
      status_anterior?: string;
      status_novo: string;
      observacao?: string;
      dados_retorno?: any;
    }) => {
      const { data, error } = await supabase
        .from('historico_notas')
        .insert([historicoData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['historico-notas', variables.nota_fiscal_id] });
    },
  });
};
