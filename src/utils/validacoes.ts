
import { validarCPF, validarCNPJ } from './validacoesFiscais';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ClienteValidation {
  nome_razao_social: string;
  cpf_cnpj: string;
  tipo_pessoa: 'fisica' | 'juridica';
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  email?: string;
  telefone?: string;
}

export interface ProdutoValidation {
  codigo: string;
  descricao: string;
  unidade: string;
  preco_unitario: number;
  cfop: string;
  ncm?: string;
}

export const validarCliente = (cliente: ClienteValidation): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Nome/Razão Social
  if (!cliente.nome_razao_social?.trim()) {
    errors.push({
      field: 'nome_razao_social',
      message: 'Nome/Razão Social é obrigatório'
    });
  } else if (cliente.nome_razao_social.length < 2) {
    errors.push({
      field: 'nome_razao_social',
      message: 'Nome/Razão Social deve ter pelo menos 2 caracteres'
    });
  }

  // CPF/CNPJ
  if (!cliente.cpf_cnpj?.trim()) {
    errors.push({
      field: 'cpf_cnpj',
      message: 'CPF/CNPJ é obrigatório'
    });
  } else {
    const cpfCnpjLimpo = cliente.cpf_cnpj.replace(/\D/g, '');
    if (cliente.tipo_pessoa === 'fisica') {
      if (!validarCPF(cpfCnpjLimpo)) {
        errors.push({
          field: 'cpf_cnpj',
          message: 'CPF inválido'
        });
      }
    } else {
      if (!validarCNPJ(cpfCnpjLimpo)) {
        errors.push({
          field: 'cpf_cnpj',
          message: 'CNPJ inválido'
        });
      }
    }
  }

  // Endereço
  if (!cliente.endereco?.trim()) {
    errors.push({
      field: 'endereco',
      message: 'Endereço é obrigatório'
    });
  }

  // Cidade
  if (!cliente.cidade?.trim()) {
    errors.push({
      field: 'cidade',
      message: 'Cidade é obrigatória'
    });
  }

  // Estado
  if (!cliente.estado?.trim()) {
    errors.push({
      field: 'estado',
      message: 'Estado é obrigatório'
    });
  } else if (cliente.estado.length !== 2) {
    errors.push({
      field: 'estado',
      message: 'Estado deve ter 2 caracteres (ex: SP)'
    });
  }

  // CEP
  if (!cliente.cep?.trim()) {
    errors.push({
      field: 'cep',
      message: 'CEP é obrigatório'
    });
  } else {
    const cepLimpo = cliente.cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) {
      errors.push({
        field: 'cep',
        message: 'CEP deve ter 8 dígitos'
      });
    }
  }

  // Email (opcional, mas se preenchido deve ser válido)
  if (cliente.email && cliente.email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cliente.email)) {
      errors.push({
        field: 'email',
        message: 'Email inválido'
      });
    }
  }

  // Telefone (opcional, mas se preenchido deve ter formato válido)
  if (cliente.telefone && cliente.telefone.trim()) {
    const telefoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$|^\d{10,11}$/;
    if (!telefoneRegex.test(cliente.telefone.replace(/\D/g, ''))) {
      errors.push({
        field: 'telefone',
        message: 'Telefone deve ter 10 ou 11 dígitos'
      });
    }
  }

  return errors;
};

export const validarProduto = (produto: ProdutoValidation): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Código
  if (!produto.codigo?.trim()) {
    errors.push({
      field: 'codigo',
      message: 'Código é obrigatório'
    });
  }

  // Descrição
  if (!produto.descricao?.trim()) {
    errors.push({
      field: 'descricao',
      message: 'Descrição é obrigatória'
    });
  } else if (produto.descricao.length < 3) {
    errors.push({
      field: 'descricao',
      message: 'Descrição deve ter pelo menos 3 caracteres'
    });
  }

  // Unidade
  if (!produto.unidade?.trim()) {
    errors.push({
      field: 'unidade',
      message: 'Unidade é obrigatória'
    });
  }

  // Preço
  if (produto.preco_unitario <= 0) {
    errors.push({
      field: 'preco_unitario',
      message: 'Preço deve ser maior que zero'
    });
  }

  // CFOP
  if (!produto.cfop?.trim()) {
    errors.push({
      field: 'cfop',
      message: 'CFOP é obrigatório'
    });
  } else if (produto.cfop.length !== 4 || !/^\d{4}$/.test(produto.cfop)) {
    errors.push({
      field: 'cfop',
      message: 'CFOP deve ter 4 dígitos numéricos'
    });
  }

  // NCM (opcional, mas se preenchido deve ser válido)
  if (produto.ncm && produto.ncm.trim()) {
    const ncmLimpo = produto.ncm.replace(/\D/g, '');
    if (ncmLimpo.length !== 8) {
      errors.push({
        field: 'ncm',
        message: 'NCM deve ter 8 dígitos'
      });
    }
  }

  return errors;
};

export const formatarErrosValidacao = (errors: ValidationError[]): Record<string, string> => {
  return errors.reduce((acc, error) => {
    acc[error.field] = error.message;
    return acc;
  }, {} as Record<string, string>);
};
