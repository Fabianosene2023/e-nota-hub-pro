
import { supabase } from '@/integrations/supabase/client';

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
  nota_fiscal_id?: string;
  protocolo?: string;
  status_operacao: 'sucesso' | 'erro' | 'pendente';
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
      console.log(`Status: ${log.status_operacao}`);
      console.log(`Timestamp: ${log.timestamp}`);
      
      if (log.xml_enviado) {
        console.log('XML Enviado (primeiros 200 chars):', log.xml_enviado.substring(0, 200) + '...');
      }
      
      if (log.xml_retorno) {
        console.log('XML Retorno (primeiros 200 chars):', log.xml_retorno.substring(0, 200) + '...');
      }
      
      console.log('==================');
      
      // Salvar no banco de dados para auditoria
      const { error } = await supabase
        .from('logs_sefaz')
        .insert({
          operacao: log.operacao,
          empresa_id: log.empresa_id,
          nota_fiscal_id: log.nota_fiscal_id,
          chave_acesso: log.chave_acesso,
          xml_enviado: log.xml_enviado,
          xml_retorno: log.xml_retorno,
          codigo_retorno: log.codigo_retorno,
          mensagem_retorno: log.mensagem_retorno,
          tempo_resposta_ms: log.tempo_resposta_ms,
          protocolo: log.protocolo,
          status_operacao: log.status_operacao,
          ip_origem: log.ip_origem ? log.ip_origem : null,
          user_agent: log.user_agent,
        });

      if (error) {
        console.error('Erro ao salvar log no banco:', error);
        // Não lança erro para não interromper o fluxo principal
      } else {
        console.log('Log salvo no banco de dados com sucesso');
      }
    } catch (error) {
      console.error('Erro ao gravar log SEFAZ:', error);
      // Não lança erro para não interromper o fluxo principal
    }
  }

  /**
   * Retrieve logs for a specific company with pagination
   */
  static async buscarLogs(
    empresaId: string, 
    filtros?: {
      operacao?: string;
      dataInicio?: string;
      dataFim?: string;
      status?: string;
    },
    page = 1,
    limit = 50
  ) {
    try {
      let query = supabase
        .from('logs_sefaz')
        .select('*', { count: 'exact' })
        .eq('empresa_id', empresaId)
        .order('created_at', { ascending: false });

      if (filtros?.operacao) {
        query = query.eq('operacao', filtros.operacao);
      }

      if (filtros?.status) {
        query = query.eq('status_operacao', filtros.status);
      }

      if (filtros?.dataInicio) {
        query = query.gte('created_at', filtros.dataInicio);
      }

      if (filtros?.dataFim) {
        query = query.lte('created_at', filtros.dataFim);
      }

      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      return {
        logs: data,
        total: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit)
      };
    } catch (error) {
      console.error('Erro ao buscar logs:', error);
      throw error;
    }
  }

  /**
   * Get statistics for dashboard
   */
  static async obterEstatisticas(empresaId: string, periodo = '30 days') {
    try {
      const { data, error } = await supabase
        .from('logs_sefaz')
        .select('operacao, status_operacao, tempo_resposta_ms')
        .eq('empresa_id', empresaId)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (error) {
        throw error;
      }

      const stats = {
        totalOperacoes: data.length,
        sucessos: data.filter(log => log.status_operacao === 'sucesso').length,
        erros: data.filter(log => log.status_operacao === 'erro').length,
        tempoMedioResposta: data.length > 0 
          ? Math.round(data.reduce((sum, log) => sum + (log.tempo_resposta_ms || 0), 0) / data.length)
          : 0,
        operacoesPorTipo: data.reduce((acc, log) => {
          acc[log.operacao] = (acc[log.operacao] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };

      return stats;
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      throw error;
    }
  }
}
