
import { NFEProcessor } from './nfeProcessor.ts';
import { SefazValidator } from './sefazValidator.ts';

interface NFEData {
  empresa_id: string;
  cliente_id: string;
  itens: Array<{
    produto_id: string;
    quantidade: number;
    valor_unitario: number;
  }>;
  natureza_operacao?: string;
  modalidade_frete?: string;
  observacoes?: string;
}

interface SefazResponse {
  success: boolean;
  chave_acesso?: string;
  protocolo?: string;
  xml_retorno?: string;
  codigo_retorno?: string;
  mensagem_retorno?: string;
  error?: string;
}

export class SefazIntegrationService {
  static async emitirNFE(supabase: any, data: NFEData): Promise<SefazResponse> {
    try {
      // 1. Buscar e validar configurações
      const configs = await SefazValidator.validateConfigurations(supabase, data.empresa_id);
      
      // 2. Buscar e validar certificado
      const certificado = await SefazValidator.validateCertificate(supabase, data.empresa_id);
      
      // 3. Processar NFE
      const result = await NFEProcessor.processNFE(supabase, data, configs, certificado);
      
      return {
        success: true,
        chave_acesso: result.chave_acesso,
        protocolo: result.protocolo,
        xml_retorno: result.xml_retorno,
        codigo_retorno: result.codigo_retorno,
        mensagem_retorno: result.mensagem_retorno
      };

    } catch (error) {
      console.error('Erro ao emitir NFE:', error);
      return {
        success: false,
        error: error.message,
        codigo_retorno: '999',
        mensagem_retorno: error.message
      };
    }
  }

  static async consultarNFE(supabase: any, data: { chave_acesso: string; empresa_id: string }): Promise<SefazResponse> {
    try {
      // Simulação de consulta SEFAZ
      console.log('Consultando NFE:', data.chave_acesso);
      
      return {
        success: true,
        chave_acesso: data.chave_acesso,
        codigo_retorno: '100',
        mensagem_retorno: 'Autorizado o uso da NF-e',
        xml_retorno: `<consultaResponse><status>100</status><chave>${data.chave_acesso}</chave></consultaResponse>`
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        codigo_retorno: '999',
        mensagem_retorno: error.message
      };
    }
  }

  static async cancelarNFE(supabase: any, data: { 
    chave_acesso: string; 
    empresa_id: string; 
    justificativa: string;
    nota_fiscal_id: string;
  }): Promise<SefazResponse> {
    try {
      if (!data.justificativa || data.justificativa.length < 15) {
        throw new Error('Justificativa deve ter pelo menos 15 caracteres');
      }

      // Simulação de cancelamento SEFAZ
      console.log('Cancelando NFE:', data.chave_acesso, data.justificativa);
      
      return {
        success: true,
        chave_acesso: data.chave_acesso,
        codigo_retorno: '135',
        mensagem_retorno: 'Evento registrado e vinculado a NF-e',
        xml_retorno: `<cancelamentoResponse><status>135</status><chave>${data.chave_acesso}</chave></cancelamentoResponse>`
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        codigo_retorno: '999',
        mensagem_retorno: error.message
      };
    }
  }
}
