
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface CreateNaturezaOperacaoData {
  empresa_id: string;
  codigo: string;
  descricao: string;
  cfop_dentro_estado: string;
  cfop_fora_estado: string;
  cfop_exterior: string;
  finalidade: string;
}

export const useCreateNaturezaOperacao = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateNaturezaOperacaoData) => {
      // Como não temos tabela específica, vamos simular criando uma entrada nos logs
      const { error: logError } = await supabase
        .from('logs_operacoes')
        .insert([{
          empresa_id: data.empresa_id,
          tipo_operacao: 'natureza_operacao_criada',
          descricao: `Natureza de operação criada: ${data.descricao}`,
          dados_operacao: {
            codigo: data.codigo,
            descricao: data.descricao,
            cfop_dentro_estado: data.cfop_dentro_estado,
            cfop_fora_estado: data.cfop_fora_estado,
            cfop_exterior: data.cfop_exterior,
            finalidade: data.finalidade
          }
        }]);

      if (logError) throw logError;

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['natureza-operacao', variables.empresa_id] });
      queryClient.invalidateQueries({ queryKey: ['natureza-operacao-stats', variables.empresa_id] });
      toast({
        title: "Sucesso!",
        description: "Natureza de operação criada com sucesso",
      });
    },
    onError: (error) => {
      console.error('Erro ao criar natureza de operação:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar natureza de operação",
        variant: "destructive",
      });
    },
  });
};
