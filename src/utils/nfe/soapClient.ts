
import { ConfiguracaoSEFAZ } from './sefazWebService';

export interface SoapResponse {
  success: boolean;
  statusCode?: number;
  responseBody?: string;
  error?: string;
}

export class SoapClient {
  
  /**
   * Send SOAP request to SEFAZ webservice
   */
  public static async enviarSOAP(
    endpoint: string,
    soapEnvelope: string,
    soapAction: string,
    configuracao: ConfiguracaoSEFAZ
  ): Promise<SoapResponse> {
    try {
      console.log('Enviando requisição SOAP para:', endpoint);
      console.log('SOAPAction:', soapAction);
      
      const headers: Record<string, string> = {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': soapAction,
        'User-Agent': 'Sistema_NFe_v4.00'
      };
      
      // Em produção, adicionar certificado SSL cliente se necessário
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: soapEnvelope,
        // Em produção, configurar timeout
        signal: AbortSignal.timeout(configuracao.timeout || 30000)
      });
      
      const responseBody = await response.text();
      
      console.log('Status da resposta SEFAZ:', response.status);
      console.log('Resposta SEFAZ (primeiros 500 chars):', responseBody.substring(0, 500));
      
      return {
        success: response.ok,
        statusCode: response.status,
        responseBody,
        error: response.ok ? undefined : `HTTP ${response.status}: ${response.statusText}`
      };
      
    } catch (error) {
      console.error('Erro na requisição SOAP:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido na comunicação SOAP'
      };
    }
  }
  
  /**
   * Parse SOAP response and extract useful data
   */
  public static parsearRespostaSEFAZ(responseBody: string): {
    cStat?: string;
    xMotivo?: string;
    protocolo?: string;
    chaveAcesso?: string;
    dhRecbto?: string;
    xmlRetorno?: string;
  } {
    try {
      // Extrair cStat
      const cStatMatch = responseBody.match(/<cStat>(\d+)<\/cStat>/);
      const cStat = cStatMatch ? cStatMatch[1] : undefined;
      
      // Extrair xMotivo
      const xMotivoMatch = responseBody.match(/<xMotivo>([^<]+)<\/xMotivo>/);
      const xMotivo = xMotivoMatch ? xMotivoMatch[1] : undefined;
      
      // Extrair protocolo
      const protocoloMatch = responseBody.match(/<nProt>(\d+)<\/nProt>/);
      const protocolo = protocoloMatch ? protocoloMatch[1] : undefined;
      
      // Extrair chave de acesso
      const chaveMatch = responseBody.match(/<chNFe>(\d{44})<\/chNFe>/);
      const chaveAcesso = chaveMatch ? chaveMatch[1] : undefined;
      
      // Extrair data/hora de recebimento
      const dhRecbtoMatch = responseBody.match(/<dhRecbto>([^<]+)<\/dhRecbto>/);
      const dhRecbto = dhRecbtoMatch ? dhRecbtoMatch[1] : undefined;
      
      return {
        cStat,
        xMotivo,
        protocolo,
        chaveAcesso,
        dhRecbto,
        xmlRetorno: responseBody
      };
      
    } catch (error) {
      console.error('Erro ao parsear resposta SEFAZ:', error);
      return { xmlRetorno: responseBody };
    }
  }
  
  /**
   * Create SOAP envelope for NFe authorization
   */
  public static criarEnvelopeAutorizacao(xmlNFe: string, loteId: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:nfe="http://www.portalfiscal.inf.br/nfe/wsdl/NFeAutorizacao4">
  <soap:Header/>
  <soap:Body>
    <nfe:nfeAutorizacaoLote>
      <nfe:nfeDadosMsg>
        <enviNFe xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
          <idLote>${loteId}</idLote>
          <indSinc>1</indSinc>
          ${xmlNFe}
        </enviNFe>
      </nfe:nfeDadosMsg>
    </nfe:nfeAutorizacaoLote>
  </soap:Body>
</soap:Envelope>`;
  }
  
  /**
   * Create SOAP envelope for NFe consultation
   */
  public static criarEnvelopeConsulta(chaveAcesso: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:nfe="http://www.portalfiscal.inf.br/nfe/wsdl/NFeConsultaProtocolo4">
  <soap:Header/>
  <soap:Body>
    <nfe:nfeConsultaNF>
      <nfe:nfeDadosMsg>
        <consSitNFe xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
          <tpAmb>2</tpAmb>
          <xServ>CONSULTAR</xServ>
          <chNFe>${chaveAcesso}</chNFe>
        </consSitNFe>
      </nfe:nfeDadosMsg>
    </nfe:nfeConsultaNF>
  </soap:Body>
</soap:Envelope>`;
  }
  
  /**
   * Create SOAP envelope for NFe cancellation
   */
  public static criarEnvelopeCancelamento(chaveAcesso: string, justificativa: string, sequencial: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:nfe="http://www.portalfiscal.inf.br/nfe/wsdl/NFeRecepcaoEvento4">
  <soap:Header/>
  <soap:Body>
    <nfe:nfeRecepcaoEvento>
      <nfe:nfeDadosMsg>
        <envEvento xmlns="http://www.portalfiscal.inf.br/nfe" versao="1.00">
          <idLote>1</idLote>
          <evento versao="1.00">
            <infEvento Id="ID110111${chaveAcesso}01">
              <cOrgao>35</cOrgao>
              <tpAmb>2</tpAmb>
              <CNPJ>12345678000195</CNPJ>
              <chNFe>${chaveAcesso}</chNFe>
              <dhEvento>${new Date().toISOString()}</dhEvento>
              <tpEvento>110111</tpEvento>
              <nSeqEvento>${sequencial}</nSeqEvento>
              <verEvento>1.00</verEvento>
              <detEvento versao="1.00">
                <descEvento>Cancelamento</descEvento>
                <nProt>123456789012345</nProt>
                <xJust>${justificativa}</xJust>
              </detEvento>
            </infEvento>
          </evento>
        </envEvento>
      </nfe:nfeDadosMsg>
    </nfe:nfeRecepcaoEvento>
  </soap:Body>
</soap:Envelope>`;
  }
}
