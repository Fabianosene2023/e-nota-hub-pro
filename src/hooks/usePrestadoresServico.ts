
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface PrestadorServico {
  id: string;
  empresa_id: string;
  cnpj: string;
  inscricao_municipal?: string;
  regime_tributario: string;
  certificado_digital_id?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export const usePrestadoresServico = (empresaId: string) => {
  return useQuery({
    queryKey: ['prestadores-servico', empresaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prestadores_servico')
        .select('*')
        .eq('empresa_id', empresaId)
        .eq('ativo', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as PrestadorServico[];
    },
    enabled: !!empresaId,
  });
};

export const useCreatePrestadorServico = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (prestadorData: {
      empresa_id: string;
      cnpj: string;
      inscricao_municipal?: string;
      regime_tributario: string;
      certificado_digital_id?: string;
    }) => {
      const { data, error } = await supabase
        .from('prestadores_servico')
        .insert([prestadorData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['prestadores-servico', variables.empresa_id] });
      toast({
        title: "Sucesso!",
        description: "Prestador de serviço cadastrado com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao cadastrar prestador de serviço",
        variant: "destructive",
      });
    },
  });
};

export const useUpdatePrestadorServico = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (prestadorData: {
      id: string;
      empresa_id: string;
      cnpj: string;
      inscricao_municipal?: string;
      regime_tributario: string;
      certificado_digital_id?: string;
    }) => {
      const { data, error } = await supabase
        .from('prestadores_servico')
        .update({
          cnpj: prestadorData.cnpj,
          inscricao_municipal: prestadorData.inscricao_municipal,
          regime_tributario: prestadorData.regime_tributario,
          certificado_digital_id: prestadorData.certificado_digital_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', prestadorData.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['prestadores-servico', variables.empresa_id] });
      toast({
        title: "Sucesso!",
        description: "Prestador de serviço atualizado com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar prestador de serviço",
        variant: "destructive",
      });
    },
  });
};
