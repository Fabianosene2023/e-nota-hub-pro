
/**
 * SEFAZ Validators for common validations
 */
export class SefazValidators {
  
  public static validarChaveAcesso(chave: string): boolean {
    if (!chave || chave.length !== 44) {
      return false;
    }
    
    if (!/^\d{44}$/.test(chave)) {
      return false;
    }
    
    // Validar dígito verificador
    const chaveBase = chave.substring(0, 43);
    const dvInformado = chave.substring(43);
    const dvCalculado = this.calcularDVChaveAcesso(chaveBase);
    
    return dvInformado === dvCalculado;
  }
  
  public static validarCNPJ(cnpj: string): boolean {
    const cnpjNumeros = cnpj.replace(/\D/g, '');
    
    if (cnpjNumeros.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(cnpjNumeros)) return false;

    // Validação dos dígitos verificadores
    let soma = 0;
    let peso = 2;
    for (let i = 11; i >= 0; i--) {
      soma += parseInt(cnpjNumeros[i]) * peso;
      peso = peso === 9 ? 2 : peso + 1;
    }
    const dv1 = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    
    if (parseInt(cnpjNumeros[12]) !== dv1) return false;

    soma = 0;
    peso = 2;
    for (let i = 12; i >= 0; i--) {
      soma += parseInt(cnpjNumeros[i]) * peso;
      peso = peso === 9 ? 2 : peso + 1;
    }
    const dv2 = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    
    return parseInt(cnpjNumeros[13]) === dv2;
  }
  
  public static validarCPF(cpf: string): boolean {
    const cpfNumeros = cpf.replace(/\D/g, '');
    
    if (cpfNumeros.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpfNumeros)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpfNumeros[i]) * (10 - i);
    }
    let dv1 = 11 - (soma % 11);
    if (dv1 >= 10) dv1 = 0;
    
    if (parseInt(cpfNumeros[9]) !== dv1) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpfNumeros[i]) * (11 - i);
    }
    let dv2 = 11 - (soma % 11);
    if (dv2 >= 10) dv2 = 0;
    
    return parseInt(cpfNumeros[10]) === dv2;
  }
  
  private static calcularDVChaveAcesso(chave: string): string {
    const sequence = '4329876543298765432987654329876543298765432';
    let sum = 0;
    
    for (let i = 0; i < chave.length; i++) {
      sum += parseInt(chave[i]) * parseInt(sequence[i]);
    }
    
    const remainder = sum % 11;
    return remainder < 2 ? '0' : (11 - remainder).toString();
  }
}
