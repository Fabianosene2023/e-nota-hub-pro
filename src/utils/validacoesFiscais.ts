
export const validarCNPJ = (cnpj: string): boolean => {
  const cnpjLimpo = cnpj.replace(/[^\d]/g, '');
  
  if (cnpjLimpo.length !== 14) return false;
  
  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1{13}$/.test(cnpjLimpo)) return false;
  
  // Calcular primeiro dígito verificador
  let soma = 0;
  let peso = 5;
  for (let i = 0; i < 12; i++) {
    soma += parseInt(cnpjLimpo[i]) * peso;
    peso = peso === 2 ? 9 : peso - 1;
  }
  let digito1 = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  
  // Calcular segundo dígito verificador
  soma = 0;
  peso = 6;
  for (let i = 0; i < 13; i++) {
    soma += parseInt(cnpjLimpo[i]) * peso;
    peso = peso === 2 ? 9 : peso - 1;
  }
  let digito2 = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  
  return (
    digito1 === parseInt(cnpjLimpo[12]) &&
    digito2 === parseInt(cnpjLimpo[13])
  );
};

export const validarCPF = (cpf: string): boolean => {
  const cpfLimpo = cpf.replace(/[^\d]/g, '');
  
  if (cpfLimpo.length !== 11) return false;
  
  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cpfLimpo)) return false;
  
  // Calcular primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpfLimpo[i]) * (10 - i);
  }
  let digito1 = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  
  // Calcular segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpfLimpo[i]) * (11 - i);
  }
  let digito2 = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  
  return (
    digito1 === parseInt(cpfLimpo[9]) &&
    digito2 === parseInt(cpfLimpo[10])
  );
};

export const validarCFOP = (cfop: string): boolean => {
  const cfopLimpo = cfop.replace(/[^\d]/g, '');
  return cfopLimpo.length === 4 && parseInt(cfopLimpo) > 0;
};

export const validarNCM = (ncm: string): boolean => {
  const ncmLimpo = ncm.replace(/[^\d]/g, '');
  return ncmLimpo.length === 8;
};

export const formatarCNPJ = (cnpj: string): string => {
  const cnpjLimpo = cnpj.replace(/[^\d]/g, '');
  return cnpjLimpo.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
};

export const formatarCPF = (cpf: string): string => {
  const cpfLimpo = cpf.replace(/[^\d]/g, '');
  return cpfLimpo.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
};

export const formatarCEP = (cep: string): string => {
  const cepLimpo = cep.replace(/[^\d]/g, '');
  return cepLimpo.replace(/^(\d{5})(\d{3})$/, '$1-$2');
};
