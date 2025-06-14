
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { NFEMutationService } from '@/utils/nfe/mutations/nfeMutationService';

export const useCreateNotaFiscalMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (notaData: any) => {
      console.log('Criando nota fiscal com integração SEFAZ:', notaData);
      return await NFEMutationService.createNotaFiscal(notaData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notas-fiscais'] });
    },
    onError: (error) => {
      console.error('Erro ao criar nota fiscal:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao criar nota fiscal",
        variant: "destructive",
      });
    },
  });
};

export const useCancelarNotaFiscalMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (cancelData: {
      nota_fiscal_id: string;
      chave_acesso: string;
      empresa_id: string;
      justificativa: string;
    }) => {
      console.log('Cancelando nota fiscal:', cancelData);
      return await NFEMutationService.cancelNotaFiscal(cancelData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notas-fiscais'] });
      toast({
        title: "Sucesso!",
        description: "Nota fiscal cancelada com sucesso",
      });
    },
    onError: (error) => {
      console.error('Erro ao cancelar nota fiscal:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao cancelar nota fiscal",
        variant: "destructive",
      });
    },
  });
};

export const useConsultarNotaFiscalMutation = () => {
  return useMutation({
    mutationFn: async (consultaData: {
      chave_acesso: string;
      empresa_id: string;
    }) => {
      console.log('Consultando nota fiscal:', consultaData);
      return await NFEMutationService.consultarNotaFiscal(consultaData);
    },
    onSuccess: (data) => {
      toast({
        title: data.success ? "Consulta realizada" : "Erro na consulta",
        description: data.mensagem_retorno || 'Consulta de NFe realizada',
        variant: data.success ? "default" : "destructive",
      });
    },
    onError: (error) => {
      console.error('Erro ao consultar nota fiscal:', error);
      toast({
        title: "Erro",
        description: "Erro ao consultar nota fiscal",
        variant: "destructive",
      });
    },
  });
};
