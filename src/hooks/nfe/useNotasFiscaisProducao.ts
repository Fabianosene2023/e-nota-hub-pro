
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { useRecuperarCertificadoVault } from '../useCertificadosVault';
import { NFEProductionService } from '@/utils/nfe/production/nfeProductionService';

export const useCreateNotaFiscalProducao = () => {
  const queryClient = useQueryClient();
  const recuperarCertificado = useRecuperarCertificadoVault();
  
  return useMutation({
    mutationFn: async (notaData: any) => {
      console.log('Criando NFe com integração SEFAZ REAL:', notaData);
      
      return await NFEProductionService.createNotaFiscal(
        notaData, 
        recuperarCertificado.mutateAsync
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notas-fiscais'] });
    },
    onError: (error) => {
      console.error('Erro ao criar nota fiscal de produção:', error);
      toast({
        title: "Erro na Emissão",
        description: error instanceof Error ? error.message : "Erro ao emitir nota fiscal",
        variant: "destructive",
      });
    },
  });
};

export const useCancelarNotaFiscalProducao = () => {
  const queryClient = useQueryClient();
  const recuperarCertificado = useRecuperarCertificadoVault();
  
  return useMutation({
    mutationFn: async (cancelData: {
      nota_fiscal_id: string;
      chave_acesso: string;
      empresa_id: string;
      justificativa: string;
    }) => {
      console.log('Cancelando nota fiscal - Produção:', cancelData);
      
      return await NFEProductionService.cancelNotaFiscal(
        cancelData,
        recuperarCertificado.mutateAsync
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notas-fiscais'] });
    },
    onError: (error) => {
      toast({
        title: "Erro no Cancelamento",
        description: error instanceof Error ? error.message : "Erro ao cancelar nota fiscal",
        variant: "destructive",
      });
    },
  });
};
