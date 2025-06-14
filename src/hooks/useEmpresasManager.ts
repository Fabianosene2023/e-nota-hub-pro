
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useEmpresasManager = () => {
  return useQuery({
    queryKey: ['empresas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erro ao carregar empresas:', error);
        throw new Error(`Erro ao carregar empresas: ${error.message}`);
      }
      return data;
    },
  });
};

export const useCreateEmpresaManager = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (empresaData: any) => {
      const { data, error } = await supabase
        .from('empresas')
        .insert([empresaData])
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao criar empresa:', error);
        if (error.code === '23505') {
          throw new Error('Empresa com este CNPJ já existe');
        }
        throw new Error(`Erro ao criar empresa: ${error.message}`);
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
      toast({
        title: "Sucesso!",
        description: "Empresa cadastrada com sucesso",
      });
    },
    onError: (error) => {
      console.error('Erro ao criar empresa:', error);
      toast({
        title: "Erro ao cadastrar empresa",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateEmpresaManager = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: any }) => {
      const { data, error } = await supabase
        .from('empresas')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao atualizar empresa:', error);
        if (error.code === '23505') {
          throw new Error('Empresa com este CNPJ já existe');
        }
        throw new Error(`Erro ao atualizar empresa: ${error.message}`);
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
      toast({
        title: "Sucesso!",
        description: "Empresa atualizada com sucesso",
      });
    },
    onError: (error) => {
      console.error('Erro ao atualizar empresa:', error);
      toast({
        title: "Erro ao atualizar empresa",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteEmpresaManager = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('empresas')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Erro ao excluir empresa:', error);
        if (error.code === '23503') {
          throw new Error('Não é possível excluir empresa que possui dados vinculados');
        }
        throw new Error(`Erro ao excluir empresa: ${error.message}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
      toast({
        title: "Sucesso!",
        description: "Empresa excluída com sucesso",
      });
    },
    onError: (error) => {
      console.error('Erro ao excluir empresa:', error);
      toast({
        title: "Erro ao excluir empresa",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    },
  });
};
