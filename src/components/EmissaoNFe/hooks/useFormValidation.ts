
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
  data_emissao: string;
  endereco_faturamento: string;
  endereco_entrega: string;
}

export const useFormValidation = () => {
  const validateForm = (formData: FormData, itens: ItemNFe[]): string | null => {
    if (!formData.empresa_id) return "Selecione uma empresa";
    if (!formData.cliente_id) return "Selecione um cliente";
    if (!formData.numero) return "Informe o número da nota";
    if (!formData.data_emissao) return "Informe a data de emissão";
    if (!formData.endereco_faturamento) return "Informe o endereço de faturamento";
    if (!formData.endereco_entrega) return "Informe o endereço de entrega";
    if (itens.length === 0) return "Adicione pelo menos um item";
    
    // Validar itens
    for (const item of itens) {
      if (item.quantidade <= 0) return "Quantidade deve ser maior que zero";
      if (item.valor_unitario <= 0) return "Valor unitário deve ser maior que zero";
      if (!item.cfop) return "CFOP é obrigatório";
    }
    
    return null;
  };

  return { validateForm };
};
