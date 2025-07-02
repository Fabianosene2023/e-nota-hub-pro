
import { RetornoSEFAZ } from '../sefazWebService';

/**
 * SEFAZ Error Handler
 */
export class SefazErrorHandler {
  
  public static obterEndpoint(
    ambiente: 'homologacao' | 'producao', 
    uf: string, 
    endpoints: Record<string, string>
  ): string | undefined {
    return endpoints[uf as keyof typeof endpoints];
  }
  
  public static tratarErroSefaz(error: unknown): string {
    if (error instanceof Error) {
      // Tratar erros específicos da SEFAZ
      if (error.message.includes('timeout')) {
        return 'Timeout na comunicação com SEFAZ';
      }
      
      if (error.message.includes('ENOTFOUND')) {
        return 'Erro de conectividade com SEFAZ';
      }
      
      if (error.message.includes('certificate')) {
        return 'Erro no certificado digital';
      }
      
      return error.message;
    }
    
    return 'Erro desconhecido na comunicação com SEFAZ';
  }
  
  public static interpretarStatusSefaz(cStat: string): string {
    const statusMap: Record<string, string> = {
      '100': 'NFe autorizada com sucesso',
      '101': 'Cancelamento autorizado',
      '102': 'Inutilização autorizada',
      '103': 'Lote recebido com sucesso',
      '104': 'Lote processado',
      '105': 'Lote em processamento',
      '110': 'Uso denegado',
      '135': 'Evento registrado e vinculado',
      '999': 'Erro interno'
    };
    
    return statusMap[cStat] || `Status desconhecido: ${cStat}`;
  }
}
