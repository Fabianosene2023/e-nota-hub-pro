
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useUnidadesMedida = () => {
  return useQuery({
    queryKey: ['unidades-medida'],
    queryFn: async () => {
      console.log('Buscando unidades de medida...');
      const { data, error } = await supabase
        .from('unidades_medida')
        .select('*')
        .order('codigo');
      
      if (error) {
        console.error('Erro ao buscar unidades:', error);
        throw error;
      }
      console.log('Unidades encontradas:', data);
      return data;
    },
  });
};

export const useUnidadesMedidaManager = () => {
  const queryClient = useQueryClient();

  const createUnidade = useMutation({
    mutationFn: async (unidade: { codigo: string; descricao: string }) => {
      console.log('Criando unidade:', unidade);
      const { data, error } = await supabase
        .from('unidades_medida')
        .insert([unidade])
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao criar unidade:', error);
        throw error;
      }
      console.log('Unidade criada:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unidades-medida'] });
    },
    onError: (error: any) => {
      console.error('Erro na mutação de criação:', error);
    },
  });

  const updateUnidade = useMutation({
    mutationFn: async ({ id, ...unidade }: { id: string; codigo: string; descricao: string }) => {
      console.log('Atualizando unidade:', { id, ...unidade });
      const { data, error } = await supabase
        .from('unidades_medida')
        .update(unidade)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao atualizar unidade:', error);
        throw error;
      }
      console.log('Unidade atualizada:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unidades-medida'] });
    },
    onError: (error: any) => {
      console.error('Erro na mutação de atualização:', error);
    },
  });

  const deleteUnidade = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deletando unidade:', id);
      const { error } = await supabase
        .from('unidades_medida')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Erro ao deletar unidade:', error);
        throw error;
      }
      console.log('Unidade deletada com sucesso');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unidades-medida'] });
    },
    onError: (error: any) => {
      console.error('Erro na mutação de exclusão:', error);
    },
  });

  return {
    createUnidade,
    updateUnidade,
    deleteUnidade,
  };
};
