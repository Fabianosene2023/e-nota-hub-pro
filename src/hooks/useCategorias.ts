
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useCategorias = () => {
  return useQuery({
    queryKey: ['categorias'],
    queryFn: async () => {
      // Obter perfil do usuário para pegar empresa_id
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data: profile } = await supabase
        .from('profiles')
        .select('empresa_id')
        .eq('id', user.id)
        .single();

      if (!profile?.empresa_id) {
        throw new Error('Empresa não encontrada para o usuário');
      }

      const { data, error } = await supabase
        .from('categorias_produtos')
        .select('*')
        .eq('empresa_id', profile.empresa_id)
        .order('nome');
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCategoriasManager = () => {
  const queryClient = useQueryClient();

  const createCategoria = useMutation({
    mutationFn: async (categoria: any) => {
      // Obter perfil do usuário para pegar empresa_id
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data: profile } = await supabase
        .from('profiles')
        .select('empresa_id')
        .eq('id', user.id)
        .single();

      if (!profile?.empresa_id) {
        throw new Error('Empresa não encontrada para o usuário');
      }

      const { data, error } = await supabase
        .from('categorias_produtos')
        .insert([{ ...categoria, empresa_id: profile.empresa_id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      toast({
        title: "Sucesso",
        description: "Categoria criada com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao criar categoria: " + error.message,
        variant: "destructive",
      });
    },
  });

  const updateCategoria = useMutation({
    mutationFn: async ({ id, ...categoria }: any) => {
      const { data, error } = await supabase
        .from('categorias_produtos')
        .update(categoria)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      toast({
        title: "Sucesso",
        description: "Categoria atualizada com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar categoria: " + error.message,
        variant: "destructive",
      });
    },
  });

  const deleteCategoria = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('categorias_produtos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      toast({
        title: "Sucesso",
        description: "Categoria removida com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao remover categoria: " + error.message,
        variant: "destructive",
      });
    },
  });

  return {
    createCategoria,
    updateCategoria,
    deleteCategoria,
  };
};
