
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
      toast({
        title: "Sucesso",
        description: "Unidade de medida criada com sucesso",
      });
    },
    onError: (error: any) => {
      console.error('Erro na mutação de criação:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar unidade de medida: " + error.message,
        variant: "destructive",
      });
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
      toast({
        title: "Sucesso",
        description: "Unidade de medida atualizada com sucesso",
      });
    },
    onError: (error: any) => {
      console.error('Erro na mutação de atualização:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar unidade de medida: " + error.message,
        variant: "destructive",
      });
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
      toast({
        title: "Sucesso",
        description: "Unidade de medida removida com sucesso",
      });
    },
    onError: (error: any) => {
      console.error('Erro na mutação de exclusão:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover unidade de medida: " + error.message,
        variant: "destructive",
      });
    },
  });

  return {
    createUnidade,
    updateUnidade,
    deleteUnidade,
  };
};
