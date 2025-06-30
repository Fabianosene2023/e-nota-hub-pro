
import { toast } from '@/hooks/use-toast';

interface FormData {
  empresa_id: string;
  cliente_id: string;
  numero: string;
  serie: number;
  natureza_operacao: string;
}

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

export const useFormValidation = () => {
  const validateForm = (formData: FormData, itens: ItemNFe[]): string | null => {
    // Validações básicas
    if (!formData.empresa_id) {
      return "Selecione uma empresa";
    }

    if (!formData.cliente_id) {
      return "Selecione um cliente";
    }

    if (!formData.numero) {
      return "Informe o número da nota fiscal";
    }

    if (formData.serie < 1) {
      return "A série deve ser maior que zero";
    }

    if (!formData.natureza_operacao) {
      return "Informe a natureza da operação";
    }

    // Validação dos itens
    if (itens.length === 0) {
      return "Adicione pelo menos um item à nota fiscal";
    }

    for (const item of itens) {
      if (!item.item_nome) {
        return "Todos os itens devem ter nome/descrição";
      }

      if (item.quantidade <= 0) {
        return "A quantidade deve ser maior que zero";
      }

      if (item.valor_unitario <= 0) {
        return "O valor unitário deve ser maior que zero";
      }

      if (!item.cfop) {
        return "Todos os itens devem ter CFOP definido";
      }
    }

    return null;
  };

  return { validateForm };
};
