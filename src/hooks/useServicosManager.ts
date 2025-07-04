import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Servico {
  id: string;
  empresa_id: string;
  codigo: string;
  nome: string;
  descricao?: string;
  preco_unitario: number;
  unidade: string;
  codigo_servico_municipal?: string;
  aliquota_iss?: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
  local_prestacao?: string;
  municipio_prestacao?: string;
  codigo_tributacao_nacional?: string;
  isencao_issqn?: boolean;
  descricao_servico?: string;
  item_nbs?: string;
  numero_documento_responsabilidade_tecnica?: string;
  documento_referencia?: string;
  informacoes_complementares?: string;
  valor_servico_prestado?: number;
  opcao_tributos?: number;
  valor_tributos_federais?: number;
  valor_tributos_estaduais?: number;
  valor_tributos_municipais?: number;
  percentual_tributos_federais?: number;
  percentual_tributos_estaduais?: number;
  percentual_tributos_municipais?: number;
}

export const useServicosManager = (empresaId?: string) => {
  return useQuery({
    queryKey: ['servicos', empresaId],
    queryFn: async () => {
      console.log('Buscando serviços...', { empresaId });
      
      if (!empresaId) {
        const { data, error } = await supabase
          .from('servicos')
          .select('*')
          .eq('ativo', true)
          .order('nome');
        
        if (error) {
          console.error('Erro ao buscar serviços:', error);
          throw error;
        }
        
        console.log('Serviços encontrados:', data);
        return data as Servico[];
      }
      
      const { data, error } = await supabase
        .from('servicos')
        .select('*')
        .eq('empresa_id', empresaId)
        .eq('ativo', true)
        .order('nome');
      
      if (error) {
        console.error('Erro ao buscar serviços da empresa:', error);
        throw error;
      }
      
      console.log('Serviços da empresa encontrados:', data);
      return data as Servico[];
    },
  });
};

export const useCreateServicoManager = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (servicoData: Omit<Servico, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('Criando serviço com dados:', servicoData);
      
      const { data, error } = await supabase
        .from('servicos')
        .insert([servicoData])
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao criar serviço:', error);
        throw error;
      }
      
      console.log('Serviço criado com sucesso:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicos'] });
      toast({
        title: "Sucesso!",
        description: "Serviço criado com sucesso",
      });
    },
    onError: (error) => {
      console.error('Erro ao criar serviço:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar serviço",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateServicoManager = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Servico> }) => {
      console.log('Atualizando serviço:', id, 'com dados:', updates);
      
      const { data, error } = await supabase
        .from('servicos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao atualizar serviço:', error);
        throw error;
      }
      
      console.log('Serviço atualizado com sucesso:', data);
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
        title: "Erro",
        description: "Erro ao atualizar serviço",
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
        .update({ ativo: false })
        .eq('id', id);
      
      if (error) throw error;
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
        title: "Erro",
        description: "Erro ao excluir serviço",
        variant: "destructive",
      });
    },
  });
};

export const useCreateServico = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (servicoData: Omit<Servico, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('servicos')
        .insert([servicoData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['servicos', variables.empresa_id] });
      toast({
        title: "Sucesso!",
        description: "Serviço criado com sucesso",
      });
    },
    onError: (error) => {
      console.error('Erro ao criar serviço:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar serviço",
        variant: "destructive",
      });
    },
  });
};
