
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useLogsOperacoes = (empresaId: string) => {
  return useQuery({
    queryKey: ['logs-operacoes', empresaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('logs_operacoes')
        .select('*')
        .eq('empresa_id', empresaId)
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data;
    },
    enabled: !!empresaId,
  });
};

export const useCreateLog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (logData: {
      empresa_id: string;
      tipo_operacao: string;
      descricao: string;
      dados_operacao?: any;
      usuario_id?: string;
    }) => {
      const { data, error } = await supabase
        .from('logs_operacoes')
        .insert([{
          ...logData,
          ip_origem: window.location.hostname
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['logs-operacoes', variables.empresa_id] });
    },
  });
};
