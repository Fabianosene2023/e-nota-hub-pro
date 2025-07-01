
import { SoapClient } from './soapClient';

export interface ConfiguracaoSEFAZ {
  ambiente: 'homologacao' | 'producao';
  uf: string;
  certificado: {
    conteudo: string;
    senha: string;
  };
  timeout?: number;
}

export interface RetornoSEFAZ {
  success: boolean;
  protocolo?: string;
  chave_acesso?: string;
  codigo_retorno?: string;
  mensagem_retorno?: string;
  xml_retorno?: string;
  xml_nfe_proc?: string;
  tempo_resposta?: number;
}

export class SefazWebService {
  
  private static readonly ENDPOINTS_HOMOLOGACAO = {
    'SP': 'https://homologacao.nfe.fazenda.sp.gov.br/ws/nfeautorizacao4.asmx',
    'RJ': 'https://nfe.fazenda.rj.gov.br/service/NfeAutorizacao4.asmx',
    'MG': 'https://hnfe.fazenda.mg.gov.br/nfe2/services/NFeAutorizacao4',
    'RS': 'https://nfe-homologacao.sefazrs.rs.gov.br/ws/NfeAutorizacao/NfeAutorizacao4.asmx',
    'PR': 'https://homologacao.nfe.sefa.pr.gov.br/nfe/NFeAutorizacao4',
    // Adicionar outros estados conforme necessário
  };

  private static readonly ENDPOINTS_PRODUCAO = {
    'SP': 'https://nfe.fazenda.sp.gov.br/ws/nfeautorizacao4.asmx',
    'RJ': 'https://nfe.fazenda.rj.gov.br/service/NfeAutorizacao4.asmx',
    'MG': 'https://nfe.fazenda.mg.gov.br/nfe2/services/NFeAutorizacao4',
    'RS': 'https://nfe.sefazrs.rs.gov.br/ws/NfeAutorizacao/NfeAutorizacao4.asmx',
    'PR': 'https://nfe.sefa.pr.gov.br/nfe/NFeAutorizacao4',
    // Adicionar outros estados conforme necessário
  };

  /**
   * Envia NFe para autorização na SEFAZ
   */
  public static async enviarNFeParaAutorizacao(
    xmlNFe: string,
    configuracao: ConfiguracaoSEFAZ
  ): Promise<RetornoSEFAZ> {
    const startTime = Date.now();
    
    try {
      const endpoint = this.obterEndpoint(configuracao.ambiente, configuracao.uf);
      if (!endpoint) {
        return {
          success: false,
          codigo_retorno: '999',
          mensagem_retorno: `Endpoint não configurado para UF: ${configuracao.uf}`,
          tempo_resposta: Date.now() - startTime
        };
      }

      const loteId = this.gerarNumeroLote();
      const soapEnvelope = SoapClient.criarEnvelopeAutorizacao(xmlNFe, loteId);
      const soapAction = 'http://www.portalfiscal.inf.br/nfe/wsdl/NFeAutorizacao4/nfeAutorizacaoLote';

      console.log(`Enviando NFe para SEFAZ - Ambiente: ${configuracao.ambiente}, UF: ${configuracao.uf}`);

      const soapResponse = await SoapClient.enviarSOAP(endpoint, soapEnvelope, soapAction, configuracao);
      
      if (!soapResponse.success) {
        return {
          success: false,
          codigo_retorno: '999',
          mensagem_retorno: soapResponse.error || 'Erro na comunicação SOAP',
          tempo_resposta: Date.now() - startTime
        };
      }

      // Parsear resposta da SEFAZ
      const dadosResposta = SoapClient.parsearRespostaSEFAZ(soapResponse.responseBody || '');
      
      const retorno: RetornoSEFAZ = {
        success: dadosResposta.cStat === '100',
        protocolo: dadosResposta.protocolo,
        chave_acesso: dadosResposta.chaveAcesso,
        codigo_retorno: dadosResposta.cStat,
        mensagem_retorno: dadosResposta.xMotivo,
        xml_retorno: dadosResposta.xmlRetorno,
        tempo_resposta: Date.now() - startTime
      };

      // Se sucesso, gerar XML nfeProc
      if (retorno.success && retorno.protocolo && retorno.chave_acesso) {
        retorno.xml_nfe_proc = this.gerarXMLNFeProc(
          xmlNFe, 
          retorno.protocolo, 
          retorno.chave_acesso,
          dadosResposta.dhRecbto || new Date().toISOString()
        );
      }

      return retorno;

    } catch (error) {
      return {
        success: false,
        codigo_retorno: '999',
        mensagem_retorno: `Erro na comunicação com SEFAZ: ${error instanceof Error ? error.message : String(error)}`,
        tempo_resposta: Date.now() - startTime
      };
    }
  }

  /**
   * Consulta situação da NFe na SEFAZ
   */
  public static async consultarNFe(
    chaveAcesso: string,
    configuracao: ConfiguracaoSEFAZ
  ): Promise<RetornoSEFAZ> {
    const startTime = Date.now();
    
    try {
      const endpoint = this.obterEndpointConsulta(configuracao.ambiente, configuracao.uf);
      if (!endpoint) {
        return {
          success: false,
          codigo_retorno: '999',
          mensagem_retorno: `Endpoint de consulta não configurado para UF: ${configuracao.uf}`,
          tempo_resposta: Date.now() - startTime
        };
      }

      console.log(`Consultando NFe na SEFAZ - Chave: ${chaveAcesso}`);
      
      const soapEnvelope = SoapClient.criarEnvelopeConsulta(chaveAcesso);
      const soapAction = 'http://www.portalfiscal.inf.br/nfe/wsdl/NFeConsultaProtocolo4/nfeConsultaNF';

      const soapResponse = await SoapClient.enviarSOAP(endpoint, soapEnvelope, soapAction, configuracao);
      
      if (!soapResponse.success) {
        return {
          success: false,
          codigo_retorno: '999',
          mensagem_retorno: soapResponse.error || 'Erro na comunicação SOAP',
          tempo_resposta: Date.now() - startTime
        };
      }

      const dadosResposta = SoapClient.parsearRespostaSEFAZ(soapResponse.responseBody || '');
      
      return {
        success: dadosResposta.cStat === '100',
        chave_acesso: chaveAcesso,
        codigo_retorno: dadosResposta.cStat,
        mensagem_retorno: dadosResposta.xMotivo,
        xml_retorno: dadosResposta.xmlRetorno,
        tempo_resposta: Date.now() - startTime
      };

    } catch (error) {
      return {
        success: false,
        codigo_retorno: '999',
        mensagem_retorno: `Erro na consulta: ${error instanceof Error ? error.message : String(error)}`,
        tempo_resposta: Date.now() - startTime
      };
    }
  }

  /**
   * Cancela NFe na SEFAZ
   */
  public static async cancelarNFe(
    chaveAcesso: string,
    justificativa: string,
    configuracao: ConfiguracaoSEFAZ
  ): Promise<RetornoSEFAZ> {
    const startTime = Date.now();
    
    try {
      if (justificativa.length < 15) {
        return {
          success: false,
          codigo_retorno: '999',
          mensagem_retorno: 'Justificativa deve ter pelo menos 15 caracteres',
          tempo_resposta: Date.now() - startTime
        };
      }

      const endpoint = this.obterEndpointEvento(configuracao.ambiente, configuracao.uf);
      if (!endpoint) {
        return {
          success: false,
          codigo_retorno: '999',
          mensagem_retorno: `Endpoint de evento não configurado para UF: ${configuracao.uf}`,
          tempo_resposta: Date.now() - startTime
        };
      }

      console.log(`Cancelando NFe na SEFAZ - Chave: ${chaveAcesso}`);
      
      const soapEnvelope = SoapClient.criarEnvelopeCancelamento(chaveAcesso, justificativa, '1');
      const soapAction = 'http://www.portalfiscal.inf.br/nfe/wsdl/NFeRecepcaoEvento4/nfeRecepcaoEvento';

      const soapResponse = await SoapClient.enviarSOAP(endpoint, soapEnvelope, soapAction, configuracao);
      
      if (!soapResponse.success) {
        return {
          success: false,
          codigo_retorno: '999',
          mensagem_retorno: soapResponse.error || 'Erro na comunicação SOAP',
          tempo_resposta: Date.now() - startTime
        };
      }

      const dadosResposta = SoapClient.parsearRespostaSEFAZ(soapResponse.responseBody || '');
      
      return {
        success: dadosResposta.cStat === '135',
        chave_acesso: chaveAcesso,
        codigo_retorno: dadosResposta.cStat,
        mensagem_retorno: dadosResposta.xMotivo,
        xml_retorno: dadosResposta.xmlRetorno,
        tempo_resposta: Date.now() - startTime
      };

    } catch (error) {
      return {
        success: false,
        codigo_retorno: '999',
        mensagem_retorno: `Erro no cancelamento: ${error instanceof Error ? error.message : String(error)}`,
        tempo_resposta: Date.now() - startTime
      };
    }
  }

  private static obterEndpoint(ambiente: 'homologacao' | 'producao', uf: string): string | undefined {
    const endpoints = ambiente === 'producao' ? this.ENDPOINTS_PRODUCAO : this.ENDPOINTS_HOMOLOGACAO;
    return endpoints[uf as keyof typeof endpoints];
  }

  private static obterEndpointConsulta(ambiente: 'homologacao' | 'producao', uf: string): string | undefined {
    // Em produção, usar endpoints específicos de consulta
    return this.obterEndpoint(ambiente, uf);
  }

  private static obterEndpointEvento(ambiente: 'homologacao' | 'producao', uf: string): string | undefined {
    // Em produção, usar endpoints específicos de evento
    return this.obterEndpoint(ambiente, uf);
  }

  private static gerarNumeroLote(): string {
    return Date.now().toString().slice(-10);
  }

  private static gerarXMLNFeProc(xmlNFe: string, protocolo: string, chaveAcesso: string, dhRecbto: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
  ${xmlNFe}
  <protNFe xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
    <infProt>
      <tpAmb>2</tpAmb>
      <verAplic>SP_NFE_PL_008i2</verAplic>
      <chNFe>${chaveAcesso}</chNFe>
      <dhRecbto>${dhRecbto}</dhRecbto>
      <nProt>${protocolo}</nProt>
      <digVal>DIGEST_VALUE_PLACEHOLDER</digVal>
      <cStat>100</cStat>
      <xMotivo>Autorizado o uso da NF-e</xMotivo>
    </infProt>
  </protNFe>
</nfeProc>`;
  }
}
