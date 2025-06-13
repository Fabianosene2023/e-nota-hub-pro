
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useUnidadesMedida = () => {
  return useQuery({
    queryKey: ['unidades-medida'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('unidades_medida')
        .select('*')
        .order('codigo');
      
      if (error) throw error;
      return data;
    },
  });
};
