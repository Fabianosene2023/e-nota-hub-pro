
import { DadosNFeCompletos } from './types';

export class NFEUtils {
  
  private static readonly CODIGOS_UF = {
    'AC': '12', 'AL': '17', 'AP': '16', 'AM': '23', 'BA': '29', 'CE': '23',
    'DF': '53', 'ES': '32', 'GO': '52', 'MA': '21', 'MT': '51', 'MS': '50',
    'MG': '31', 'PA': '15', 'PB': '25', 'PR': '41', 'PE': '26', 'PI': '22',
    'RJ': '33', 'RN': '24', 'RS': '43', 'RO': '11', 'RR': '14', 'SC': '42',
    'SP': '35', 'SE': '28', 'TO': '17'
  };

  private static readonly MUNICIPIOS_PRINCIPAIS = {
    'São Paulo-SP': '3550308',
    'Rio de Janeiro-RJ': '3304557',
    'Belo Horizonte-MG': '3106200',
    'Salvador-BA': '2927408',
    'Brasília-DF': '5300108',
    'Fortaleza-CE': '2304400',
    'Manaus-AM': '1302603',
    'Curitiba-PR': '4106902',
    'Recife-PE': '2611606',
    'Porto Alegre-RS': '4314902'
  };

  public static gerarChaveAcesso(dados: DadosNFeCompletos): string {
    const agora = new Date(dados.nota.data_emissao);
    const uf = this.obterCodigoUF(dados.empresa.estado);
    const aamm = agora.getFullYear().toString().substr(2) + 
                (agora.getMonth() + 1).toString().padStart(2, '0');
    const cnpj = dados.empresa.cnpj.replace(/\D/g, '');
    const mod = '55';
    const serie = dados.nota.serie.toString().padStart(3, '0');
    const numeroStr = dados.nota.numero.toString().padStart(9, '0');
    const tpEmis = '1';
    const cNF = this.gerarCodigoNumerico();
    
    const chaveBase = uf + aamm + cnpj + mod + serie + numeroStr + tpEmis + cNF;
    const dv = this.calcularDVChaveAcesso(chaveBase);
    
    return chaveBase + dv;
  }

  public static obterCodigoUF(uf: string): string {
    return this.CODIGOS_UF[uf as keyof typeof this.CODIGOS_UF] || '35';
  }

  public static obterCodigoMunicipio(cidade: string, uf: string): string {
    const chave = `${cidade}-${uf}`;
    return this.MUNICIPIOS_PRINCIPAIS[chave as keyof typeof this.MUNICIPIOS_PRINCIPAIS] || '3550308';
  }

  public static validarCNPJ(cnpj: string): boolean {
    const cnpjNumeros = cnpj.replace(/\D/g, '');
    
    if (cnpjNumeros.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(cnpjNumeros)) return false;

    // Validação do primeiro dígito verificador
    let soma = 0;
    let peso = 2;
    for (let i = 11; i >= 0; i--) {
      soma += parseInt(cnpjNumeros[i]) * peso;
      peso = peso === 9 ? 2 : peso + 1;
    }
    const dv1 = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    
    if (parseInt(cnpjNumeros[12]) !== dv1) return false;

    // Validação do segundo dígito verificador
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

    // Validação do primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpfNumeros[i]) * (10 - i);
    }
    let dv1 = 11 - (soma % 11);
    if (dv1 >= 10) dv1 = 0;
    
    if (parseInt(cpfNumeros[9]) !== dv1) return false;

    // Validação do segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpfNumeros[i]) * (11 - i);
    }
    let dv2 = 11 - (soma % 11);
    if (dv2 >= 10) dv2 = 0;
    
    return parseInt(cpfNumeros[10]) === dv2;
  }

  public static validarChaveAcesso(chave: string): boolean {
    if (!chave || chave.length !== 44) return false;
    
    const chaveBase = chave.substring(0, 43);
    const dvInformado = chave.substring(43);
    const dvCalculado = this.calcularDVChaveAcesso(chaveBase);
    
    return dvInformado === dvCalculado;
  }

  public static formatarCNPJ(cnpj: string): string {
    const numeros = cnpj.replace(/\D/g, '');
    return numeros.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  }

  public static formatarCPF(cpf: string): string {
    const numeros = cpf.replace(/\D/g, '');
    return numeros.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  }

  public static formatarChaveAcesso(chave: string): string {
    return chave.replace(/(\d{4})/g, '$1 ').trim();
  }

  private static gerarCodigoNumerico(): string {
    return Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
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
