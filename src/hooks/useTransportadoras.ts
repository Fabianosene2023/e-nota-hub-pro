
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useTransportadoras = () => {
  return useQuery({
    queryKey: ['transportadoras'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transportadoras')
        .select('*')
        .order('nome_razao_social');
      
      if (error) throw error;
      return data;
    },
  });
};

export const useTransportadorasManager = () => {
  const queryClient = useQueryClient();

  const createTransportadora = useMutation({
    mutationFn: async (transportadora: any) => {
      const { data, error } = await supabase
        .from('transportadoras')
        .insert([transportadora])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transportadoras'] });
      toast({
        title: "Sucesso",
        description: "Transportadora criada com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao criar transportadora: " + error.message,
        variant: "destructive",
      });
    },
  });

  const updateTransportadora = useMutation({
    mutationFn: async ({ id, ...transportadora }: any) => {
      const { data, error } = await supabase
        .from('transportadoras')
        .update(transportadora)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transportadoras'] });
      toast({
        title: "Sucesso",
        description: "Transportadora atualizada com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar transportadora: " + error.message,
        variant: "destructive",
      });
    },
  });

  const deleteTransportadora = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('transportadoras')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transportadoras'] });
      toast({
        title: "Sucesso",
        description: "Transportadora removida com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao remover transportadora: " + error.message,
        variant: "destructive",
      });
    },
  });

  return {
    createTransportadora,
    updateTransportadora,
    deleteTransportadora,
  };
};
