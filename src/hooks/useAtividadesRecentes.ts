
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useAtividadesRecentes = () => {
  const { profile } = useAuth();
  
  return useQuery({
    queryKey: ['atividades-recentes', profile?.empresa_id],
    queryFn: async () => {
      if (!profile?.empresa_id) {
        throw new Error('Empresa não encontrada');
      }

      // Buscar logs de operações recentes
      const { data: logs, error } = await supabase
        .from('logs_operacoes')
        .select('*')
        .eq('empresa_id', profile.empresa_id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Mapear logs para atividades
      const atividades = logs?.map(log => {
        let cor = 'bg-blue-500';
        let descricao = log.descricao;

        if (log.tipo_operacao === 'nfe_emissao') {
          cor = 'bg-blue-500';
          descricao = `NFe emitida - ${log.descricao}`;
        } else if (log.tipo_operacao === 'cliente_cadastro') {
          cor = 'bg-green-500';
          descricao = `Cliente cadastrado - ${log.descricao}`;
        } else if (log.tipo_operacao === 'produto_atualizado') {
          cor = 'bg-yellow-500';
          descricao = `Produto atualizado - ${log.descricao}`;
        }

        const tempoDecorrido = new Date(log.created_at);
        const agora = new Date();
        const diff = agora.getTime() - tempoDecorrido.getTime();
        const minutos = Math.floor(diff / (1000 * 60));
        const horas = Math.floor(diff / (1000 * 60 * 60));
        
        let tempo = '';
        if (minutos < 60) {
          tempo = `Há ${minutos} minutos`;
        } else {
          tempo = `Há ${horas} ${horas === 1 ? 'hora' : 'horas'}`;
        }

        return {
          id: log.id,
          cor,
          descricao,
          tempo
        };
      }) || [];

      return atividades;
    },
    enabled: !!profile?.empresa_id,
  });
};
