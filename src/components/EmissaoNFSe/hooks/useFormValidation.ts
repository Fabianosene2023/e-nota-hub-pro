
export const useFormValidation = () => {
  const validateForm = (formData: any, itens: any[]) => {
    if (!formData.prestador_id) {
      return "Selecione um prestador de serviço";
    }

    if (!formData.tomador_nome) {
      return "Nome do tomador é obrigatório";
    }

    if (!formData.discriminacao) {
      return "Discriminação dos serviços é obrigatória";
    }

    if (itens.length === 0) {
      return "Adicione pelo menos um serviço";
    }

    for (const item of itens) {
      if (!item.descricao) {
        return "Todos os serviços devem ter descrição";
      }
      if (item.valor_unitario <= 0) {
        return "Todos os serviços devem ter valor maior que zero";
      }
    }

    return null;
  };

  return { validateForm };
};
