export interface DadosNfse {
  numero_rps: number;
  serie_rps: string;
  data_emissao: string;
  prestador: {
    cnpj: string;
    razao_social: string;
    inscricao_municipal?: string;
    endereco?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
    telefone?: string;
    email?: string;
  };
  tomador: {
    cpf_cnpj?: string;
    razao_social: string;
    inscricao_municipal?: string;
    endereco?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
    telefone?: string;
    email?: string;
  };
  servico: {
    codigo_servico: string;
    descricao: string;
    valor_servico: number;
    aliquota_iss: number;
    valor_liquido?: number;
    retencoes?: {
      ir?: number;
      iss?: number;
      inss?: number;
      csll?: number;
      cofins?: number;
      pis?: number;
    };
  };
  observacoes?: string;
}

export class NfseXmlGenerator {
  
  /**
   * Gera XML para envio da NFSe
   */
  public static gerarXmlNfse(dados: DadosNfse, padrao: string): string {
    console.log(`Gerando XML para NFSe - Padrão: ${padrao}`);
    
    switch (padrao) {
      case 'GINFES':
        return this.gerarXmlGinfes(dados);
      
      case 'ABRASF':
        return this.gerarXmlAbrasf(dados);
      
      default:
        return `<erro>Padrão não implementado: ${padrao}</erro>`;
    }
  }
  
  private static gerarXmlGinfes(dados: DadosNfse): string {
    return `<xml>NFSe GINFES</xml>`;
  }
  
  private static gerarXmlAbrasf(dados: DadosNfse): string {
    return `<xml>NFSe ABRASF</xml>`;
  }
}
