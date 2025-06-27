
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
  valor_unitario: number;
  valor_total: number;
  codigo_servico: string;
  aliquota_iss: number;
}

export const useFormValidation = () => {
  const validateForm = (formData: FormData, itens: ItemNFSe[]): string | null => {
    if (!formData.empresa_id) {
      return "Selecione uma empresa";
    }

    if (!formData.cliente_id) {
      return "Selecione um cliente";
    }

    if (!formData.natureza_operacao) {
      return "Informe a natureza da operação";
    }

    if (itens.length === 0) {
      return "Adicione pelo menos um serviço";
    }

    // Validar itens
    for (const item of itens) {
      if (item.quantidade <= 0) {
        return `Quantidade do serviço "${item.item_nome}" deve ser maior que zero`;
      }
      
      if (item.valor_unitario <= 0) {
        return `Valor unitário do serviço "${item.item_nome}" deve ser maior que zero`;
      }

      if (!item.codigo_servico) {
        return `Código do serviço "${item.item_nome}" é obrigatório`;
      }
    }

    return null;
  };

  return { validateForm };
};
