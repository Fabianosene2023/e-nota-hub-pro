
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
    return XMLGenerator.gerarXMLNFe(dados);
  }

  /**
   * Sign XML with digital certificate
   */
  public static async assinarXML(xmlContent: string, certificado: {
    conteudo: string;
    senha: string;
  }): Promise<string> {
    return SignatureService.assinarXML(xmlContent, certificado);
  }
}
