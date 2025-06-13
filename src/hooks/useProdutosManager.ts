
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useProdutosManager = (empresaId?: string) => {
  return useQuery({
    queryKey: ['produtos', empresaId],
    queryFn: async () => {
      let query = supabase
        .from('produtos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (empresaId) {
        query = query.eq('empresa_id', empresaId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
    enabled: !!empresaId,
  });
};

export const useCreateProdutoManager = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (produtoData: any) => {
      const { data, error } = await supabase
        .from('produtos')
        .insert([produtoData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['produtos', variables.empresa_id] });
      toast({
        title: "Sucesso!",
        description: "Produto cadastrado com sucesso",
      });
    },
    onError: (error) => {
      console.error('Erro ao criar produto:', error);
      toast({
        title: "Erro",
        description: "Erro ao cadastrar produto",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateProdutoManager = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: any }) => {
      const { data, error } = await supabase
        .from('produtos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['produtos', data.empresa_id] });
      toast({
        title: "Sucesso!",
        description: "Produto atualizado com sucesso",
      });
    },
    onError: (error) => {
      console.error('Erro ao atualizar produto:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar produto",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteProdutoManager = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('produtos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['produtos'] });
      toast({
        title: "Sucesso!",
        description: "Produto excluído com sucesso",
      });
    },
    onError: (error) => {
      console.error('Erro ao excluir produto:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir produto",
        variant: "destructive",
      });
    },
  });
};
