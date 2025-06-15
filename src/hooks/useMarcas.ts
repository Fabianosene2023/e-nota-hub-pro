
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useMarcas = () => {
  return useQuery({
    queryKey: ['marcas'],
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
        .from('marcas')
        .select('*')
        .eq('empresa_id', profile.empresa_id)
        .order('nome');
      
      if (error) throw error;
      return data;
    },
  });
};

export const useMarcasManager = () => {
  const queryClient = useQueryClient();

  const createMarca = useMutation({
    mutationFn: async (marca: any) => {
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
        .from('marcas')
        .insert([{ ...marca, empresa_id: profile.empresa_id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marcas'] });
      toast({
        title: "Sucesso",
        description: "Marca criada com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao criar marca: " + error.message,
        variant: "destructive",
      });
    },
  });

  const updateMarca = useMutation({
    mutationFn: async ({ id, ...marca }: any) => {
      const { data, error } = await supabase
        .from('marcas')
        .update(marca)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marcas'] });
      toast({
        title: "Sucesso",
        description: "Marca atualizada com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar marca: " + error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMarca = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('marcas')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marcas'] });
      toast({
        title: "Sucesso",
        description: "Marca removida com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao remover marca: " + error.message,
        variant: "destructive",
      });
    },
  });

  return {
    createMarca,
    updateMarca,
    deleteMarca,
  };
};
