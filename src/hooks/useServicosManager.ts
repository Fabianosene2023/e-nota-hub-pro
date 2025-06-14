
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useServicosManager = (empresaId?: string) => {
  return useQuery({
    queryKey: ['servicos', empresaId],
    queryFn: async () => {
      let query = supabase
        .from('servicos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (empresaId) {
        query = query.eq('empresa_id', empresaId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Erro ao carregar serviços:', error);
        throw new Error(`Erro ao carregar serviços: ${error.message}`);
      }
      return data;
    },
  });
};

export const useCreateServicoManager = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (servicoData: any) => {
      const { data, error } = await supabase
        .from('servicos')
        .insert([servicoData])
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao criar serviço:', error);
        if (error.code === '23505') {
          throw new Error('Serviço com este código já existe para esta empresa');
        }
        throw new Error(`Erro ao criar serviço: ${error.message}`);
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicos'] });
      toast({
        title: "Sucesso!",
        description: "Serviço cadastrado com sucesso",
      });
    },
    onError: (error) => {
      console.error('Erro ao criar serviço:', error);
      toast({
        title: "Erro ao cadastrar serviço",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateServicoManager = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: any }) => {
      const { data, error } = await supabase
        .from('servicos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao atualizar serviço:', error);
        if (error.code === '23505') {
          throw new Error('Serviço com este código já existe para esta empresa');
        }
        throw new Error(`Erro ao atualizar serviço: ${error.message}`);
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicos'] });
      toast({
        title: "Sucesso!",
        description: "Serviço atualizado com sucesso",
      });
    },
    onError: (error) => {
      console.error('Erro ao atualizar serviço:', error);
      toast({
        title: "Erro ao atualizar serviço",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteServicoManager = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('servicos')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Erro ao excluir serviço:', error);
        throw new Error(`Erro ao excluir serviço: ${error.message}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicos'] });
      toast({
        title: "Sucesso!",
        description: "Serviço excluído com sucesso",
      });
    },
    onError: (error) => {
      console.error('Erro ao excluir serviço:', error);
      toast({
        title: "Erro ao excluir serviço",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    },
  });
};
