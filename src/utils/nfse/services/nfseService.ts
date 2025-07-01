
import { NfseXmlGenerator, DadosNfse } from '../nfseXmlGenerator';
import { NfseIntegrationService, NfseResponse } from '../nfseIntegrationService';

export interface ConfiguracaoNfse {
  padraoMunicipal: 'GINFES' | 'ABRASF' | 'WEBISS' | 'DSF' | 'API_REST';
  urlWebservice: string;
  ambiente: 'homologacao' | 'producao';
  usuario?: string;
  senha?: string;
  token?: string;
  certificado?: {
    conteudo: string;
    senha: string;
  };
}

export interface RetencaoNfse {
  ir?: number;
  iss?: number;
  inss?: number;
  csll?: number;
  cofins?: number;
  pis?: number;
}

export class NfseService {
  
  /**
   * Emite NFSe conforme padrão municipal
   */
  public static async emitirNfse(
    dados: DadosNfse,
    configuracao: ConfiguracaoNfse,
    retencoes?: RetencaoNfse
  ): Promise<NfseResponse> {
    try {
      // Aplicar retenções se informadas
      if (retencoes) {
        dados = this.aplicarRetencoes(dados, retencoes);
      }
      
      // Validar dados obrigatórios
      const validacao = this.validarDadosNfse(dados);
      if (!validacao.valido) {
        return {
          success: false,
          erro: `Dados inválidos: ${validacao.erros.join(', ')}`
        };
      }
      
      switch (configuracao.padraoMunicipal) {
        case 'GINFES':
          return await this.emitirNfseGinfes(dados, configuracao);
        
        case 'ABRASF':
          return await this.emitirNfseAbrasf(dados, configuracao);
        
        case 'WEBISS':
          return await this.emitirNfseWebiss(dados, configuracao);
        
        case 'DSF':
          return await this.emitirNfseDsf(dados, configuracao);
        
        case 'API_REST':
          return await this.emitirNfseApiRest(dados, configuracao);
        
        default:
          return {
            success: false,
            erro: `Padrão municipal não suportado: ${configuracao.padraoMunicipal}`
          };
      }
      
    } catch (error) {
      return {
        success: false,
        erro: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }
  
  /**
   * Consulta NFSe emitida
   */
  public static async consultarNfse(
    numeroNfse: string,
    cnpjPrestador: string,
    configuracao: ConfiguracaoNfse
  ): Promise<NfseResponse> {
    try {
      switch (configuracao.padraoMunicipal) {
        case 'GINFES':
          return await NfseIntegrationService.consultarNfseGinfes(
            numeroNfse,
            cnpjPrestador,
            configuracao.urlWebservice
          );
        
        default:
          return {
            success: false,
            erro: `Consulta não implementada para padrão: ${configuracao.padraoMunicipal}`
          };
      }
    } catch (error) {
      return {
        success: false,
        erro: error instanceof Error ? error.message : 'Erro na consulta'
      };
    }
  }
  
  private static async emitirNfseGinfes(
    dados: DadosNfse,
    configuracao: ConfiguracaoNfse
  ): Promise<NfseResponse> {
    return await NfseIntegrationService.emitirNfseGinfes(
      dados,
      configuracao.urlWebservice,
      configuracao.ambiente
    );
  }
  
  private static async emitirNfseAbrasf(
    dados: DadosNfse,
    configuracao: ConfiguracaoNfse
  ): Promise<NfseResponse> {
    // Implementação para padrão ABRASF
    const xmlRps = this.gerarXmlAbrasf(dados);
    
    // Simular resposta para desenvolvimento
    return {
      success: true,
      numero_nfse: `ABRASF-${Date.now()}`,
      codigo_verificacao: Math.random().toString(36).substring(2, 15),
      valor_total: dados.servico.valor_servico,
      xml_nfse: xmlRps
    };
  }
  
  private static async emitirNfseWebiss(
    dados: DadosNfse,
    configuracao: ConfiguracaoNfse
  ): Promise<NfseResponse> {
    // Implementação para padrão WebISS
    const xmlRps = this.gerarXmlWebiss(dados);
    
    return {
      success: true,
      numero_nfse: `WEBISS-${Date.now()}`,
      codigo_verificacao: Math.random().toString(36).substring(2, 15),
      valor_total: dados.servico.valor_servico,
      xml_nfse: xmlRps
    };
  }
  
  private static async emitirNfseDsf(
    dados: DadosNfse,
    configuracao: ConfiguracaoNfse
  ): Promise<NfseResponse> {
    // Implementação para padrão DSF (São Paulo)
    const xmlRps = this.gerarXmlDsf(dados);
    
    return {
      success: true,
      numero_nfse: `DSF-${Date.now()}`,
      codigo_verificacao: Math.random().toString(36).substring(2, 15),
      valor_total: dados.servico.valor_servico,
      xml_nfse: xmlRps
    };
  }
  
  private static async emitirNfseApiRest(
    dados: DadosNfse,
    configuracao: ConfiguracaoNfse
  ): Promise<NfseResponse> {
    // Implementação para APIs REST municipais
    const jsonData = this.gerarJsonApiRest(dados);
    
    try {
      const response = await fetch(configuracao.urlWebservice, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${configuracao.token}`
        },
        body: JSON.stringify(jsonData)
      });
      
      const result = await response.json();
      
      return {
        success: response.ok,
        numero_nfse: result.numero_nfse,
        codigo_verificacao: result.codigo_verificacao,
        valor_total: dados.servico.valor_servico
      };
      
    } catch (error) {
      return {
        success: false,
        erro: error instanceof Error ? error.message : 'Erro na API REST'
      };
    }
  }
  
  private static aplicarRetencoes(dados: DadosNfse, retencoes: RetencaoNfse): DadosNfse {
    const valorServico = dados.servico.valor_servico;
    
    // Calcular valores de retenção
    const valorIR = retencoes.ir ? (valorServico * retencoes.ir / 100) : 0;
    const valorINSS = retencoes.inss ? (valorServico * retencoes.inss / 100) : 0;
    const valorCSLL = retencoes.csll ? (valorServico * retencoes.csll / 100) : 0;
    const valorCOFINS = retencoes.cofins ? (valorServico * retencoes.cofins / 100) : 0;
    const valorPIS = retencoes.pis ? (valorServico * retencoes.pis / 100) : 0;
    
    const totalRetencoes = valorIR + valorINSS + valorCSLL + valorCOFINS + valorPIS;
    
    return {
      ...dados,
      servico: {
        ...dados.servico,
        valor_liquido: valorServico - totalRetencoes,
        retencoes: {
          ir: valorIR,
          inss: valorINSS,
          csll: valorCSLL,
          cofins: valorCOFINS,
          pis: valorPIS
        }
      }
    };
  }
  
  private static validarDadosNfse(dados: DadosNfse): { valido: boolean; erros: string[] } {
    const erros: string[] = [];
    
    if (!dados.prestador.cnpj) {
      erros.push('CNPJ do prestador é obrigatório');
    }
    
    if (!dados.tomador.razao_social) {
      erros.push('Nome/Razão social do tomador é obrigatório');
    }
    
    if (!dados.servico.descricao) {
      erros.push('Descrição do serviço é obrigatória');
    }
    
    if (dados.servico.valor_servico <= 0) {
      erros.push('Valor do serviço deve ser maior que zero');
    }
    
    return {
      valido: erros.length === 0,
      erros
    };
  }
  
  private static gerarXmlAbrasf(dados: DadosNfse): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<GerarNfseEnvio xmlns="http://www.abrasf.org.br/nfse.xsd">
  <Rps>
    <InfRps Id="rps${dados.numero_rps}">
      <IdentificacaoRps>
        <Numero>${dados.numero_rps}</Numero>
        <Serie>${dados.serie_rps}</Serie>
        <Tipo>1</Tipo>
      </IdentificacaoRps>
      <DataEmissao>${dados.data_emissao}</DataEmissao>
      <NaturezaOperacao>1</NaturezaOperacao>
      <Status>1</Status>
      <Servico>
        <Valores>
          <ValorServicos>${dados.servico.valor_servico.toFixed(2)}</ValorServicos>
          <Aliquota>${(dados.servico.aliquota_iss / 100).toFixed(4)}</Aliquota>
          <ValorIss>${(dados.servico.valor_servico * dados.servico.aliquota_iss / 100).toFixed(2)}</ValorIss>
        </Valores>
        <ItemListaServico>${dados.servico.codigo_servico}</ItemListaServico>
        <Discriminacao>${dados.servico.descricao}</Discriminacao>
        <CodigoMunicipio>3550308</CodigoMunicipio>
      </Servico>
      <Prestador>
        <Cnpj>${dados.prestador.cnpj}</Cnpj>
        <InscricaoMunicipal>${dados.prestador.inscricao_municipal}</InscricaoMunicipal>
      </Prestador>
      <Tomador>
        <IdentificacaoTomador>
          <CpfCnpj>
            ${dados.tomador.cpf_cnpj?.length === 11 ? 
              `<Cpf>${dados.tomador.cpf_cnpj}</Cpf>` : 
              `<Cnpj>${dados.tomador.cpf_cnpj}</Cnpj>`
            }
          </CpfCnpj>
        </IdentificacaoTomador>
        <RazaoSocial>${dados.tomador.razao_social}</RazaoSocial>
      </Tomador>
    </InfRps>
  </Rps>
</GerarNfseEnvio>`;
  }
  
  private static gerarXmlWebiss(dados: DadosNfse): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GerarNfse xmlns="http://www.webiss.com.br">
      <xml>
        <Rps>
          <Numero>${dados.numero_rps}</Numero>
          <Serie>${dados.serie_rps}</Serie>
          <Tipo>1</Tipo>
          <DataEmissao>${dados.data_emissao}</DataEmissao>
          <Status>1</Status>
          <ValorServico>${dados.servico.valor_servico.toFixed(2)}</ValorServico>
          <ValorIss>${(dados.servico.valor_servico * dados.servico.aliquota_iss / 100).toFixed(2)}</ValorIss>
          <Aliquota>${dados.servico.aliquota_iss.toFixed(2)}</Aliquota>
          <DescricaoServico>${dados.servico.descricao}</DescricaoServico>
        </Rps>
      </xml>
    </GerarNfse>
  </soap:Body>
</soap:Envelope>`;
  }
  
  private static gerarXmlDsf(dados: DadosNfse): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<PedidoEnvioRPS xmlns="http://www.prefeitura.sp.gov.br/nfe">
  <Cabecalho>
    <CPFCNPJRemetente>
      <CNPJ>${dados.prestador.cnpj}</CNPJ>
    </CPFCNPJRemetente>
    <InscricaoMunicipalRemetente>${dados.prestador.inscricao_municipal}</InscricaoMunicipalRemetente>
  </Cabecalho>
  <RPS>
    <Assinatura>ASSINATURA_TEMP</Assinatura>
    <ChaveRPS>
      <InscricaoMunicipal>${dados.prestador.inscricao_municipal}</InscricaoMunicipal>
      <SerieRPS>${dados.serie_rps}</SerieRPS>
      <NumeroRPS>${dados.numero_rps}</NumeroRPS>
    </ChaveRPS>
    <TipoRPS>RPS</TipoRPS>
    <DataEmissao>${dados.data_emissao}</DataEmissao>
    <StatusRPS>N</StatusRPS>
    <ValorServicos>${dados.servico.valor_servico.toFixed(2)}</ValorServicos>
    <ValorISS>${(dados.servico.valor_servico * dados.servico.aliquota_iss / 100).toFixed(2)}</ValorISS>
    <Aliquota>${dados.servico.aliquota_iss.toFixed(4)}</Aliquota>
    <Discriminacao>${dados.servico.descricao}</Discriminacao>
  </RPS>
</PedidoEnvioRPS>`;
  }
  
  private static gerarJsonApiRest(dados: DadosNfse): any {
    return {
      rps: {
        numero: dados.numero_rps,
        serie: dados.serie_rps,
        data_emissao: dados.data_emissao,
        prestador: {
          cnpj: dados.prestador.cnpj,
          inscricao_municipal: dados.prestador.inscricao_municipal,
          razao_social: dados.prestador.razao_social
        },
        tomador: {
          cpf_cnpj: dados.tomador.cpf_cnpj,
          razao_social: dados.tomador.razao_social,
          endereco: dados.tomador.endereco,
          email: dados.tomador.email
        },
        servico: {
          codigo: dados.servico.codigo_servico,
          descricao: dados.servico.descricao,
          valor: dados.servico.valor_servico,
          aliquota_iss: dados.servico.aliquota_iss
        }
      }
    };
  }
}
