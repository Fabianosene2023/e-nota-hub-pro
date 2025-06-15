
import { supabase } from '@/integrations/supabase/client';
import { SEFAZRealIntegration } from '@/utils/sefazRealIntegration';
import { toast } from '@/hooks/use-toast';

export class NFEProductionService {
  static async createNotaFiscal(
    notaData: any,
    recuperarCertificado: (id: string) => Promise<any>
  ) {
    try {
      // 1. Salvar nota no banco como processando
      const { data: notaSalva, error: errorSave } = await supabase
        .from('notas_fiscais')
        .insert([{
          ...notaData,
          status: 'processando'
        }])
        .select()
        .single();
      
      if (errorSave) throw errorSave;
      
      // 2. Buscar configurações e certificado
      const [configsResult, certificadoResult] = await Promise.all([
        supabase
          .from('configuracoes_sefaz')
          .select('*')
          .eq('empresa_id', notaData.empresa_id)
          .single(),
        supabase
          .from('certificados_vault')
          .select('*')
          .eq('empresa_id', notaData.empresa_id)
          .eq('ativo', true)
          .single()
      ]);
      
      if (configsResult.error || certificadoResult.error) {
        throw new Error('Configurações SEFAZ ou certificado não encontrados');
      }
      
      const configs = configsResult.data;
      const certificadoVault = certificadoResult.data;
      
      // 3. Recuperar certificado do Vault
      const dadosCertificado = await recuperarCertificado(certificadoVault.id);
      
      // 4. Buscar dados completos para NFe
      const [empresaResult, clienteResult] = await Promise.all([
        supabase.from('empresas').select('*').eq('id', notaData.empresa_id).single(),
        supabase.from('clientes').select('*').eq('id', notaData.cliente_id).single()
      ]);
      
      if (empresaResult.error || clienteResult.error) {
        throw new Error('Erro ao buscar dados da empresa ou cliente');
      }
      
      // 5. Configurar para integração real com SEFAZ
      const configuracaoSefaz = {
        ambiente: configs.ambiente as 'homologacao' | 'producao',
        uf: empresaResult.data.estado,
        certificado: {
          p12Buffer: dadosCertificado.p12Buffer,
          senha: dadosCertificado.senha
        },
        timeout: configs.timeout_sefaz || 30000
      };
      
      const dadosNFeCompletos = {
        empresa: empresaResult.data,
        cliente: clienteResult.data,
        itens: notaData.itens || [],
        numero: configs.proximo_numero_nfe,
        serie: configs.serie_nfe,
        natureza_operacao: notaData.natureza_operacao || 'Venda',
        valor_total: notaData.valor_total
      };
      
      // 6. Emitir NFe com integração REAL da SEFAZ
      const resultadoSefaz = await SEFAZRealIntegration.emitirNFeReal(
        dadosNFeCompletos,
        configuracaoSefaz
      );
      
      // 7. Atualizar nota com resultado da SEFAZ
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
          numero: dadosNFeCompletos.numero
        })
        .eq('id', notaSalva.id)
        .select()
        .single();
        
      if (updateError) throw updateError;
      
      // 8. Atualizar número sequencial se sucesso
      if (resultadoSefaz.success) {
        await supabase
          .from('configuracoes_sefaz')
          .update({ 
            proximo_numero_nfe: configs.proximo_numero_nfe + 1,
            updated_at: new Date().toISOString()
          })
          .eq('empresa_id', notaData.empresa_id);
          
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
      
      // Atualizar nota com erro se já foi salva
      if (notaData.id) {
        await supabase
          .from('notas_fiscais')
          .update({
            status: 'erro',
            mensagem_retorno_sefaz: error instanceof Error ? error.message : 'Erro desconhecido'
          })
          .eq('id', notaData.id);
      }
      
      throw error;
    }
  }

  static async cancelNotaFiscal(
    cancelData: {
      nota_fiscal_id: string;
      chave_acesso: string;
      empresa_id: string;
      justificativa: string;
    },
    recuperarCertificado: (id: string) => Promise<any>
  ) {
    // Buscar configurações e certificado
    const [configsResult, certificadoResult] = await Promise.all([
      supabase
        .from('configuracoes_sefaz')
        .select('*')
        .eq('empresa_id', cancelData.empresa_id)
        .single(),
      supabase
        .from('certificados_vault')
        .select('*')
        .eq('empresa_id', cancelData.empresa_id)
        .eq('ativo', true)
        .single()
    ]);
    
    if (configsResult.error || certificadoResult.error) {
      throw new Error('Configurações ou certificado não encontrados');
    }
    
    const configs = configsResult.data;
    const certificadoVault = certificadoResult.data;
    
    // Recuperar certificado do Vault
    const dadosCertificado = await recuperarCertificado(certificadoVault.id);
    
    // Buscar UF da empresa
    const { data: empresa } = await supabase
      .from('empresas')
      .select('estado')
      .eq('id', cancelData.empresa_id)
      .single();
    
    // Cancelar na SEFAZ real
    const configuracaoSefaz = {
      ambiente: configs.ambiente as 'homologacao' | 'producao',
      uf: empresa?.estado || 'SP',
      certificado: {
        p12Buffer: dadosCertificado.p12Buffer,
        senha: dadosCertificado.senha
      },
      timeout: configs.timeout_sefaz || 30000
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
}
