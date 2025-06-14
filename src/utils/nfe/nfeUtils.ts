
/**
 * Utility functions for NFe operations
 */
export class NFEUtils {
  
  /**
   * Get UF code from state name
   */
  public static obterCodigoUF(estado: string): string {
    const codigosUF: { [key: string]: string } = {
      'AC': '12', 'AL': '17', 'AP': '16', 'AM': '23', 'BA': '29',
      'CE': '23', 'DF': '53', 'ES': '32', 'GO': '52', 'MA': '21',
      'MT': '51', 'MS': '50', 'MG': '31', 'PA': '15', 'PB': '25',
      'PR': '41', 'PE': '26', 'PI': '22', 'RJ': '33', 'RN': '24',
      'RS': '43', 'RO': '11', 'RR': '14', 'SC': '42', 'SP': '35',
      'SE': '28', 'TO': '17'
    };
    return codigosUF[estado] || '35';
  }

  /**
   * Calculate access key verification digit
   */
  public static calcularDVChaveAcesso(chave: string): string {
    const sequencia = '4329876543298765432987654329876543298765432';
    let soma = 0;
    
    for (let i = 0; i < chave.length; i++) {
      soma += parseInt(chave[i]) * parseInt(sequencia[i]);
    }
    
    const resto = soma % 11;
    return resto < 2 ? '0' : (11 - resto).toString();
  }

  /**
   * Generate access key for NFe
   */
  public static gerarChaveAcesso(dados: any): string {
    const uf = this.obterCodigoUF(dados.empresa.estado);
    const dataEmissao = new Date(dados.nota.data_emissao);
    const aamm = dataEmissao.getFullYear().toString().substr(2) + 
                 (dataEmissao.getMonth() + 1).toString().padStart(2, '0');
    const cnpj = dados.empresa.cnpj.replace(/\D/g, '');
    const modelo = '55'; // NFe
    const serie = dados.nota.serie.toString().padStart(3, '0');
    const numero = dados.nota.numero.toString().padStart(9, '0');
    const tipoEmissao = '1'; // Normal
    const codigoNumerico = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
    
    const chaveBase = uf + aamm + cnpj + modelo + serie + numero + tipoEmissao + codigoNumerico;
    const dv = this.calcularDVChaveAcesso(chaveBase);
    
    return chaveBase + dv;
  }
}
