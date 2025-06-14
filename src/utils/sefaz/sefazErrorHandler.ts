
import { ERROS_SEFAZ } from './sefazConfig';

/**
 * SEFAZ error handling utilities
 */
export class SefazErrorHandler {
  /**
   * Treats SEFAZ errors in a standardized way
   */
  static tratarErroSEFAZ(codigoRetorno: string, mensagemRetorno: string): string {
    const mensagemAmigavel = ERROS_SEFAZ[codigoRetorno as keyof typeof ERROS_SEFAZ];
    return mensagemAmigavel || mensagemRetorno || 'Erro desconhecido na comunicação com SEFAZ';
  }

  /**
   * Gets endpoint based on environment and UF
   */
  static obterEndpoint(ambiente: 'homologacao' | 'producao', uf: string, endpoints: Record<string, string>): string | null {
    return endpoints[uf] || null;
  }
}
