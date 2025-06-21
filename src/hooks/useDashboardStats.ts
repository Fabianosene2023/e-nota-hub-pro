
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useDashboardStats = () => {
  const { profile } = useAuth();
  
  return useQuery({
    queryKey: ['dashboard-stats', profile?.empresa_id],
    queryFn: async () => {
      if (!profile?.empresa_id) {
        throw new Error('Empresa não encontrada');
      }

      // Buscar NFe emitidas
      const { data: nfes, error: nfeError } = await supabase
        .from('notas_fiscais')
        .select('id, valor_total, created_at, status')
        .eq('empresa_id', profile.empresa_id)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (nfeError) throw nfeError;

      // Buscar clientes ativos
      const { data: clientes, error: clientesError } = await supabase
        .from('clientes')
        .select('id, created_at')
        .eq('empresa_id', profile.empresa_id);

      if (clientesError) throw clientesError;

      // Buscar relatórios (logs de operações)
      const { data: relatorios, error: relatoriosError } = await supabase
        .from('logs_operacoes')
        .select('id, created_at')
        .eq('empresa_id', profile.empresa_id)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (relatoriosError) throw relatoriosError;

      // Calcular estatísticas
      const nfesEmitidas = nfes?.length || 0;
      const clientesAtivos = clientes?.length || 0;
      const receitaTotal = nfes?.reduce((acc, nfe) => acc + Number(nfe.valor_total || 0), 0) || 0;
      const relatoriosGerados = relatorios?.length || 0;

      // Calcular crescimento (comparar com período anterior)
      const mesPassado = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();
      const { data: nfesAnteriores } = await supabase
        .from('notas_fiscais')
        .select('valor_total')
        .eq('empresa_id', profile.empresa_id)
        .gte('created_at', mesPassado)
        .lt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      const nfesAnterioresCount = nfesAnteriores?.length || 0;
      const crescimentoNfe = nfesAnterioresCount > 0 ? 
        ((nfesEmitidas - nfesAnterioresCount) / nfesAnterioresCount) * 100 : 0;

      return {
        nfesEmitidas,
        clientesAtivos,
        receitaTotal,
        relatoriosGerados,
        crescimentoNfe,
        crescimentoClientes: 5.2, // Placeholder - pode ser calculado da mesma forma
        crescimentoReceita: 12.5 // Placeholder - pode ser calculado da mesma forma
      };
    },
    enabled: !!profile?.empresa_id,
  });
};
