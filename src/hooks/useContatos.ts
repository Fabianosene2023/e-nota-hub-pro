
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useContatos = (tipo?: 'cliente' | 'fornecedor' | 'transportadora') => {
  return useQuery({
    queryKey: ['contatos', tipo],
    queryFn: async () => {
      let query = supabase
        .from('contatos')
        .select(`
          *,
          empresas (
            razao_social,
            nome_fantasia
          )
        `)
        .order('created_at', { ascending: false });
      
      if (tipo) {
        query = query.eq('tipo', tipo);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateContato = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (contato: any) => {
      const { data, error } = await supabase
        .from('contatos')
        .insert([contato])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contatos'] });
      toast({
        title: "Sucesso!",
        description: "Contato criado com sucesso",
      });
    },
    onError: (error) => {
      console.error('Erro ao criar contato:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar contato",
        variant: "destructive",
      });
    },
  });
};
