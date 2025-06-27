
import { useState } from 'react';
import { useEmitirNfseUberaba } from '@/hooks/useNfseUberaba';
import { toast } from '@/hooks/use-toast';

interface FormData {
  empresa_id: string;
  cliente_id: string;
  numero: string;
  serie: number;
  natureza_operacao: string;
  observacoes: string;
  tipo_pessoa: 'fisica' | 'juridica';
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

interface ItemNFSe {
  servico_id: string;
  item_nome: string;
  quantidade: number;
  valor_servico: number;
  valor_total: number;
  codigo_servico: string;
  aliquota_iss: number;
}

export const useNFSeSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const emitirNfse = useEmitirNfseUberaba();

  const submitNFSe = async (
    formData: FormData, 
    itens: ItemNFSe[], 
    valorTotal: number
  ): Promise<boolean> => {
    setIsSubmitting(true);
    
    try {
      // Para múltiplos serviços, criar uma descrição concatenada
      const descricaoServicos = itens.map(item => 
        `${item.item_nome} (Qtd: ${item.quantidade})`
      ).join('; ');

      const dadosEmissao = {
        empresa_id: formData.empresa_id,
        tomador_nome: '', // Será preenchido com dados do cliente
        tomador_cpf_cnpj: '',
        tomador_email: formData.email_cliente,
        tomador_endereco: formData.endereco_faturamento,
        descricao_servico: descricaoServicos,
        valor_servico: valorTotal,
        codigo_servico: itens[0]?.codigo_servico || '1.01',
        aliquota_iss: itens[0]?.aliquota_iss || 5,
      };

      await emitirNfse.mutateAsync(dadosEmissao);
      
      toast({
        title: "NFSe Emitida com Sucesso!",
        description: `Nota fiscal de serviços emitida no valor de R$ ${valorTotal.toFixed(2)}`,
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao emitir NFSe:', error);
      toast({
        title: "Erro na Emissão",
        description: error instanceof Error ? error.message : "Erro ao emitir NFSe",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitNFSe,
    isSubmitting: isSubmitting || emitirNfse.isPending
  };
};
