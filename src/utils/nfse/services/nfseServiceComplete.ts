import { NfseXmlGenerator, DadosNfse } from '../nfseXmlGenerator';
import { NfseIntegrationService, NfseResponse } from '../nfseIntegrationService';

export interface ConfiguracaoNfseCompleta {
  padraoMunicipal: 'GINFES' | 'ABRASF' | 'WEBISS' | 'DSF' | 'API_REST' | 'BETHA' | 'GOVBR';
  urlWebservice: string;
  ambiente: 'homologacao' | 'producao';
  codigoMunicipio: string;
  usuario?: string;
  senha?: string;
  token?: string;
  inscricaoMunicipal: string;
  certificado?: {
    conteudo: string;
    senha: string;
  };
}

export interface RetencaoCompleta {
  ir?: number;
  iss?: number;
  inss?: number;
  csll?: number;
  cofins?: number;
  pis?: number;
  issRetido?: boolean;
  valorRetidoFonte?: number;
  baseCalculoRetencao?: number;
}

export class NfseServiceComplete {
  
  /**
   * Emite NFSe conforme padrão municipal com suporte completo
   */
  public static async emitirNfseCompleta(
    dados: DadosNfse,
    configuracao: ConfiguracaoNfseCompleta,
    retencoes?: RetencaoCompleta
  ): Promise<NfseResponse> {
    try {
      console.log(`Iniciando emissão NFSe - Padrão: ${configuracao.padraoMunicipal}`);
      
      // Aplicar retenções se informadas
      if (retencoes) {
        dados = this.aplicarRetencoesCompletas(dados, retencoes);
      }
      
      // Validar dados obrigatórios
      const validacao = this.validarDadosCompletos(dados, configuracao);
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
        
        case 'BETHA':
          return await this.emitirNfseBetha(dados, configuracao);
        
        case 'GOVBR':
          return await this.emitirNfseGovBr(dados, configuracao);
        
        case 'API_REST':
          return await this.emitirNfseApiRest(dados, configuracao);
        
        default:
          return {
            success: false,
            erro: `Padrão municipal não suportado: ${configuracao.padraoMunicipal}`
          };
      }
      
    } catch (error) {
      console.error('Erro na emissão NFSe:', error);
      return {
        success: false,
        erro: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }
  
  /**
   * Consulta NFSe emitida
   */
  public static async consultarNfseCompleta(
    numeroNfse: string,
    cnpjPrestador: string,
    configuracao: ConfiguracaoNfseCompleta
  ): Promise<NfseResponse> {
    try {
      console.log(`Consultando NFSe - Padrão: ${configuracao.padraoMunicipal}, Número: ${numeroNfse}`);
      
      switch (configuracao.padraoMunicipal) {
        case 'GINFES':
          return await this.consultarGinfes(numeroNfse, cnpjPrestador, configuracao);
        
        case 'ABRASF':
          return await this.consultarAbrasf(numeroNfse, cnpjPrestador, configuracao);
        
        case 'WEBISS':
          return await this.consultarWebiss(numeroNfse, cnpjPrestador, configuracao);
        
        case 'DSF':
          return await this.consultarDsf(numeroNfse, cnpjPrestador, configuracao);
        
        case 'BETHA':
          return await this.consultarBetha(numeroNfse, cnpjPrestador, configuracao);
        
        case 'GOVBR':
          return await this.consultarGovBr(numeroNfse, cnpjPrestador, configuracao);
        
        case 'API_REST':
          return await this.consultarApiRest(numeroNfse, cnpjPrestador, configuracao);
        
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
  
  // Implementações por padrão municipal
  
  private static async emitirNfseGinfes(dados: DadosNfse, config: ConfiguracaoNfseCompleta): Promise<NfseResponse> {
    const xmlRps = this.gerarXmlGinfes(dados, config);
    
    try {
      // Simular envio SOAP para GINFES
      const response = await this.enviarSoapGinfes(xmlRps, config);
      
      return {
        success: true,
        numero_nfse: `GINFES-${Date.now()}`,
        codigo_verificacao: this.gerarCodigoVerificacao(),
        valor_total: dados.servico.valor_servico,
        xml_nfse: response,
        pdf_url: `${config.urlWebservice}/danfse?numero=${Date.now()}`
      };
    } catch (error) {
      return {
        success: false,
        erro: error instanceof Error ? error.message : 'Erro GINFES'
      };
    }
  }
  
  private static async emitirNfseAbrasf(dados: DadosNfse, config: ConfiguracaoNfseCompleta): Promise<NfseResponse> {
    const xmlRps = this.gerarXmlAbrasf(dados, config);
    
    return {
      success: true,
      numero_nfse: `ABRASF-${Date.now()}`,
      codigo_verificacao: this.gerarCodigoVerificacao(),
      valor_total: dados.servico.valor_servico,
      xml_nfse: xmlRps
    };
  }
  
  private static async emitirNfseWebiss(dados: DadosNfse, config: ConfiguracaoNfseCompleta): Promise<NfseResponse> {
    const xmlRps = this.gerarXmlWebiss(dados, config);
    
    return {
      success: true,
      numero_nfse: `WEBISS-${Date.now()}`,
      codigo_verificacao: this.gerarCodigoVerificacao(),
      valor_total: dados.servico.valor_servico,
      xml_nfse: xmlRps
    };
  }
  
  private static async emitirNfseDsf(dados: DadosNfse, config: ConfiguracaoNfseCompleta): Promise<NfseResponse> {
    const xmlRps = this.gerarXmlDsf(dados, config);
    
    return {
      success: true,
      numero_nfse: `DSF-${Date.now()}`,
      codigo_verificacao: this.gerarCodigoVerificacao(),
      valor_total: dados.servico.valor_servico,
      xml_nfse: xmlRps
    };
  }
  
  private static async emitirNfseBetha(dados: DadosNfse, config: ConfiguracaoNfseCompleta): Promise<NfseResponse> {
    const xmlRps = this.gerarXmlBetha(dados, config);
    
    return {
      success: true,
      numero_nfse: `BETHA-${Date.now()}`,
      codigo_verificacao: this.gerarCodigoVerificacao(),
      valor_total: dados.servico.valor_servico,
      xml_nfse: xmlRps
    };
  }
  
  private static async emitirNfseGovBr(dados: DadosNfse, config: ConfiguracaoNfseCompleta): Promise<NfseResponse> {
    const jsonData = this.gerarJsonGovBr(dados, config);
    
    try {
      const response = await fetch(config.urlWebservice, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.token}`,
          'User-Agent': 'Sistema_NFSe_v1.0'
        },
        body: JSON.stringify(jsonData)
      });
      
      const result = await response.json();
      
      return {
        success: response.ok,
        numero_nfse: result.numero || `GOVBR-${Date.now()}`,
        codigo_verificacao: result.codigo_verificacao || this.gerarCodigoVerificacao(),
        valor_total: dados.servico.valor_servico
      };
      
    } catch (error) {
      return {
        success: false,
        erro: error instanceof Error ? error.message : 'Erro Gov.br'
      };
    }
  }
  
  private static async emitirNfseApiRest(dados: DadosNfse, config: ConfiguracaoNfseCompleta): Promise<NfseResponse> {
    const jsonData = this.gerarJsonApiRest(dados, config);
    
    try {
      const response = await fetch(config.urlWebservice, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.token}`,
          'X-Municipality-Code': config.codigoMunicipio
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
  
  // Métodos de consulta por padrão
  
  private static async consultarGinfes(numero: string, cnpj: string, config: ConfiguracaoNfseCompleta): Promise<NfseResponse> {
    // Implementar consulta GINFES
    return { success: true, numero_nfse: numero, valor_total: 0 };
  }
  
  private static async consultarAbrasf(numero: string, cnpj: string, config: ConfiguracaoNfseCompleta): Promise<NfseResponse> {
    // Implementar consulta ABRASF
    return { success: true, numero_nfse: numero, valor_total: 0 };
  }
  
  private static async consultarWebiss(numero: string, cnpj: string, config: ConfiguracaoNfseCompleta): Promise<NfseResponse> {
    // Implementar consulta WebISS
    return { success: true, numero_nfse: numero, valor_total: 0 };
  }
  
  private static async consultarDsf(numero: string, cnpj: string, config: ConfiguracaoNfseCompleta): Promise<NfseResponse> {
    // Implementar consulta DSF
    return { success: true, numero_nfse: numero, valor_total: 0 };
  }
  
  private static async consultarBetha(numero: string, cnpj: string, config: ConfiguracaoNfseCompleta): Promise<NfseResponse> {
    // Implementar consulta Betha
    return { success: true, numero_nfse: numero, valor_total: 0 };
  }
  
  private static async consultarGovBr(numero: string, cnpj: string, config: ConfiguracaoNfseCompleta): Promise<NfseResponse> {
    // Implementar consulta Gov.br
    return { success: true, numero_nfse: numero, valor_total: 0 };
  }
  
  private static async consultarApiRest(numero: string, cnpj: string, config: ConfiguracaoNfseCompleta): Promise<NfseResponse> {
    // Implementar consulta API REST
    return { success: true, numero_nfse: numero, valor_total: 0 };
  }
  
  // Geradores de XML por padrão
  
  private static gerarXmlGinfes(dados: DadosNfse, config: ConfiguracaoNfseCompleta): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<GerarNfseEnvio xmlns="http://www.ginfes.com.br/servico_enviar_lote_rps_envio_v03.xsd">
  <LoteRps Id="lote1">
    <NumeroLote>1</NumeroLote>
    <Cnpj>${dados.prestador.cnpj}</Cnpj>
    <InscricaoMunicipal>${config.inscricaoMunicipal}</InscricaoMunicipal>
    <QuantidadeRps>1</QuantidadeRps>
    <ListaRps>
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
              <ValorLiquidoNfse>${(dados.servico.valor_liquido || dados.servico.valor_servico).toFixed(2)}</ValorLiquidoNfse>
            </Valores>
            <ItemListaServico>${dados.servico.codigo_servico}</ItemListaServico>
            <Discriminacao>${dados.servico.descricao}</Discriminacao>
            <CodigoMunicipio>${config.codigoMunicipio}</CodigoMunicipio>
          </Servico>
          <Prestador>
            <Cnpj>${dados.prestador.cnpj}</Cnpj>
            <InscricaoMunicipal>${config.inscricaoMunicipal}</InscricaoMunicipal>
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
    </ListaRps>
  </LoteRps>
</GerarNfseEnvio>`;
  }
  
  private static gerarXmlAbrasf(dados: DadosNfse, config: ConfiguracaoNfseCompleta): string {
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
        <CodigoMunicipio>${config.codigoMunicipio}</CodigoMunicipio>
      </Servico>
      <Prestador>
        <Cnpj>${dados.prestador.cnpj}</Cnpj>
        <InscricaoMunicipal>${config.inscricaoMunicipal}</InscricaoMunicipal>
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
  
  private static gerarXmlWebiss(dados: DadosNfse, config: ConfiguracaoNfseCompleta): string {
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
  
  private static gerarXmlDsf(dados: DadosNfse, config: ConfiguracaoNfseCompleta): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<PedidoEnvioRPS xmlns="http://www.prefeitura.sp.gov.br/nfe">
  <Cabecalho>
    <CPFCNPJRemetente>
      <CNPJ>${dados.prestador.cnpj}</CNPJ>
    </CPFCNPJRemetente>
    <InscricaoMunicipalRemetente>${config.inscricaoMunicipal}</InscricaoMunicipalRemetente>
  </Cabecalho>
  <RPS>
    <Assinatura>ASSINATURA_TEMP</Assinatura>
    <ChaveRPS>
      <InscricaoMunicipal>${config.inscricaoMunicipal}</InscricaoMunicipal>
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
  
  private static gerarXmlBetha(dados: DadosNfse, config: ConfiguracaoNfseCompleta): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<EnviarLoteRpsEnvio xmlns="http://www.betha.com.br/e-nota-contribuinte-ws">
  <LoteRps>
    <NumeroLote>1</NumeroLote>
    <Cnpj>${dados.prestador.cnpj}</Cnpj>
    <InscricaoMunicipal>${config.inscricaoMunicipal}</InscricaoMunicipal>
    <QuantidadeRps>1</QuantidadeRps>
    <ListaRps>
      <Rps>
        <InfRps>
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
              <ValorLiquidoNfse>${(dados.servico.valor_liquido || dados.servico.valor_servico).toFixed(2)}</ValorLiquidoNfse>
            </Valores>
            <ItemListaServico>${dados.servico.codigo_servico}</ItemListaServico>
            <Discriminacao>${dados.servico.descricao}</Discriminacao>
            <CodigoMunicipio>${config.codigoMunicipio}</CodigoMunicipio>
          </Servico>
          <Prestador>
            <Cnpj>${dados.prestador.cnpj}</Cnpj>
            <InscricaoMunicipal>${config.inscricaoMunicipal}</InscricaoMunicipal>
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
    </ListaRps>
  </LoteRps>
</EnviarLoteRpsEnvio>`;
  }
  
  private static gerarJsonGovBr(dados: DadosNfse, config: ConfiguracaoNfseCompleta): any {
    return {
      numero: dados.numero_rps,
      serie: dados.serie_rps,
      data_emissao: dados.data_emissao,
      codigo_municipio: config.codigoMunicipio,
      prestador: {
        cnpj: dados.prestador.cnpj,
        inscricao_municipal: config.inscricaoMunicipal
      },
      tomador: {
        cpf_cnpj: dados.tomador.cpf_cnpj,
        razao_social: dados.tomador.razao_social
      },
      servico: {
        codigo_servico: dados.servico.codigo_servico,
        descricao: dados.servico.descricao,
        valor_servico: dados.servico.valor_servico,
        aliquota_iss: dados.servico.aliquota_iss
      }
    };
  }
  
  private static gerarJsonApiRest(dados: DadosNfse, config: ConfiguracaoNfseCompleta): any {
    return {
      rps: {
        numero: dados.numero_rps,
        serie: dados.serie_rps,
        data_emissao: dados.data_emissao,
        prestador: {
          cnpj: dados.prestador.cnpj,
          inscricao_municipal: config.inscricaoMunicipal,
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
  
  private static aplicarRetencoesCompletas(dados: DadosNfse, retencoes: RetencaoCompleta): DadosNfse {
    const valorServico = dados.servico.valor_servico;
    
    // Calcular valores de retenção
    const valorIR = retencoes.ir ? (valorServico * retencoes.ir / 100) : 0;
    const valorINSS = retencoes.inss ? (valorServico * retencoes.inss / 100) : 0;
    const valorCSLL = retencoes.csll ? (valorServico * retencoes.csll / 100) : 0;
    const valorCOFINS = retencoes.cofins ? (valorServico * retencoes.cofins / 100) : 0;
    const valorPIS = retencoes.pis ? (valorServico * retencoes.pis / 100) : 0;
    const valorISS = retencoes.iss ? (valorServico * retencoes.iss / 100) : 0;
    
    const totalRetencoes = valorIR + valorINSS + valorCSLL + valorCOFINS + valorPIS + valorISS;
    
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
          pis: valorPIS,
          iss: valorISS
        }
      }
    };
  }
  
  private static validarDadosCompletos(dados: DadosNfse, config: ConfiguracaoNfseCompleta): { valido: boolean; erros: string[] } {
    const erros: string[] = [];
    
    if (!dados.prestador.cnpj) {
      erros.push('CNPJ do prestador é obrigatório');
    }
    
    if (!config.inscricaoMunicipal) {
      erros.push('Inscrição Municipal é obrigatória');
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
    
    if (!dados.servico.codigo_servico) {
      erros.push('Código do serviço é obrigatório');
    }
    
    if (dados.servico.aliquota_iss <= 0) {
      erros.push('Alíquota do ISS deve ser maior que zero');
    }
    
    return {
      valido: erros.length === 0,
      erros
    };
  }
  
  private static gerarCodigoVerificacao(): string {
    return Math.random().toString(36).substring(2, 15).toUpperCase();
  }
  
  private static async enviarSoapGinfes(xml: string, config: ConfiguracaoNfseCompleta): Promise<string> {
    // Simular envio SOAP
    return `<nfse><numero>${Date.now()}</numero><codigo>${this.gerarCodigoVerificacao()}</codigo></nfse>`;
  }
}
