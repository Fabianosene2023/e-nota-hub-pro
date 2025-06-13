
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useFornecedores = () => {
  return useQuery({
    queryKey: ['fornecedores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fornecedores')
        .select('*')
        .order('nome_razao_social');
      
      if (error) throw error;
      return data;
    },
  });
};

export const useFornecedoresManager = () => {
  const queryClient = useQueryClient();

  const createFornecedor = useMutation({
    mutationFn: async (fornecedor: any) => {
      const { data, error } = await supabase
        .from('fornecedores')
        .insert([fornecedor])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fornecedores'] });
      toast({
        title: "Sucesso",
        description: "Fornecedor criado com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao criar fornecedor: " + error.message,
        variant: "destructive",
      });
    },
  });

  const updateFornecedor = useMutation({
    mutationFn: async ({ id, ...fornecedor }: any) => {
      const { data, error } = await supabase
        .from('fornecedores')
        .update(fornecedor)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fornecedores'] });
      toast({
        title: "Sucesso",
        description: "Fornecedor atualizado com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar fornecedor: " + error.message,
        variant: "destructive",
      });
    },
  });

  const deleteFornecedor = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('fornecedores')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fornecedores'] });
      toast({
        title: "Sucesso",
        description: "Fornecedor removido com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao remover fornecedor: " + error.message,
        variant: "destructive",
      });
    },
  });

  return {
    createFornecedor,
    updateFornecedor,
    deleteFornecedor,
  };
};
