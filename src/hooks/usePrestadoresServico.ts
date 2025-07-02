import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface PrestadorServicoCompleto {
  id: string;
  empresa_id: string;
  cnpj: string;
  inscricao_municipal?: string;
  regime_tributario: string;
  certificado_digital_id?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
  // Dados da empresa
  empresa?: {
    id: string;
    razao_social: string;
    nome_fantasia?: string;
    endereco: string;
    cidade: string;
    estado: string;
    cep: string;
    telefone?: string;
    email?: string;
    inscricao_estadual?: string;
    inscricao_municipal?: string;
  } | null;
}

export const usePrestadoresServico = (empresaId?: string) => {
  const { profile } = useAuth();
  const effectiveEmpresaId = empresaId || profile?.empresa_id;

  return useQuery({
    queryKey: ['prestadores-servico', effectiveEmpresaId],
    queryFn: async () => {
      if (!effectiveEmpresaId) {
        console.log('No empresa_id provided for prestadores query');
        return [];
      }

      console.log('Fetching prestadores for empresa_id:', effectiveEmpresaId);
      
      const { data, error } = await supabase
        .from('prestadores_servico')
        .select(`
          *,
          empresas!prestadores_servico_empresa_id_fkey (
            id,
            razao_social,
            nome_fantasia,
            endereco,
            cidade,
            estado,
            cep,
            telefone,
            email,
            inscricao_estadual,
            inscricao_municipal
          )
        `)
        .eq('empresa_id', effectiveEmpresaId)
        .eq('ativo', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching prestadores:', error);
        throw error;
      }
      
      console.log('Prestadores fetched successfully:', data);
      
      // Transform data to match our interface
      const transformedData: PrestadorServicoCompleto[] = data?.map(item => ({
        ...item,
        empresa: Array.isArray(item.empresas) ? item.empresas[0] : item.empresas
      })) || [];
      
      return transformedData;
    },
    enabled: !!effectiveEmpresaId,
  });
};

export const useCreatePrestadorServico = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuth();
  
  return useMutation({
    mutationFn: async (prestadorData: {
      empresa_id?: string;
      cnpj: string;
      inscricao_municipal?: string;
      regime_tributario: string;
      certificado_digital_id?: string;
    }) => {
      const empresaId = prestadorData.empresa_id || profile?.empresa_id;
      
      if (!empresaId) {
        throw new Error('ID da empresa é obrigatório');
      }

      const dataToInsert = {
        ...prestadorData,
        empresa_id: empresaId
      };

      console.log('Creating prestador with data:', dataToInsert);

      const { data, error } = await supabase
        .from('prestadores_servico')
        .insert([dataToInsert])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating prestador:', error);
        throw error;
      }
      
      console.log('Prestador created successfully:', data);
      return data;
    },
    onSuccess: (data) => {
      const empresaId = data.empresa_id;
      queryClient.invalidateQueries({ queryKey: ['prestadores-servico', empresaId] });
      queryClient.invalidateQueries({ queryKey: ['prestadores-servico'] });
      toast({
        title: "Sucesso!",
        description: "Prestador de serviço cadastrado com sucesso",
      });
    },
    onError: (error: any) => {
      console.error('Error in createPrestador mutation:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao cadastrar prestador de serviço",
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
      queryClient.invalidateQueries({ queryKey: ['prestadores-servico'] });
      toast({
        title: "Sucesso!",
        description: "Prestador de serviço atualizado com sucesso",
      });
    },
    onError: (error: any) => {
      console.error('Error updating prestador:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar prestador de serviço",
        variant: "destructive",
      });
    },
  });
};
