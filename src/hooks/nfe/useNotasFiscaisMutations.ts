
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Mutation hooks for NFe operations
 */
export const useCreateNotaFiscalMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (notaData: any) => {
      console.log('Criando nota fiscal com integração SEFAZ:', notaData);
      
      // 1. Save draft note first
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
        // 2. Call Edge Function for SEFAZ emission
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
        
        // 3. Update note with SEFAZ data
        return await updateNotaWithSefazResult(notaSalva.id, sefazResult, notaData);
        
      } catch (error) {
        console.error('Erro na integração SEFAZ:', error);
        await markNotaAsError(notaSalva.id, error);
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

export const useCancelarNotaFiscalMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (cancelData: {
      nota_fiscal_id: string;
      chave_acesso: string;
      empresa_id: string;
      justificativa: string;
    }) => {
      console.log('Cancelando nota fiscal:', cancelData);
      
      const { data: sefazResult, error: sefazError } = await supabase.functions.invoke('sefaz-integration', {
        body: {
          operation: 'cancelar_nfe',
          data: cancelData
        }
      });
      
      if (sefazError) throw sefazError;
      
      if (sefazResult.success) {
        return await updateNotaAsCancelled(cancelData, sefazResult);
      } else {
        throw new Error(sefazResult.mensagem_retorno || sefazResult.error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notas-fiscais'] });
      toast({
        title: "Sucesso!",
        description: "Nota fiscal cancelada com sucesso",
      });
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

export const useConsultarNotaFiscalMutation = () => {
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

// Helper functions
async function updateNotaWithSefazResult(notaId: string, sefazResult: any, notaData: any) {
  if (sefazResult.success) {
    const { data, error } = await supabase
      .from('notas_fiscais')
      .update({
        chave_acesso: sefazResult.chave_acesso,
        protocolo_autorizacao: sefazResult.protocolo,
        codigo_retorno_sefaz: sefazResult.codigo_retorno,
        mensagem_retorno_sefaz: sefazResult.mensagem_retorno,
        status: 'autorizada',
        data_autorizacao: new Date().toISOString()
      })
      .eq('id', notaId)
      .select()
      .single();
    
    if (error) throw error;
    
    toast({
      title: "Sucesso!",
      description: `NFe autorizada - Chave: ${sefazResult.chave_acesso}`,
    });
    
    return { data, sefazResult };
  } else {
    await supabase
      .from('notas_fiscais')
      .update({
        status: 'erro',
        codigo_retorno_sefaz: sefazResult.codigo_retorno,
        mensagem_retorno_sefaz: sefazResult.mensagem_retorno || sefazResult.error
      })
      .eq('id', notaId);
    
    throw new Error(sefazResult.mensagem_retorno || sefazResult.error);
  }
}

async function markNotaAsError(notaId: string, error: unknown) {
  await supabase
    .from('notas_fiscais')
    .update({
      status: 'erro',
      mensagem_retorno_sefaz: error instanceof Error ? error.message : 'Erro desconhecido'
    })
    .eq('id', notaId);
}

async function updateNotaAsCancelled(cancelData: any, sefazResult: any) {
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
  return { data, sefazResult };
}
