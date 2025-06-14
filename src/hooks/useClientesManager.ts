
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { validarCliente, formatarErrosValidacao, type ClienteValidation } from '@/utils/validacoes';

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
      
      if (error) {
        console.error('Erro ao carregar clientes:', error);
        throw new Error(`Erro ao carregar clientes: ${error.message}`);
      }
      return data;
    },
    enabled: !!empresaId,
  });
};

export const useCreateClienteManager = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (clienteData: ClienteValidation & { empresa_id: string }) => {
      // Validação no frontend
      const validationErrors = validarCliente(clienteData);
      if (validationErrors.length > 0) {
        const formattedErrors = formatarErrosValidacao(validationErrors);
        const errorMessage = Object.values(formattedErrors).join(', ');
        throw new Error(`Dados inválidos: ${errorMessage}`);
      }

      const { data, error } = await supabase
        .from('clientes')
        .insert([clienteData])
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao criar cliente:', error);
        if (error.code === '23505') {
          throw new Error('Cliente com este CPF/CNPJ já existe');
        }
        throw new Error(`Erro ao criar cliente: ${error.message}`);
      }
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
        title: "Erro ao cadastrar cliente",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateClienteManager = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<ClienteValidation> }) => {
      // Se houver dados para validar, valide
      if (Object.keys(updates).length > 0) {
        const fullData = updates as ClienteValidation;
        const validationErrors = validarCliente(fullData);
        if (validationErrors.length > 0) {
          const formattedErrors = formatarErrosValidacao(validationErrors);
          const errorMessage = Object.values(formattedErrors).join(', ');
          throw new Error(`Dados inválidos: ${errorMessage}`);
        }
      }

      const { data, error } = await supabase
        .from('clientes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao atualizar cliente:', error);
        if (error.code === '23505') {
          throw new Error('Cliente com este CPF/CNPJ já existe');
        }
        throw new Error(`Erro ao atualizar cliente: ${error.message}`);
      }
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
        title: "Erro ao atualizar cliente",
        description: error.message || "Ocorreu um erro inesperado",
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
      
      if (error) {
        console.error('Erro ao excluir cliente:', error);
        if (error.code === '23503') {
          throw new Error('Não é possível excluir cliente que possui notas fiscais vinculadas');
        }
        throw new Error(`Erro ao excluir cliente: ${error.message}`);
      }
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
        title: "Erro ao excluir cliente",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    },
  });
};
