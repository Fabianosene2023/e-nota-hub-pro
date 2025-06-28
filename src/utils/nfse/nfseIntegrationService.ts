
import { NfseXmlGenerator, DadosNfse } from './nfseXmlGenerator';

export interface NfseResponse {
  success: boolean;
  numero_nfse?: string;
  codigo_verificacao?: string;
  protocolo?: string;
  data_emissao?: string;
  valor_total?: number;
  xml_nfse?: string;
  erro?: string;
}

export class NfseIntegrationService {
  static async emitirNfseGinfes(
    dados: DadosNfse,
    urlWebservice: string,
    ambiente: 'homologacao' | 'producao'
  ): Promise<NfseResponse> {
    try {
      const xmlRps = NfseXmlGenerator.gerarXmlRpsGinfes(dados);
      
      // Simular resposta para desenvolvimento
      if (ambiente === 'homologacao') {
        return {
          success: true,
          numero_nfse: `${Date.now()}`,
          codigo_verificacao: `${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          protocolo: `PROT${Date.now()}`,
          data_emissao: new Date().toISOString().split('T')[0],
          valor_total: dados.servico.valor_servico,
          xml_nfse: xmlRps
        };
      }

      // Integração real com webservice
      const response = await fetch(urlWebservice, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/soap+xml; charset=utf-8',
          'SOAPAction': 'http://www.ginfes.com.br/servico_enviar_lote_rps_envio'
        },
        body: `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
  <soap:Body>
    ${xmlRps}
  </soap:Body>
</soap:Envelope>`
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const xmlResponse = await response.text();
      
      // Parse da resposta XML (simplificado)
      // Em produção, usar um parser XML adequado
      const numeroNfseMatch = xmlResponse.match(/<Numero>(\d+)<\/Numero>/);
      const codigoVerificacaoMatch = xmlResponse.match(/<CodigoVerificacao>([^<]+)<\/CodigoVerificacao>/);
      
      if (numeroNfseMatch && codigoVerificacaoMatch) {
        return {
          success: true,
          numero_nfse: numeroNfseMatch[1],
          codigo_verificacao: codigoVerificacaoMatch[1],
          xml_nfse: xmlResponse,
          valor_total: dados.servico.valor_servico
        };
      } else {
        return {
          success: false,
          erro: 'Erro na resposta do webservice'
        };
      }
    } catch (error) {
      console.error('Erro na integração NFSe:', error);
      return {
        success: false,
        erro: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  static async consultarNfseGinfes(
    numeroNfse: string,
    cnpjPrestador: string,
    urlWebservice: string
  ): Promise<NfseResponse> {
    try {
      const xmlConsulta = NfseXmlGenerator.gerarXmlConsultaGinfes(numeroNfse, cnpjPrestador);
      
      const response = await fetch(urlWebservice, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/soap+xml; charset=utf-8',
          'SOAPAction': 'http://www.ginfes.com.br/servico_consultar_nfse'
        },
        body: `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
  <soap:Body>
    ${xmlConsulta}
  </soap:Body>
</soap:Envelope>`
      });

      const xmlResponse = await response.text();
      
      return {
        success: true,
        xml_nfse: xmlResponse
      };
    } catch (error) {
      return {
        success: false,
        erro: error instanceof Error ? error.message : 'Erro na consulta'
      };
    }
  }
}
