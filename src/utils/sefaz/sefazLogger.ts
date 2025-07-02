
export interface LogSEFAZ {
  operacao: string;
  empresa_id: string;
  chave_acesso?: string;
  xml_enviado?: string;
  resultado: any;
  timestamp: Date;
}

/**
 * SEFAZ Operations Logger
 */
export class SefazLogger {
  private static logs: LogSEFAZ[] = [];
  
  public static async logOperacao(
    operacao: string,
    empresaId: string,
    chaveAcesso: string | undefined,
    xmlEnviado: string | undefined,
    resultado: any
  ): Promise<void> {
    const log: LogSEFAZ = {
      operacao,
      empresa_id: empresaId,
      chave_acesso: chaveAcesso,
      xml_enviado: xmlEnviado,
      resultado,
      timestamp: new Date()
    };
    
    // Em produção, salvar no banco de dados
    this.logs.push(log);
    
    console.log(`SEFAZ Log [${operacao}]:`, {
      empresa_id: empresaId,
      chave_acesso: chaveAcesso?.substring(0, 8) + '...',
      success: resultado.success,
      codigo_retorno: resultado.codigo_retorno,
      mensagem: resultado.mensagem_retorno?.substring(0, 100),
      tempo_resposta: resultado.tempo_resposta
    });
  }
  
  public static obterLogs(empresaId?: string): LogSEFAZ[] {
    if (empresaId) {
      return this.logs.filter(log => log.empresa_id === empresaId);
    }
    return this.logs;
  }
  
  public static limparLogs(): void {
    this.logs = [];
  }
}
