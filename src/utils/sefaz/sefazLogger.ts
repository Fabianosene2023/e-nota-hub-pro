
/**
 * SEFAZ logging utilities
 */
export interface LogSEFAZ {
  operacao: string;
  empresa_id: string;
  chave_acesso?: string;
  xml_enviado?: string;
  xml_retorno?: string;
  codigo_retorno: string;
  mensagem_retorno: string;
  tempo_resposta_ms: number;
  ip_origem?: string;
  user_agent?: string;
  timestamp: string;
}

export class SefazLogger {
  /**
   * Logs SEFAZ operation for audit purposes
   */
  static async gravarLog(log: LogSEFAZ): Promise<void> {
    try {
      console.log('=== LOG SEFAZ ===');
      console.log(`Operação: ${log.operacao}`);
      console.log(`Empresa ID: ${log.empresa_id}`);
      console.log(`Chave de Acesso: ${log.chave_acesso || 'N/A'}`);
      console.log(`Código Retorno: ${log.codigo_retorno}`);
      console.log(`Mensagem: ${log.mensagem_retorno}`);
      console.log(`Tempo Resposta: ${log.tempo_resposta_ms}ms`);
      console.log(`Timestamp: ${log.timestamp}`);
      
      if (log.xml_enviado) {
        console.log('XML Enviado (primeiros 200 chars):', log.xml_enviado.substring(0, 200) + '...');
      }
      
      if (log.xml_retorno) {
        console.log('XML Retorno (primeiros 200 chars):', log.xml_retorno.substring(0, 200) + '...');
      }
      
      console.log('==================');
      
      // TODO: Salvar no banco de dados para auditoria
    } catch (error) {
      console.error('Erro ao gravar log SEFAZ:', error);
    }
  }
}
