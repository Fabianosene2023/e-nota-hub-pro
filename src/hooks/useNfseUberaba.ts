
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface NFSeEmissaoData {
  empresa_id: string;
  tomador_nome: string;
  tomador_cpf_cnpj?: string;
  tomador_email?: string;
  tomador_endereco?: string;
  descricao_servico: string;
  valor_servico: number;
  codigo_servico: string;
  aliquota_iss: number;
}

export interface NFSeResponse {
  id: string;
  numero_rps: string;
  numero_nfse: string;
  codigo_verificacao?: string;
  protocolo?: string;
  status: string;
  data_emissao: string;
  valor_total: number;
  xml_nfse?: string;
}

export const useEmitirNfseUberaba = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: NFSeEmissaoData): Promise<NFSeResponse> => {
      // Chama a Edge Function para emitir NFSe
      const { data: result, error } = await supabase.functions.invoke('nfse-integration', {
        body: {
          action: 'emitir_nfse',
          municipio: 'uberaba',
          ...data
        }
      });

      if (error) {
        console.error('Erro ao emitir NFSe:', error);
        throw new Error(error.message || 'Erro ao emitir NFSe');
      }

      if (!result || result.error) {
        throw new Error(result?.error || 'Erro desconhecido ao emitir NFSe');
      }

      return result as NFSeResponse;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['nfse'] });
      toast({
        title: "NFSe Emitida com Sucesso!",
        description: `NFSe número ${data.numero_nfse} emitida no valor de R$ ${data.valor_total?.toFixed(2)}`,
      });
    },
    onError: (error) => {
      console.error('Erro na emissão de NFSe:', error);
      toast({
        title: "Erro na Emissão",
        description: error instanceof Error ? error.message : "Erro ao emitir NFSe",
        variant: "destructive",
      });
    },
  });
};

export const useConsultarNfse = () => {
  return useMutation({
    mutationFn: async (numeroNfse: string) => {
      const { data: result, error } = await supabase.functions.invoke('nfse-integration', {
        body: {
          action: 'consultar_nfse',
          numero_nfse: numeroNfse
        }
      });

      if (error) throw error;
      return result;
    },
    onError: (error) => {
      toast({
        title: "Erro na Consulta",
        description: error instanceof Error ? error.message : "Erro ao consultar NFSe",
        variant: "destructive",
      });
    },
  });
};
