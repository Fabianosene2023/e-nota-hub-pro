
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { SEFAZRealIntegration } from '@/utils/sefazRealIntegration';

export class NFEProductionService {
  static async createNotaFiscal(notaData: any, recuperarCertificado: (id: string) => Promise<any>) {
    try {
      // 1. Salvar nota no banco como rascunho
      const notaSalva = await this.saveNotaAsDraft(notaData);
      
      // 2. Buscar configurações e certificado
      const { configs, certificadoVault } = await this.getConfigsAndCertificate(notaData.empresa_id);
      
      // 3. Recuperar certificado do Vault
      const dadosCertificado = await recuperarCertificado(certificadoVault.id);
      
      // 4. Buscar dados completos para NFe
      const dadosCompletos = await this.getCompleteNFeData(notaData);
      
      // 5. Emitir NFe com integração real
      const resultadoSefaz = await this.emitirNFeReal(configs, dadosCompletos, dadosCertificado);
      
      // 6. Atualizar nota com resultado
      const notaAtualizada = await this.updateNotaWithResult(notaSalva.id, resultadoSefaz, configs);
      
      // 7. Atualizar número sequencial se sucesso
      if (resultadoSefaz.success) {
        await this.updateSequentialNumber(notaData.empresa_id, configs);
        
        toast({
          title: "NFe Emitida com Sucesso!",
          description: `Chave de Acesso: ${resultadoSefaz.chave_acesso}`,
        });
      } else {
        toast({
          title: "Erro na Emissão",
          description: resultadoSefaz.mensagem_retorno,
          variant: "destructive",
        });
      }
      
      return { data: notaAtualizada, sefazResult: resultadoSefaz };
      
    } catch (error) {
      console.error('Erro na criação de NFe de produção:', error);
      
      if (notaData.id) {
        await this.markNotaAsError(notaData.id, error);
      }
      
      throw error;
    }
  }

  static async cancelNotaFiscal(cancelData: any, recuperarCertificado: (id: string) => Promise<any>) {
    // Buscar configurações e certificado
    const { configs, certificadoVault } = await this.getConfigsAndCertificate(cancelData.empresa_id);
    
    // Recuperar certificado do Vault
    const dadosCertificado = await recuperarCertificado(certificadoVault.id);
    
    // Cancelar na SEFAZ
    const configuracaoSefaz = {
      ambiente: configs.ambiente as 'homologacao' | 'producao',
      uf: 'SP', // TODO: Buscar UF da empresa
      certificado: {
        p12Buffer: dadosCertificado.p12Buffer,
        senha: dadosCertificado.senha
      },
      timeout: configs.timeout_sefaz
    };
    
    const resultadoSefaz = await SEFAZRealIntegration.cancelarNFeReal(
      cancelData.chave_acesso,
      cancelData.justificativa,
      configuracaoSefaz
    );
    
    if (resultadoSefaz.success) {
      // Atualizar nota como cancelada
      const { data, error } = await supabase
        .from('notas_fiscais')
        .update({
          status: 'cancelada',
          justificativa_cancelamento: cancelData.justificativa,
          data_cancelamento: new Date().toISOString(),
          codigo_retorno_sefaz: resultadoSefaz.codigo_retorno,
          mensagem_retorno_sefaz: resultadoSefaz.mensagem_retorno
        })
        .eq('id', cancelData.nota_fiscal_id)
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Sucesso!",
        description: "Nota fiscal cancelada na SEFAZ",
      });
      
      return { data, sefazResult: resultadoSefaz };
    } else {
      throw new Error(resultadoSefaz.mensagem_retorno);
    }
  }

  private static async saveNotaAsDraft(notaData: any) {
    const { data: notaSalva, error: errorSave } = await supabase
      .from('notas_fiscais')
      .insert([{
        ...notaData,
        status: 'processando'
      }])
      .select()
      .single();
    
    if (errorSave) throw errorSave;
    return notaSalva;
  }

  private static async getConfigsAndCertificate(empresaId: string) {
    const { data: configs } = await supabase
      .from('configuracoes_sefaz')
      .select('*')
      .eq('empresa_id', empresaId)
      .single();
      
    if (!configs) {
      throw new Error('Configurações SEFAZ não encontradas');
    }
    
    const { data: certificadoVault } = await supabase
      .from('certificados_vault')
      .select('*')
      .eq('empresa_id', empresaId)
      .eq('ativo', true)
      .single();
      
    if (!certificadoVault) {
      throw new Error('Certificado digital não encontrado');
    }

    return { configs, certificadoVault };
  }

  private static async getCompleteNFeData(notaData: any) {
    const [empresaResult, clienteResult] = await Promise.all([
      supabase.from('empresas').select('*').eq('id', notaData.empresa_id).single(),
      supabase.from('clientes').select('*').eq('id', notaData.cliente_id).single()
    ]);
    
    if (empresaResult.error || clienteResult.error) {
      throw new Error('Erro ao buscar dados da empresa ou cliente');
    }

    return {
      empresa: empresaResult.data,
      cliente: clienteResult.data,
      itens: notaData.itens || [],
      numero: notaData.numero,
      serie: notaData.serie,
      natureza_operacao: notaData.natureza_operacao || 'Venda',
      valor_total: notaData.valor_total
    };
  }

  private static async emitirNFeReal(configs: any, dadosNFeCompletos: any, dadosCertificado: any) {
    const configuracaoSefaz = {
      ambiente: configs.ambiente as 'homologacao' | 'producao',
      uf: dadosNFeCompletos.empresa.estado,
      certificado: {
        p12Buffer: dadosCertificado.p12Buffer,
        senha: dadosCertificado.senha
      },
      timeout: configs.timeout_sefaz
    };

    return await SEFAZRealIntegration.emitirNFeReal(
      dadosNFeCompletos,
      configuracaoSefaz
    );
  }

  private static async updateNotaWithResult(notaId: string, resultadoSefaz: any, configs: any) {
    const statusNota = resultadoSefaz.success ? 'autorizada' : 'erro';
    
    const { data: notaAtualizada, error: updateError } = await supabase
      .from('notas_fiscais')
      .update({
        chave_acesso: resultadoSefaz.chave_acesso,
        protocolo_autorizacao: resultadoSefaz.protocolo,
        codigo_retorno_sefaz: resultadoSefaz.codigo_retorno,
        mensagem_retorno_sefaz: resultadoSefaz.mensagem_retorno,
        status: statusNota,
        xml_nfe: resultadoSefaz.xml_assinado,
        danfe_pdf_url: resultadoSefaz.danfe_url,
        data_autorizacao: resultadoSefaz.success ? new Date().toISOString() : null,
        numero: configs.proximo_numero_nfe
      })
      .eq('id', notaId)
      .select()
      .single();
      
    if (updateError) throw updateError;
    return notaAtualizada;
  }

  private static async updateSequentialNumber(empresaId: string, configs: any) {
    await supabase
      .from('configuracoes_sefaz')
      .update({ 
        proximo_numero_nfe: configs.proximo_numero_nfe + 1,
        updated_at: new Date().toISOString()
      })
      .eq('empresa_id', empresaId);
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
