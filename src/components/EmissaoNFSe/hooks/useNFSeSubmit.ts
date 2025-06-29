import { useEmitirRpsNfse } from '@/hooks/useRpsNfse';
import { useCreateLog } from '@/hooks/useLogsOperacoes';
import { toast } from '@/hooks/use-toast';

// Tipagem do resultado da NFSe
interface NfseResult {
  success: boolean;
  numero_rps: string;
  numero_nfse?: string;
  mensagem?: string;
}

interface ResultadoNFSe {
  rps: {
    aliquota_iss: number;
    codigo_servico: string;
    codigo_verificacao: string;
    created_at: string;
    data_emissao: string;
    data_processamento: string;
    discriminacao: string;
    id: string;
    iss_retido: boolean;
    // ... outros campos omitidos por brevidade
    xml_rps: string;
  };
  nfseResult: NfseResult;
}

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
      const valorServicos = itens.reduce((total, item) => total + item.valor_total, 0);
      const valorISS = itens.reduce((total, item) => total + (item.valor_total * item.aliquota_iss / 100), 0);

      const nfseData = {
        prestador_id: formData.prestador_id,
        tomador_nome: formData.tomador_nome,
        tomador_cnpj_cpf: formData.tomador_cnpj_cpf,
        tomador_endereco: formData.tomador_endereco,
        tomador_email: formData.tomador_email,
        discriminacao: formData.discriminacao,
        valor_servicos: valorServicos,
        valor_iss: valorISS,
        valor_liquido: valorServicos - valorISS,
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

      const resultado: ResultadoNFSe = await emitirRps.mutateAsync(nfseData);

      const { success, numero_rps, numero_nfse, mensagem } = resultado.nfseResult;

      if (success) {
        toast({
          title: "NFSe Emitida com Sucesso!",
          description: `RPS ${numero_rps} processado. ${numero_nfse ? `NFSe: ${numero_nfse}` : 'Aguardando processamento.'}`,
        });
        return true;
      }

      throw new Error(mensagem || 'Erro desconhecido na emissão');
    } catch (error) {
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
