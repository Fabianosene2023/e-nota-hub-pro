
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface FiltrosMdfe {
  dataInicio?: string;
  dataFim?: string;
  chaveAcesso?: string;
  status?: string;
  remetenteCnpj?: string;
  remetenteNome?: string;
}

export const useMdfeRecebidos = (filtros: FiltrosMdfe) => {
  return useQuery({
    queryKey: ['mdfe-recebidos', filtros],
    queryFn: async () => {
      let query = supabase
        .from('mdfe_recebidos')
        .select('*')
        .order('data_recebimento', { ascending: false });

      // Aplicar filtros
      if (filtros.dataInicio) {
        query = query.gte('data_emissao', filtros.dataInicio);
      }
      
      if (filtros.dataFim) {
        query = query.lte('data_emissao', filtros.dataFim);
      }
      
      if (filtros.chaveAcesso) {
        query = query.ilike('chave_acesso', `%${filtros.chaveAcesso}%`);
      }
      
      if (filtros.status) {
        query = query.eq('status', filtros.status);
      }
      
      if (filtros.remetenteCnpj) {
        query = query.ilike('remetente_cnpj', `%${filtros.remetenteCnpj}%`);
      }
      
      if (filtros.remetenteNome) {
        query = query.ilike('remetente_nome', `%${filtros.remetenteNome}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar MDFe recebidos:', error);
        throw error;
      }

      return data || [];
    },
    enabled: Object.values(filtros).some(value => value !== ""), // Só executa se pelo menos um filtro estiver preenchido
  });
};

export const useMdfeDetalhes = (mdfeId: string) => {
  return useQuery({
    queryKey: ['mdfe-detalhes', mdfeId],
    queryFn: async () => {
      const { data: mdfe, error: mdfeError } = await supabase
        .from('mdfe_recebidos')
        .select('*')
        .eq('id', mdfeId)
        .single();

      if (mdfeError) {
        console.error('Erro ao buscar detalhes do MDFe:', mdfeError);
        throw mdfeError;
      }

      // Buscar itens do MDFe
      const { data: itens, error: itensError } = await supabase
        .from('itens_mdfe')
        .select('*')
        .eq('mdfe_id', mdfeId)
        .order('created_at');

      if (itensError) {
        console.error('Erro ao buscar itens do MDFe:', itensError);
        throw itensError;
      }

      return {
        ...mdfe,
        itens: itens || []
      };
    },
    enabled: !!mdfeId,
  });
};
