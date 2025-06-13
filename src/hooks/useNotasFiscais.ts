
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useNotasFiscais = () => {
  return useQuery({
    queryKey: ['notas-fiscais'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notas_fiscais')
        .select(`
          *,
          empresas (
            razao_social,
            nome_fantasia
          ),
          clientes (
            nome_razao_social,
            cpf_cnpj
          ),
          transportadoras:contatos!transportadora_id (
            nome_razao_social,
            cpf_cnpj,
            placa_veiculo
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateNotaFiscal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (notaData: any) => {
      console.log('Criando nota fiscal com integração SEFAZ:', notaData);
      
      // 1. Salvar nota no banco como rascunho primeiro
      const { data: notaSalva, error: errorSave } = await supabase
        .from('notas_fiscais')
        .insert([{
          ...notaData,
          status: 'rascunho'
        }])
        .select()
        .single();
      
      if (errorSave) throw errorSave;
      
      try {
        // 2. Chamar Edge Function para emissão na SEFAZ
        const { data: sefazResult, error: sefazError } = await supabase.functions.invoke('sefaz-integration', {
          body: {
            operation: 'emitir_nfe',
            data: {
              ...notaData,
              nota_fiscal_id: notaSalva.id
            }
          }
        });
        
        if (sefazError) throw sefazError;
        
        // 3. Atualizar nota com dados da SEFAZ
        if (sefazResult.success) {
          const { data: notaAtualizada } = await supabase
            .from('notas_fiscais')
            .update({
              chave_acesso: sefazResult.chave_acesso,
              protocolo_autorizacao: sefazResult.protocolo,
              codigo_retorno_sefaz: sefazResult.codigo_retorno,
              mensagem_retorno_sefaz: sefazResult.mensagem_retorno,
              status: 'autorizada',
              data_autorizacao: new Date().toISOString()
            })
            .eq('id', notaSalva.id)
            .select()
            .single();
          
          toast({
            title: "Sucesso!",
            description: `NFe autorizada - Chave: ${sefazResult.chave_acesso}`,
          });
          
          return { data: notaAtualizada, sefazResult };
        } else {
          // Erro na SEFAZ - atualizar status da nota
          await supabase
            .from('notas_fiscais')
            .update({
              status: 'erro',
              codigo_retorno_sefaz: sefazResult.codigo_retorno,
              mensagem_retorno_sefaz: sefazResult.mensagem_retorno || sefazResult.error
            })
            .eq('id', notaSalva.id);
          
          throw new Error(sefazResult.mensagem_retorno || sefazResult.error);
        }
        
      } catch (error) {
        console.error('Erro na integração SEFAZ:', error);
        
        // Atualizar nota com erro
        await supabase
          .from('notas_fiscais')
          .update({
            status: 'erro',
            mensagem_retorno_sefaz: error instanceof Error ? error.message : 'Erro desconhecido'
          })
          .eq('id', notaSalva.id);
        
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notas-fiscais'] });
    },
    onError: (error) => {
      console.error('Erro ao criar nota fiscal:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao criar nota fiscal",
        variant: "destructive",
      });
    },
  });
};

export const useCancelarNotaFiscal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (cancelData: {
      nota_fiscal_id: string;
      chave_acesso: string;
      empresa_id: string;
      justificativa: string;
    }) => {
      console.log('Cancelando nota fiscal:', cancelData);
      
      // Chamar Edge Function para cancelamento na SEFAZ
      const { data: sefazResult, error: sefazError } = await supabase.functions.invoke('sefaz-integration', {
        body: {
          operation: 'cancelar_nfe',
          data: cancelData
        }
      });
      
      if (sefazError) throw sefazError;
      
      if (sefazResult.success) {
        // Atualizar nota como cancelada
        const { data, error } = await supabase
          .from('notas_fiscais')
          .update({
            status: 'cancelada',
            justificativa_cancelamento: cancelData.justificativa,
            data_cancelamento: new Date().toISOString(),
            codigo_retorno_sefaz: sefazResult.codigo_retorno,
            mensagem_retorno_sefaz: sefazResult.mensagem_retorno
          })
          .eq('id', cancelData.nota_fiscal_id)
          .select()
          .single();
        
        if (error) throw error;
        
        toast({
          title: "Sucesso!",
          description: "Nota fiscal cancelada com sucesso",
        });
        
        return { data, sefazResult };
      } else {
        throw new Error(sefazResult.mensagem_retorno || sefazResult.error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notas-fiscais'] });
    },
    onError: (error) => {
      console.error('Erro ao cancelar nota fiscal:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao cancelar nota fiscal",
        variant: "destructive",
      });
    },
  });
};

export const useConsultarNotaFiscal = () => {
  return useMutation({
    mutationFn: async (consultaData: {
      chave_acesso: string;
      empresa_id: string;
    }) => {
      console.log('Consultando nota fiscal:', consultaData);
      
      const { data: sefazResult, error: sefazError } = await supabase.functions.invoke('sefaz-integration', {
        body: {
          operation: 'consultar_nfe',
          data: consultaData
        }
      });
      
      if (sefazError) throw sefazError;
      
      return sefazResult;
    },
    onSuccess: (data) => {
      toast({
        title: data.success ? "Consulta realizada" : "Erro na consulta",
        description: data.mensagem_retorno || 'Consulta de NFe realizada',
        variant: data.success ? "default" : "destructive",
      });
    },
    onError: (error) => {
      console.error('Erro ao consultar nota fiscal:', error);
      toast({
        title: "Erro",
        description: "Erro ao consultar nota fiscal",
        variant: "destructive",
      });
    },
  });
};
