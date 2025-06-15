
import { supabase } from '@/integrations/supabase/client';

export interface DadosNFSe {
  prestador: {
    cnpj: string;
    inscricao_municipal: string;
    razao_social: string;
  };
  tomador: {
    cpf_cnpj: string;
    razao_social: string;
    endereco?: string;
    email?: string;
  };
  servico: {
    codigo_servico: string;
    descricao: string;
    valor_servico: number;
    aliquota_iss?: number;
  };
  numero_rps: number;
  serie_rps: string;
  data_emissao: string;
}

export interface RetornoNFSe {
  success: boolean;
  numero_nfse?: string;
  codigo_verificacao?: string;
  data_emissao?: string;
  valor_total?: number;
  xml_nfse?: string;
  pdf_url?: string;
  protocolo?: string;
  erro?: string;
  codigo_erro?: string;
}

/**
 * Serviço de integração com NFSe de Uberaba-MG
 * Implementa comunicação com o webservice municipal
 */
export class UberabaNFSeService {
  private static readonly ENDPOINT_HOMOLOGACAO = 'https://nfse-hom.uberaba.mg.gov.br/ws/nfse.asmx';
  private static readonly ENDPOINT_PRODUCAO = 'https://nfse.uberaba.mg.gov.br/ws/nfse.asmx';

  /**
   * Emite NFSe no sistema de Uberaba
   */
  static async emitirNFSe(
    dadosNFSe: DadosNFSe,
    ambiente: 'homologacao' | 'producao' = 'homologacao'
  ): Promise<RetornoNFSe> {
    try {
      console.log('Iniciando emissão NFSe Uberaba:', dadosNFSe);

      // Gerar XML RPS
      const xmlRps = this.gerarXmlRps(dadosNFSe);
      
      // Selecionar endpoint
      const endpoint = ambiente === 'producao' 
        ? this.ENDPOINT_PRODUCAO 
        : this.ENDPOINT_HOMOLOGACAO;

      // Em ambiente de desenvolvimento, simular a resposta
      if (process.env.NODE_ENV === 'development') {
        return this.simularResposta(dadosNFSe);
      }

      // Fazer chamada real para o webservice
      const response = await this.chamarWebservice(endpoint, xmlRps);
      
      return this.processarResposta(response);

    } catch (error) {
      console.error('Erro na emissão NFSe:', error);
      return {
        success: false,
        erro: error instanceof Error ? error.message : 'Erro desconhecido',
        codigo_erro: 'ERRO_EMISSAO'
      };
    }
  }

  /**
   * Consulta NFSe por número
   */
  static async consultarNFSe(
    numero: string,
    prestadorCnpj: string,
    ambiente: 'homologacao' | 'producao' = 'homologacao'
  ): Promise<RetornoNFSe> {
    try {
      const endpoint = ambiente === 'producao' 
        ? this.ENDPOINT_PRODUCAO 
        : this.ENDPOINT_HOMOLOGACAO;

      const xmlConsulta = this.gerarXmlConsulta(numero, prestadorCnpj);
      
      if (process.env.NODE_ENV === 'development') {
        return {
          success: true,
          numero_nfse: numero,
          codigo_verificacao: '12345',
          data_emissao: new Date().toISOString(),
          valor_total: 100
        };
      }

      const response = await this.chamarWebservice(endpoint, xmlConsulta, 'ConsultarNfse');
      return this.processarResposta(response);

    } catch (error) {
      console.error('Erro na consulta NFSe:', error);
      return {
        success: false,
        erro: error instanceof Error ? error.message : 'Erro na consulta',
        codigo_erro: 'ERRO_CONSULTA'
      };
    }
  }

  /**
   * Gera XML do RPS para Uberaba
   */
  private static gerarXmlRps(dados: DadosNFSe): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:nfse="http://nfse.uberaba.mg.gov.br/">
  <soap:Header/>
  <soap:Body>
    <nfse:GerarNfse>
      <nfse:xml>
        <![CDATA[
          <Rps>
            <InfRps>
              <Numero>${dados.numero_rps}</Numero>
              <Serie>${dados.serie_rps}</Serie>
              <Tipo>1</Tipo>
              <DataEmissao>${dados.data_emissao}</DataEmissao>
              <Situacao>1</Situacao>
              <ServicosPrestados>
                <Servico>
                  <CodigoServico>${dados.servico.codigo_servico}</CodigoServico>
                  <Discriminacao>${dados.servico.descricao}</Discriminacao>
                  <ValorServicos>${dados.servico.valor_servico}</ValorServicos>
                  <AliquotaIss>${dados.servico.aliquota_iss || 5}</AliquotaIss>
                </Servico>
              </ServicosPrestados>
              <Prestador>
                <Cnpj>${dados.prestador.cnpj}</Cnpj>
                <InscricaoMunicipal>${dados.prestador.inscricao_municipal}</InscricaoMunicipal>
                <RazaoSocial>${dados.prestador.razao_social}</RazaoSocial>
              </Prestador>
              <Tomador>
                <CpfCnpj>${dados.tomador.cpf_cnpj}</CpfCnpj>
                <RazaoSocial>${dados.tomador.razao_social}</RazaoSocial>
                ${dados.tomador.endereco ? `<Endereco>${dados.tomador.endereco}</Endereco>` : ''}
                ${dados.tomador.email ? `<Email>${dados.tomador.email}</Email>` : ''}
              </Tomador>
            </InfRps>
          </Rps>
        ]]>
      </nfse:xml>
    </nfse:GerarNfse>
  </soap:Body>
</soap:Envelope>`;
  }

  /**
   * Gera XML de consulta
   */
  private static gerarXmlConsulta(numero: string, cnpjPrestador: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:nfse="http://nfse.uberaba.mg.gov.br/">
  <soap:Header/>
  <soap:Body>
    <nfse:ConsultarNfse>
      <nfse:xml>
        <![CDATA[
          <ConsultarNfseEnvio>
            <Prestador>
              <Cnpj>${cnpjPrestador}</Cnpj>
            </Prestador>
            <NumeroNfse>${numero}</NumeroNfse>
          </ConsultarNfseEnvio>
        ]]>
      </nfse:xml>
    </nfse:ConsultarNfse>
  </soap:Body>
</soap:Envelope>`;
  }

  /**
   * Chama o webservice municipal
   */
  private static async chamarWebservice(
    endpoint: string, 
    xmlData: string, 
    action: string = 'GerarNfse'
  ): Promise<string> {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': `http://nfse.uberaba.mg.gov.br/${action}`,
      },
      body: xmlData,
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    return await response.text();
  }

  /**
   * Processa resposta do webservice
   */
  private static processarResposta(xmlResponse: string): RetornoNFSe {
    try {
      // Simular processamento do XML de resposta
      // Em implementação real, usar DOMParser ou biblioteca XML
      
      if (xmlResponse.includes('erro') || xmlResponse.includes('fault')) {
        return {
          success: false,
          erro: 'Erro retornado pelo webservice',
          codigo_erro: 'ERRO_WEBSERVICE'
        };
      }

      return {
        success: true,
        numero_nfse: this.extrairValorXml(xmlResponse, 'NumeroNfse') || '',
        codigo_verificacao: this.extrairValorXml(xmlResponse, 'CodigoVerificacao') || '',
        data_emissao: new Date().toISOString(),
        valor_total: 100,
        xml_nfse: xmlResponse
      };

    } catch (error) {
      return {
        success: false,
        erro: 'Erro ao processar resposta',
        codigo_erro: 'ERRO_PROCESSAMENTO'
      };
    }
  }

  /**
   * Simula resposta para desenvolvimento
   */
  private static simularResposta(dados: DadosNFSe): RetornoNFSe {
    // Simular sucesso em 90% dos casos
    const sucesso = Math.random() > 0.1;
    
    if (sucesso) {
      const numeroNfse = Math.floor(Math.random() * 100000) + 1;
      return {
        success: true,
        numero_nfse: numeroNfse.toString(),
        codigo_verificacao: Math.random().toString(36).substr(2, 8).toUpperCase(),
        data_emissao: new Date().toISOString(),
        valor_total: dados.servico.valor_servico,
        protocolo: `UBERABA${Date.now()}`
      };
    } else {
      return {
        success: false,
        erro: 'Dados do prestador inválidos (simulado)',
        codigo_erro: 'E001'
      };
    }
  }

  /**
   * Extrai valor de elemento XML
   */
  private static extrairValorXml(xml: string, elemento: string): string | null {
    const regex = new RegExp(`<${elemento}>(.*?)<\/${elemento}>`, 'i');
    const match = xml.match(regex);
    return match ? match[1] : null;
  }
}
