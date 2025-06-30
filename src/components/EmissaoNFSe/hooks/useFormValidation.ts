
export const useFormValidation = () => {
  const validateForm = (formData: any, itens: any[]) => {
    if (!formData.prestador_id) {
      return "Selecione um prestador de serviços";
    }

    if (!formData.tomador_nome) {
      return "Nome do tomador é obrigatório";
    }

    if (itens.length === 0) {
      return "Adicione pelo menos um serviço";
    }

    for (const item of itens) {
      if (!item.descricao || item.valor_unitario <= 0) {
        return "Todos os serviços devem ter descrição e valor válido";
      }
    }

    return null;
  };

  return { validateForm };
};
