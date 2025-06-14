
import { supabase } from '@/integrations/supabase/client';

export class NFEMutationService {
  static async createNotaFiscal(notaData: any) {
    // 1. Save draft note first
    const notaSalva = await this.saveNotaAsDraft(notaData);
    
    try {
      // 2. Call Edge Function for SEFAZ emission
      const sefazResult = await this.callSefazIntegration('emitir_nfe', {
        ...notaData,
        nota_fiscal_id: notaSalva.id
      });
      
      // 3. Update note with SEFAZ data
      return await this.updateNotaWithSefazResult(notaSalva.id, sefazResult, notaData);
      
    } catch (error) {
      console.error('Erro na integração SEFAZ:', error);
      await this.markNotaAsError(notaSalva.id, error);
      throw error;
    }
  }

  static async cancelNotaFiscal(cancelData: any) {
    const sefazResult = await this.callSefazIntegration('cancelar_nfe', cancelData);
    
    if (sefazResult.success) {
      return await this.updateNotaAsCancelled(cancelData, sefazResult);
    } else {
      throw new Error(sefazResult.mensagem_retorno || sefazResult.error);
    }
  }

  static async consultarNotaFiscal(consultaData: any) {
    return await this.callSefazIntegration('consultar_nfe', consultaData);
  }

  private static async saveNotaAsDraft(notaData: any) {
    const { data: notaSalva, error: errorSave } = await supabase
      .from('notas_fiscais')
      .insert([{
        ...notaData,
        status: 'rascunho'
      }])
      .select()
      .single();
    
    if (errorSave) throw errorSave;
    return notaSalva;
  }

  private static async callSefazIntegration(operation: string, data: any) {
    const { data: sefazResult, error: sefazError } = await supabase.functions.invoke('sefaz-integration', {
      body: {
        operation,
        data
      }
    });
    
    if (sefazError) throw sefazError;
    return sefazResult;
  }

  private static async updateNotaWithSefazResult(notaId: string, sefazResult: any, notaData: any) {
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
      return { data, sefazResult };
    } else {
      await this.markNotaAsError(notaId, new Error(sefazResult.mensagem_retorno || sefazResult.error));
      throw new Error(sefazResult.mensagem_retorno || sefazResult.error);
    }
  }

  private static async updateNotaAsCancelled(cancelData: any, sefazResult: any) {
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

  private static async markNotaAsError(notaId: string, error: unknown) {
    await supabase
      .from('notas_fiscais')
      .update({
        status: 'erro',
        mensagem_retorno_sefaz: error instanceof Error ? error.message : 'Erro desconhecido'
      })
      .eq('id', notaId);
  }
}
