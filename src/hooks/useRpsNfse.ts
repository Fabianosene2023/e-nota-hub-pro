
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface RpsNfse {
  id: string;
  prestador_id: string;
  numero_rps: number;
  serie_rps: string;
  data_emissao: string;
  status: string;
  tomador_nome: string;
  tomador_cnpj_cpf?: string;
  valor_servicos: number;
  valor_iss: number;
  valor_liquido: number;
  discriminacao: string;
  codigo_servico?: string;
  aliquota_iss: number;
  iss_retido: boolean;
  numero_nfse?: string;
  codigo_verificacao?: string;
  protocolo?: string;
  created_at: string;
}

export const useRpsNfse = (prestadorId: string) => {
  return useQuery({
    queryKey: ['rps-nfse', prestadorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rps_nfse')
        .select('*')
        .eq('prestador_id', prestadorId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as RpsNfse[];
    },
    enabled: !!prestadorId,
  });
};

export const useEmitirRpsNfse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (rpsData: {
      prestador_id: string;
      tomador_nome: string;
      tomador_cnpj_cpf?: string;
      tomador_endereco?: string;
      tomador_email?: string;
      discriminacao: string;
      itens: Array<{
        servico_id?: string;
        descricao: string;
        quantidade: number;
        valor_unitario: number;
        valor_total: number;
        codigo_servico?: string;
        aliquota_iss: number;
      }>;
    }) => {
      // Calcular valores totais
      const valor_servicos = rpsData.itens.reduce((total, item) => total + item.valor_total, 0);
      const valor_iss = rpsData.itens.reduce((total, item) => 
        total + (item.valor_total * (item.aliquota_iss / 100)), 0
      );
      const valor_liquido = valor_servicos - valor_iss;

      // Criar RPS
      const { data: rps, error: rpsError } = await supabase
        .from('rps_nfse')
        .insert([{
          prestador_id: rpsData.prestador_id,
          numero_rps: Date.now(), // Temporário - usar sequencial da configuração
          tomador_nome: rpsData.tomador_nome,
          tomador_cnpj_cpf: rpsData.tomador_cnpj_cpf,
          tomador_endereco: rpsData.tomador_endereco,
          tomador_email: rpsData.tomador_email,
          discriminacao: rpsData.discriminacao,
          valor_servicos,
          valor_iss,
          valor_liquido,
          aliquota_iss: rpsData.itens[0]?.aliquota_iss || 0,
          codigo_servico: rpsData.itens[0]?.codigo_servico,
          status: 'processando'
        }])
        .select()
        .single();
      
      if (rpsError) throw rpsError;

      // Criar itens do RPS
      const itensData = rpsData.itens.map(item => ({
        rps_id: rps.id,
        servico_id: item.servico_id,
        descricao: item.descricao,
        quantidade: item.quantidade,
        valor_unitario: item.valor_unitario,
        valor_total: item.valor_total,
        codigo_servico: item.codigo_servico,
        aliquota_iss: item.aliquota_iss
      }));

      const { error: itensError } = await supabase
        .from('itens_rps_nfse')
        .insert(itensData);
      
      if (itensError) throw itensError;

      // Chamar Edge Function para emitir NFSe
      const { data: nfseResult, error: nfseError } = await supabase.functions.invoke('nfse-integration', {
        body: {
          operation: 'emitir_nfse',
          rps_id: rps.id,
          prestador_id: rpsData.prestador_id
        }
      });

      if (nfseError) throw nfseError;

      return { rps, nfseResult };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['rps-nfse', variables.prestador_id] });
      toast({
        title: "Sucesso!",
        description: "RPS/NFSe processado com sucesso",
      });
    },
    onError: (error) => {
      console.error('Erro ao emitir RPS/NFSe:', error);
      toast({
        title: "Erro na Emissão",
        description: "Erro ao processar RPS/NFSe",
        variant: "destructive",
      });
    },
  });
};
