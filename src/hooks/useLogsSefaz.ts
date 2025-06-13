
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useLogsSefaz = (empresaId: string, filtros?: {
  operacao?: string;
  status?: string;
  dataInicio?: string;
  dataFim?: string;
  chaveAcesso?: string;
}) => {
  return useQuery({
    queryKey: ['logs-sefaz', empresaId, filtros],
    queryFn: async () => {
      let query = supabase
        .from('logs_sefaz')
        .select(`
          *,
          notas_fiscais (
            numero,
            serie,
            valor_total,
            clientes (
              nome_razao_social
            )
          )
        `)
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
      
      if (filtros?.chaveAcesso) {
        query = query.ilike('chave_acesso', `%${filtros.chaveAcesso}%`);
      }
      
      const { data, error } = await query.limit(100);
      
      if (error) throw error;
      return data;
    },
    enabled: !!empresaId,
  });
};

export const useEstatisticasSefaz = (empresaId: string, periodo: 'dia' | 'semana' | 'mes' = 'semana') => {
  return useQuery({
    queryKey: ['estatisticas-sefaz', empresaId, periodo],
    queryFn: async () => {
      const agora = new Date();
      let dataInicio: Date;
      
      switch (periodo) {
        case 'dia':
          dataInicio = new Date(agora.getTime() - 24 * 60 * 60 * 1000);
          break;
        case 'semana':
          dataInicio = new Date(agora.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'mes':
          dataInicio = new Date(agora.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
      }
      
      const { data, error } = await supabase
        .from('logs_sefaz')
        .select('operacao, status_operacao, tempo_resposta_ms, created_at')
        .eq('empresa_id', empresaId)
        .gte('created_at', dataInicio.toISOString());
      
      if (error) throw error;
      
      // Calcular estatísticas
      const totalOperacoes = data.length;
      const sucessos = data.filter(log => log.status_operacao === 'sucesso').length;
      const erros = data.filter(log => log.status_operacao === 'erro').length;
      const tempoMedioResposta = data.reduce((acc, log) => acc + (log.tempo_resposta_ms || 0), 0) / totalOperacoes;
      
      const operacoesPorTipo = data.reduce((acc: Record<string, number>, log) => {
        acc[log.operacao] = (acc[log.operacao] || 0) + 1;
        return acc;
      }, {});
      
      return {
        totalOperacoes,
        sucessos,
        erros,
        taxaSucesso: totalOperacoes > 0 ? (sucessos / totalOperacoes) * 100 : 0,
        tempoMedioResposta: Math.round(tempoMedioResposta),
        operacoesPorTipo
      };
    },
    enabled: !!empresaId,
  });
};
