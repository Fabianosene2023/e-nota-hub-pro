import { DadosNFeCompletos, RetornoNFe } from './types';
import { XMLGenerator } from './xmlGenerator';
import { SignatureService } from './signatureService';

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
}
