
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useClientesManager = (empresaId?: string) => {
  return useQuery({
    queryKey: ['clientes', empresaId],
    queryFn: async () => {
      let query = supabase
        .from('clientes')
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

export const useCreateClienteManager = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (clienteData: any) => {
      const { data, error } = await supabase
        .from('clientes')
        .insert([clienteData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clientes', variables.empresa_id] });
      toast({
        title: "Sucesso!",
        description: "Cliente cadastrado com sucesso",
      });
    },
    onError: (error) => {
      console.error('Erro ao criar cliente:', error);
      toast({
        title: "Erro",
        description: "Erro ao cadastrar cliente",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateClienteManager = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: any }) => {
      const { data, error } = await supabase
        .from('clientes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['clientes', data.empresa_id] });
      toast({
        title: "Sucesso!",
        description: "Cliente atualizado com sucesso",
      });
    },
    onError: (error) => {
      console.error('Erro ao atualizar cliente:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar cliente",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteClienteManager = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      toast({
        title: "Sucesso!",
        description: "Cliente excluído com sucesso",
      });
    },
    onError: (error) => {
      console.error('Erro ao excluir cliente:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir cliente",
        variant: "destructive",
      });
    },
  });
};
