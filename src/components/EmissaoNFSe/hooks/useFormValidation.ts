
interface FormData {
  prestador_id: string;
  tomador_nome: string;
  discriminacao: string;
}

interface ItemNFSe {
  descricao: string;
  valor_unitario: number;
  valor_total: number;
}

export const useFormValidation = () => {
  const validateForm = (formData: FormData, itens: ItemNFSe[]): string | null => {
    if (!formData.prestador_id) {
      return "Selecione o prestador de serviços";
    }

    if (!formData.tomador_nome?.trim()) {
      return "Informe o nome/razão social do tomador";
    }

    if (!formData.discriminacao?.trim()) {
      return "A discriminação dos serviços é obrigatória";
    }

    if (itens.length === 0) {
      return "Adicione pelo menos um serviço à nota";
    }

    for (const item of itens) {
      if (!item.descricao?.trim()) {
        return "Todos os itens devem ter uma descrição";
      }
      if (!item.valor_unitario || item.valor_unitario <= 0) {
        return "Todos os itens devem ter um valor unitário válido";
      }
    }

    return null;
  };

  return { validateForm };
};
