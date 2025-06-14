
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * Query hook for fetching NFe data
 */
export const useNotasFiscaisQuery = () => {
  return useQuery({
    queryKey: ['notas-fiscais'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notas_fiscais')
        .select(`
          *,
          empresas (
            razao_social,
            nome_fantasia
          ),
          clientes (
            nome_razao_social,
            cpf_cnpj
          ),
          transportadoras:contatos!transportadora_id (
            nome_razao_social,
            cpf_cnpj,
            placa_veiculo
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};
