
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Servico {
  id: string;
  empresa_id: string;
  codigo: string;
  nome: string;
  descricao?: string;
  preco_unitario: number;
  unidade: string;
  codigo_servico_municipal?: string;
  aliquota_iss: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export const useServicos = (empresaId: string) => {
  return useQuery({
    queryKey: ['servicos', empresaId],
    queryFn: async () => {
      if (!empresaId) return [];
      const { data, error } = await supabase
        .from('servicos')
        .select('*')
        .eq('empresa_id', empresaId)
        .eq('ativo', true)
        .order('nome', { ascending: true });

      if (error) throw error;
      return data as Servico[];
    },
    enabled: !!empresaId,
  });
};

export const useServicosManager = () => {
  const queryClient = useQueryClient();

  const createServico = useMutation({
    mutationFn: async (servico: Omit<Servico, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('servicos')
        .insert(servico)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['servicos', variables.empresa_id] });
      toast({
        title: "Sucesso",
        description: "Serviço cadastrado com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao cadastrar serviço",
        variant: "destructive",
      });
    },
  });

  const updateServico = useMutation({
    mutationFn: async (servico: Partial<Servico> & { id: string }) => {
      const { data, error } = await supabase
        .from('servicos')
        .update(servico)
        .eq('id', servico.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['servicos', data.empresa_id] });
      toast({
        title: "Sucesso",
        description: "Serviço atualizado com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao atualizar serviço",
        variant: "destructive",
      });
    },
  });

  const deleteServico = useMutation({
    mutationFn: async ({ id, empresaId }: { id: string; empresaId: string }) => {
      const { error } = await supabase
        .from('servicos')
        .update({ ativo: false })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['servicos', variables.empresaId] });
      toast({
        title: "Sucesso",
        description: "Serviço removido com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao remover serviço",
        variant: "destructive",
      });
    },
  });

  return {
    createServico,
    updateServico,
    deleteServico,
  };
};
