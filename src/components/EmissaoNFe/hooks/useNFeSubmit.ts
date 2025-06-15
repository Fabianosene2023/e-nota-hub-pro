
import { useCreateNotaFiscalMutation } from '@/hooks/nfe/useNotasFiscaisMutations';
import { useCreateLog } from '@/hooks/useLogsOperacoes';
import { toast } from '@/hooks/use-toast';

interface ItemNFe {
  produto_id?: string;
  servico_id?: string;
  item_nome: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  cfop: string;
  tipo: 'produto' | 'servico';
}

interface FormData {
  empresa_id: string;
  cliente_id: string;
  numero: string;
  serie: number;
  natureza_operacao: string;
  observacoes: string;
  email_cliente: string;
  telefone_cliente: string;
  cnpj_cpf_entrega: string;
  inscricao_estadual_cliente: string;
  endereco_faturamento: string;
  endereco_entrega: string;
  tipo_nota: 'entrada' | 'saida';
  data_emissao: string;
  data_entrega: string;
  data_cancelamento: string;
}

export const useNFeSubmit = () => {
  const createNotaFiscal = useCreateNotaFiscalMutation();
  const createLog = useCreateLog();

  const submitNFe = async (formData: FormData, itens: ItemNFe[], valorTotalNota: number) => {
    try {
      // Preparar dados para emissão
      const dadosNFe = {
        empresa_id: formData.empresa_id,
        cliente_id: formData.cliente_id,
        numero: parseInt(formData.numero),
        serie: formData.serie,
        valor_total: valorTotalNota,
        natureza_operacao: formData.natureza_operacao,
        observacoes: formData.observacoes,
        email_cliente: formData.email_cliente,
        telefone_cliente: formData.telefone_cliente,
        cnpj_cpf_entrega: formData.cnpj_cpf_entrega,
        inscricao_estadual_cliente: formData.inscricao_estadual_cliente,
        endereco_faturamento: formData.endereco_faturamento,
        endereco_entrega: formData.endereco_entrega,
        tipo_nota: formData.tipo_nota,
        data_emissao: formData.data_emissao,
        data_entrega: formData.data_entrega,
        data_cancelamento: formData.data_cancelamento,
        itens: itens.map(item => ({
          ...(item.produto_id ? { produto_id: item.produto_id } : {}),
          ...(item.servico_id ? { servico_id: item.servico_id } : {}),
          quantidade: item.quantidade,
          valor_unitario: item.valor_unitario,
          valor_total: item.valor_total,
          cfop: item.cfop
        }))
      };

      console.log('Emitindo NFe com dados:', dadosNFe);

      const resultado = await createNotaFiscal.mutateAsync(dadosNFe);
      
      if (resultado?.data) {
        // Registrar log da operação
        await createLog.mutateAsync({
          empresa_id: formData.empresa_id,
          tipo_operacao: 'nfe_emissao',
          descricao: `NFe ${formData.numero} emitida com sucesso`,
          dados_operacao: { 
            numero: formData.numero,
            valor_total: valorTotalNota,
            cliente_id: formData.cliente_id,
            tipo_nota: formData.tipo_nota
          }
        });

        toast({
          title: "Sucesso!",
          description: "NFe emitida com sucesso",
        });

        return true;
      }
    } catch (error) {
      console.error('Erro ao emitir NFe:', error);
      
      // Log do erro
      await createLog.mutateAsync({
        empresa_id: formData.empresa_id || 'unknown',
        tipo_operacao: 'nfe_emissao_erro',
        descricao: `Erro ao emitir NFe ${formData.numero}`,
        dados_operacao: { 
          erro: error instanceof Error ? error.message : 'Erro desconhecido',
          numero: formData.numero,
          tipo_nota: formData.tipo_nota
        }
      });

      throw error;
    }
  };

  return { 
    submitNFe, 
    isSubmitting: createNotaFiscal.isPending 
  };
};
