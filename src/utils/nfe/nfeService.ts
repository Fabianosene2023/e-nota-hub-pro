
import { DadosNFeCompletos, RetornoNFe } from './types';
import { XMLGenerator } from './xmlGenerator';
import { SignatureService } from './signatureService';
import { SefazWebService, ConfiguracaoSEFAZ } from './sefazWebService';
import { XSDValidator } from './validation/xsdValidator';
import { DANFEGenerator, DadosDANFE } from './danfeGenerator';

/**
 * Main NFE service that orchestrates all NFe operations
 */
export class NFEService {
  
  /**
   * Generate NFe XML
   */
  public static gerarXMLNFe(dados: DadosNFeCompletos): string {
    if (!dados) {
      throw new Error('Dados da NF-e são obrigatórios para gerar o XML.');
    }
    return XMLGenerator.gerarXMLNFe(dados);
  }

  /**
   * Sign XML with digital certificate
   */
  public static async assinarXML(xmlContent: string, certificado: {
    conteudo: string;
    senha: string;
  }): Promise<string> {
    if (!xmlContent) {
      throw new Error('Conteúdo XML é obrigatório para assinatura.');
    }
    if (!certificado?.conteudo || !certificado?.senha) {
      throw new Error('Certificado inválido. Conteúdo e senha são necessários.');
    }

    try {
      return await SignatureService.assinarXML(xmlContent, certificado);
    } catch (error) {
      throw new Error(`Erro ao assinar XML: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Validate XML against XSD schema
   */
  public static async validarXML(xmlContent: string) {
    return await XSDValidator.validarXMLNFe(xmlContent);
  }

  /**
   * Send NFe to SEFAZ for authorization
   */
  public static async enviarParaSefaz(
    dados: DadosNFeCompletos,
    configuracao: ConfiguracaoSEFAZ
  ): Promise<RetornoNFe> {
    try {
      // 1. Gerar XML
      const xmlNFe = this.gerarXMLNFe(dados);

      // 2. Validar XML
      const validacao = await this.validarXML(xmlNFe);
      if (!validacao.valid) {
        return {
          success: false,
          erro: `XML inválido: ${validacao.errors.join(', ')}`
        };
      }

      // 3. Assinar XML
      const xmlAssinado = await this.assinarXML(xmlNFe, configuracao.certificado);

      // 4. Enviar para SEFAZ
      const retornoSefaz = await SefazWebService.enviarNFeParaAutorizacao(xmlAssinado, configuracao);

      return {
        success: retornoSefaz.success,
        chave_acesso: retornoSefaz.chave_acesso,
        protocolo: retornoSefaz.protocolo,
        xml_nfe: xmlAssinado,
        xml_nfe_proc: retornoSefaz.xml_nfe_proc,
        codigo_status: retornoSefaz.codigo_retorno,
        mensagem: retornoSefaz.mensagem_retorno,
        erro: retornoSefaz.success ? undefined : retornoSefaz.mensagem_retorno
      };

    } catch (error) {
      return {
        success: false,
        erro: error instanceof Error ? error.message : 'Erro desconhecido na emissão da NFe'
      };
    }
  }

  /**
   * Query NFe status on SEFAZ
   */
  public static async consultarNFe(
    chaveAcesso: string,
    configuracao: ConfiguracaoSEFAZ
  ): Promise<RetornoNFe> {
    try {
      const retorno = await SefazWebService.consultarNFe(chaveAcesso, configuracao);
      
      return {
        success: retorno.success,
        chave_acesso: retorno.chave_acesso,
        protocolo: retorno.protocolo,
        codigo_status: retorno.codigo_retorno,
        mensagem: retorno.mensagem_retorno,
        xml_nfe_proc: retorno.xml_retorno,
        erro: retorno.success ? undefined : retorno.mensagem_retorno
      };

    } catch (error) {
      return {
        success: false,
        erro: error instanceof Error ? error.message : 'Erro na consulta da NFe'
      };
    }
  }

  /**
   * Cancel NFe on SEFAZ
   */
  public static async cancelarNFe(
    chaveAcesso: string,
    justificativa: string,
    configuracao: ConfiguracaoSEFAZ
  ): Promise<RetornoNFe> {
    try {
      const retorno = await SefazWebService.cancelarNFe(chaveAcesso, justificativa, configuracao);
      
      return {
        success: retorno.success,
        chave_acesso: retorno.chave_acesso,
        protocolo: retorno.protocolo,
        codigo_status: retorno.codigo_retorno,
        mensagem: retorno.mensagem_retorno,
        erro: retorno.success ? undefined : retorno.mensagem_retorno
      };

    } catch (error) {
      return {
        success: false,
        erro: error instanceof Error ? error.message : 'Erro no cancelamento da NFe'
      };
    }
  }

  /**
   * Generate DANFE HTML
   */
  public static gerarDANFE(dados: DadosNFeCompletos, chaveAcesso: string, protocolo?: string): string {
    const dadosDANFE: DadosDANFE = {
      chave_acesso: chaveAcesso,
      protocolo,
      data_emissao: dados.nota.data_emissao,
      numero_nfe: dados.nota.numero,
      serie: dados.nota.serie,
      empresa: dados.empresa,
      cliente: dados.cliente,
      itens: dados.itens,
      totais: {
        valor_produtos: dados.nota.valor_total,
        valor_frete: dados.nota.freight_value || 0,
        valor_seguro: dados.nota.insurance_value || 0,
        valor_total: dados.nota.valor_total + (dados.nota.freight_value || 0) + (dados.nota.insurance_value || 0)
      },
      observacoes: dados.nota.observacoes
    };

    return DANFEGenerator.gerarHTMLDANFE(dadosDANFE);
  }

  /**
   * Complete NFe emission process
   */
  public static async emitirNFeCompleta(
    dados: DadosNFeCompletos,
    configuracao: ConfiguracaoSEFAZ
  ): Promise<{
    nfe: RetornoNFe;
    danfe_html?: string;
    danfe_url?: string;
  }> {
    try {
      // Emitir NFe
      const resultadoNFe = await this.enviarParaSefaz(dados, configuracao);
      
      if (!resultadoNFe.success) {
        return { nfe: resultadoNFe };
      }

      // Gerar DANFE se sucesso
      let danfe_html: string | undefined;
      let danfe_url: string | undefined;

      if (resultadoNFe.chave_acesso) {
        danfe_html = this.gerarDANFE(dados, resultadoNFe.chave_acesso, resultadoNFe.protocolo);
        
        // Em produção, salvar DANFE em storage e retornar URL
        danfe_url = `data:text/html;base64,${btoa(danfe_html)}`;
      }

      return {
        nfe: resultadoNFe,
        danfe_html,
        danfe_url
      };

    } catch (error) {
      return {
        nfe: {
          success: false,
          erro: error instanceof Error ? error.message : 'Erro na emissão completa da NFe'
        }
      };
    }
  }
}
