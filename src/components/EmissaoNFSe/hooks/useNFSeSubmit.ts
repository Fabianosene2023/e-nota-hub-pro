import { useEmitirRpsNfse } from '@/hooks/useRpsNfse';
import { useCreateLog } from '@/hooks/useLogsOperacoes';
import { toast } from '@/hooks/use-toast';
import type { NFSeSubmitResponse } from '@/utils/nfe/types';

interface ItemNFSe {
  servico_id?: string;
  descricao: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  codigo_servico?: string;
  aliquota_iss: number;
}

interface FormData {
  prestador_id: string;
  tomador_nome: string;
  tomador_cnpj_cpf: string;
  tomador_endereco: string;
  tomador_email: string;
  discriminacao: string;
}

export const useNFSeSubmit = () => {
  const emitirRps = useEmitirRpsNfse();
  const createLog = useCreateLog();

  const submitNFSe = async (formData: FormData, itens: ItemNFSe[]) => {
    try {
      console.log('Emitindo NFSe com dados:', { formData, itens });

      // Calcular totais
      const valorTotalServicos = itens.reduce((total, item) => total + item.valor_total, 0);
      const valorTotalISS = itens.reduce((total, item) => total + (item.valor_total * item.aliquota_iss / 100), 0);

      // Preparar dados para emissão
      const nfseData = {
        prestador_id: formData.prestador_id,
        tomador_nome: formData.tomador_nome,
        tomador_cnpj_cpf: formData.tomador_cnpj_cpf,
        tomador_endereco: formData.tomador_endereco,
        tomador_email: formData.tomador_email,
        discriminacao: formData.discriminacao,
        valor_servicos: valorTotalServicos,
        valor_iss: valorTotalISS,
        valor_liquido: valorTotalServicos - valorTotalISS,
        itens: itens.map(item => ({
          servico_id: item.servico_id,
          descricao: item.descricao,
          quantidade: item.quantidade,
          valor_unitario: item.valor_unitario,
          valor_total: item.valor_total,
          codigo_servico: item.codigo_servico,
          aliquota_iss: item.aliquota_iss,
        })),
      };

      const resultado: NFSeSubmitResponse = await emitirRps.mutateAsync(nfseData);

      if (resultado?.nfseResult?.success) {
        // Log de sucesso
        await createLog.mutateAsync({
          empresa_id: 'system', // TODO: Pegar do contexto
          tipo_operacao: 'nfse_emissao',
          descricao: `NFSe emitida com sucesso - RPS ${resultado.nfseResult.numero_rps}`,
          dados_operacao: {
            numero_rps: resultado.nfseResult.numero_rps,
            valor_total: valorTotalServicos,
            tomador: formData.tomador_nome,
            prestador_id: formData.prestador_id,
          },
        });

        toast({
          title: "NFSe Emitida com Sucesso!",
          description: `RPS ${resultado.nfseResult.numero_rps} processado. ${resultado.nfseResult.numero_nfse ? `NFSe: ${resultado.nfseResult.numero_nfse}` : 'Aguardando processamento.'}`,
        });

        return true;
      }

      throw new Error(resultado?.nfseResult?.mensagem || 'Erro desconhecido na emissão');
    } catch (error) {
      console.error('Erro ao emitir NFSe:', error);

      // Log de erro
      await createLog.mutateAsync({
        empresa_id: 'system', // TODO: Pegar do contexto
        tipo_operacao: 'nfse_emissao_erro',
        descricao: `Erro ao emitir NFSe`,
        dados_operacao: {
          erro: error instanceof Error ? error.message : 'Erro desconhecido',
          tomador: formData.tomador_nome,
          prestador_id: formData.prestador_id,
        },
      });

      toast({
        title: "Erro na Emissão da NFSe",
        description: error instanceof Error ? error.message : "Erro desconhecido ao emitir NFSe",
        variant: "destructive",
      });

      return false;
    }
  };

  return {
    submitNFSe,
    isSubmitting: emitirRps.isPending,
  };
};
