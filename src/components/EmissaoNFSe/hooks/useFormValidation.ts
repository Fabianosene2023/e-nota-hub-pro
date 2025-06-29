
interface FormData {
  prestador_id: string;
  tomador_nome: string;
  tomador_cnpj_cpf: string;
  tomador_endereco: string;
  tomador_email: string;
  discriminacao: string;
}

interface ItemNFSe {
  descricao: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  aliquota_iss: number;
  codigo_servico?: string;
}

export const useFormValidation = () => {
  const validateForm = (formData: FormData, itens: ItemNFSe[]): string | null => {
    // Validate prestador (service provider)
    if (!formData.prestador_id) {
      return "Selecione o prestador de serviços";
    }

    // Validate tomador (service taker)
    if (!formData.tomador_nome?.trim()) {
      return "Informe o nome/razão social do tomador";
    }

    if (!formData.tomador_cnpj_cpf?.trim()) {
      return "Informe o CPF/CNPJ do tomador";
    }

    // Basic CPF/CNPJ format validation
    const cpfCnpjClean = formData.tomador_cnpj_cpf.replace(/\D/g, '');
    if (cpfCnpjClean.length !== 11 && cpfCnpjClean.length !== 14) {
      return "CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos";
    }

    if (!formData.tomador_endereco?.trim()) {
      return "Informe o endereço do tomador";
    }

    if (formData.tomador_email && !isValidEmail(formData.tomador_email)) {
      return "E-mail do tomador inválido";
    }

    // Validate discriminacao (service description)
    if (!formData.discriminacao?.trim()) {
      return "A discriminação dos serviços é obrigatória";
    }

    if (formData.discriminacao.trim().length < 10) {
      return "A discriminação deve ter pelo menos 10 caracteres";
    }

    // Validate items
    if (itens.length === 0) {
      return "Adicione pelo menos um serviço à nota";
    }

    for (const [index, item] of itens.entries()) {
      if (!item.descricao?.trim()) {
        return `Item ${index + 1}: Descrição é obrigatória`;
      }

      if (!item.quantidade || item.quantidade <= 0) {
        return `Item ${index + 1}: Quantidade deve ser maior que zero`;
      }

      if (!item.valor_unitario || item.valor_unitario <= 0) {
        return `Item ${index + 1}: Valor unitário deve ser maior que zero`;
      }

      if (!item.aliquota_iss && item.aliquota_iss !== 0) {
        return `Item ${index + 1}: Alíquota ISS é obrigatória`;
      }

      if (item.aliquota_iss < 0 || item.aliquota_iss > 100) {
        return `Item ${index + 1}: Alíquota ISS deve estar entre 0% e 100%`;
      }

      // Validate calculated total
      const expectedTotal = item.quantidade * item.valor_unitario;
      if (Math.abs(item.valor_total - expectedTotal) > 0.01) {
        return `Item ${index + 1}: Valor total não confere com quantidade × valor unitário`;
      }
    }

    return null;
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return { validateForm };
};
