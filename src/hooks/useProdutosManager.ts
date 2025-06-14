
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { validarProduto, formatarErrosValidacao, type ProdutoValidation } from '@/utils/validacoes';

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
      
      if (error) {
        console.error('Erro ao carregar produtos:', error);
        throw new Error(`Erro ao carregar produtos: ${error.message}`);
      }
      return data;
    },
    enabled: !!empresaId,
  });
};

export const useCreateProdutoManager = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (produtoData: ProdutoValidation & { empresa_id: string }) => {
      // Validação no frontend
      const validationErrors = validarProduto(produtoData);
      if (validationErrors.length > 0) {
        const formattedErrors = formatarErrosValidacao(validationErrors);
        const errorMessage = Object.values(formattedErrors).join(', ');
        throw new Error(`Dados inválidos: ${errorMessage}`);
      }

      const { data, error } = await supabase
        .from('produtos')
        .insert([produtoData])
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao criar produto:', error);
        if (error.code === '23505') {
          throw new Error('Produto com este código já existe');
        }
        throw new Error(`Erro ao criar produto: ${error.message}`);
      }
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
        title: "Erro ao cadastrar produto",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateProdutoManager = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<ProdutoValidation> }) => {
      // Se houver dados para validar, valide
      if (Object.keys(updates).length > 0) {
        const fullData = updates as ProdutoValidation;
        const validationErrors = validarProduto(fullData);
        if (validationErrors.length > 0) {
          const formattedErrors = formatarErrosValidacao(validationErrors);
          const errorMessage = Object.values(formattedErrors).join(', ');
          throw new Error(`Dados inválidos: ${errorMessage}`);
        }
      }

      const { data, error } = await supabase
        .from('produtos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao atualizar produto:', error);
        if (error.code === '23505') {
          throw new Error('Produto com este código já existe');
        }
        throw new Error(`Erro ao atualizar produto: ${error.message}`);
      }
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
        title: "Erro ao atualizar produto",
        description: error.message || "Ocorreu um erro inesperado",
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
      
      if (error) {
        console.error('Erro ao excluir produto:', error);
        if (error.code === '23503') {
          throw new Error('Não é possível excluir produto que possui itens em notas fiscais');
        }
        throw new Error(`Erro ao excluir produto: ${error.message}`);
      }
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
        title: "Erro ao excluir produto",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    },
  });
};
