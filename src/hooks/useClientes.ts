
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Cliente {
  id: string;
  empresa_id: string;
  nome_razao_social: string;
  cpf_cnpj: string;
  tipo_pessoa: string;
  email?: string;
  telefone?: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  inscricao_estadual?: string;
  created_at: string;
  updated_at: string;
}

export const useClientes = (empresaId?: string) => {
  return useQuery({
    queryKey: ['clientes', empresaId],
    queryFn: async () => {
      let query = supabase.from('clientes').select('*');
      
      if (empresaId) {
        query = query.eq('empresa_id', empresaId);
      }
      
      const { data, error } = await query.order('nome_razao_social');
      
      if (error) throw error;
      return data as Cliente[];
    },
    enabled: !!empresaId,
  });
};

export const useCreateCliente = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (clienteData: Omit<Cliente, 'id' | 'created_at' | 'updated_at'>) => {
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
        description: "Cliente criado com sucesso",
      });
    },
    onError: (error) => {
      console.error('Erro ao criar cliente:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar cliente",
        variant: "destructive",
      });
    },
  });
};
