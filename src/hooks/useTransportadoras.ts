
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Transportadora {
  id: string;
  empresa_id: string;
  nome_razao_social: string;
  nome_fantasia?: string;
  cpf_cnpj: string;
  tipo_pessoa: 'fisica' | 'juridica';
  inscricao_estadual?: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  telefone?: string;
  email?: string;
  placa_veiculo?: string;
  rntrc?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export const useTransportadoras = () => {
  return useQuery({
    queryKey: ['transportadoras'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transportadoras')
        .select('*')
        .eq('ativo', true)
        .order('nome_razao_social');
      
      if (error) throw error;
      return data as Transportadora[];
    },
  });
};

export const useTransportadorasManager = () => {
  const queryClient = useQueryClient();

  const createTransportadora = useMutation({
    mutationFn: async (transportadora: Omit<Transportadora, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('transportadoras')
        .insert(transportadora)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transportadoras'] });
      toast({
        title: "Sucesso",
        description: "Transportadora cadastrada com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao cadastrar transportadora",
        variant: "destructive",
      });
    },
  });

  const updateTransportadora = useMutation({
    mutationFn: async (transportadora: Partial<Transportadora> & { id: string }) => {
      const { data, error } = await supabase
        .from('transportadoras')
        .update(transportadora)
        .eq('id', transportadora.id)
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
        description: error instanceof Error ? error.message : "Erro ao atualizar transportadora",
        variant: "destructive",
      });
    },
  });

  const deleteTransportadora = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('transportadoras')
        .update({ ativo: false })
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
        description: error instanceof Error ? error.message : "Erro ao remover transportadora",
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
