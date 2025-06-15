
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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

export const useUnidadesMedidaManager = () => {
  const queryClient = useQueryClient();

  const createUnidade = useMutation({
    mutationFn: async (unidade: any) => {
      const { data, error } = await supabase
        .from('unidades_medida')
        .insert([unidade])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unidades-medida'] });
      toast({
        title: "Sucesso",
        description: "Unidade de medida criada com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao criar unidade de medida: " + error.message,
        variant: "destructive",
      });
    },
  });

  const updateUnidade = useMutation({
    mutationFn: async ({ id, ...unidade }: any) => {
      const { data, error } = await supabase
        .from('unidades_medida')
        .update(unidade)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unidades-medida'] });
      toast({
        title: "Sucesso",
        description: "Unidade de medida atualizada com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar unidade de medida: " + error.message,
        variant: "destructive",
      });
    },
  });

  const deleteUnidade = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('unidades_medida')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unidades-medida'] });
      toast({
        title: "Sucesso",
        description: "Unidade de medida removida com sucesso",
      });
    },
    onError: (error) => {
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
