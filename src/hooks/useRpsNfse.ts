
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface EmitirRpsData {
  prestador_id: string;
  tomador_nome: string;
  tomador_cnpj_cpf: string;
  tomador_endereco: string;
  tomador_email: string;
  discriminacao: string;
  valor_servicos: number;
  valor_iss: number;
  valor_liquido: number;
  itens: Array<{
    servico_id?: string;
    descricao: string;
    quantidade: number;
    valor_unitario: number;
    valor_total: number;
    codigo_servico?: string;
    aliquota_iss: number;
  }>;
}

const processarNfse = async (rps: any, dados: EmitirRpsData) => {
  console.log('Processando NFSe para RPS:', rps.numero_rps);
  
  // Simular processamento da NFSe
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simular diferentes cenários
  const success = Math.random() > 0.1; // 90% de sucesso
  
  if (success) {
    return {
      success: true,
      numero_rps: rps.numero_rps.toString(),
      numero_nfse: `NFSE-${Date.now()}`,
      mensagem: 'NFSe processada com sucesso',
      xml_nfse: `<nfse><numero>${Date.now()}</numero><rps>${rps.numero_rps}</rps></nfse>`
    };
  } else {
    return {
      success: false,
      numero_rps: rps.numero_rps.toString(),
      mensagem: 'Erro no processamento da NFSe (simulação)'
    };
  }
};

export const useEmitirRpsNfse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dados: EmitirRpsData) => {
      console.log('Emitindo RPS NFSe com dados:', dados);
      
      // Buscar dados completos da empresa
      const { data: empresaCompleta, error: empresaError } = await supabase
        .from('empresas')
        .select('*')
        .eq('id', dados.prestador_id)
        .single();

      if (empresaError || !empresaCompleta) {
        throw new Error('Empresa não encontrada: ' + empresaError?.message);
      }

      console.log('Dados da empresa carregados:', empresaCompleta);

      // 1. Criar RPS no banco com dados completos da empresa
      const rpsData = {
        prestador_id: dados.prestador_id,
        numero_rps: Math.floor(Math.random() * 999999) + 1,
        serie_rps: '1',
        data_emissao: new Date().toISOString(),
        tomador_nome: dados.tomador_nome,
        tomador_cnpj_cpf: dados.tomador_cnpj_cpf,
        tomador_endereco: dados.tomador_endereco,
        tomador_email: dados.tomador_email,
        discriminacao: dados.discriminacao,
        codigo_servico: dados.itens[0]?.codigo_servico || '01.01',
        aliquota_iss: dados.itens[0]?.aliquota_iss || 5.0,
        valor_servicos: dados.valor_servicos,
        valor_iss: dados.valor_iss,
        valor_liquido: dados.valor_liquido,
        status: 'processando',
        xml_rps: '', // Será preenchido após geração
        codigo_verificacao: Math.random().toString(36).substring(2, 15).toUpperCase()
      };

      const { data: rps, error: rpsError } = await supabase
        .from('rps_nfse')
        .insert(rpsData)
        .select()
        .single();

      if (rpsError) {
        console.error('Erro ao criar RPS:', rpsError);
        throw new Error('Erro ao criar RPS: ' + rpsError.message);
      }

      console.log('RPS criado:', rps);

      // 2. Simular processamento NFSe com dados completos da empresa
      const nfseResult = await processarNfse(rps, dados);

      // 3. Atualizar status do RPS
      const { error: updateError } = await supabase
        .from('rps_nfse')
        .update({
          status: nfseResult.success ? 'autorizada' : 'rejeitada',
          numero_nfse: nfseResult.numero_nfse,
          data_processamento: new Date().toISOString(),
          xml_rps: nfseResult.xml_nfse || rpsData.xml_rps
        })
        .eq('id', rps.id);

      if (updateError) {
        console.error('Erro ao atualizar RPS:', updateError);
      }

      return {
        rps: { ...rps, status: nfseResult.success ? 'autorizada' : 'rejeitada' },
        nfseResult,
        empresa: empresaCompleta
      };
    },

    onSuccess: (data) => {
      console.log('RPS NFSe emitido com sucesso:', data);
      queryClient.invalidateQueries({ queryKey: ['rps-nfse'] });
      
      if (data.nfseResult.success) {
        const empresaName = data.empresa?.razao_social || 'Empresa não identificada';
        toast({
          title: "RPS Emitido com Sucesso!",
          description: `RPS ${data.nfseResult.numero_rps} processado para ${empresaName}. NFSe: ${data.nfseResult.numero_nfse}`,
        });
      } else {
        toast({
          title: "RPS Criado",
          description: `RPS ${data.nfseResult.numero_rps} criado mas com erro no processamento: ${data.nfseResult.mensagem}`,
          variant: "destructive",
        });
      }
    },

    onError: (error) => {
      console.error('Erro ao emitir RPS NFSe:', error);
      toast({
        title: "Erro na Emissão",
        description: error instanceof Error ? error.message : "Erro desconhecido ao emitir RPS NFSe",
        variant: "destructive",
      });
    },
  });
};
