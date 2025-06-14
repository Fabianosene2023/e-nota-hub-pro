
import { SefazOperationService } from './sefaz/operations/sefazOperationService';
import { SefazValidationService } from './sefaz/validation/sefazValidationService';

export interface ConfiguracaoSEFAZ {
  ambiente: 'homologacao' | 'producao';
  uf: string;
  certificado: {
    conteudo: string;
    senha: string;
  };
  timeout?: number;
}

export interface RetornoSEFAZ {
  success: boolean;
  protocolo?: string;
  codigo_retorno: string;
  mensagem_retorno: string;
  xml_retorno?: string;
  tempo_resposta?: number;
  chave_acesso?: string;
  dados_adicionais?: any;
}

/**
 * Main SEFAZ Web Service for NFe operations
 */
export class SEFAZWebService {
  /**
   * Sends NFe to SEFAZ
   */
  public static async enviarNFe(
    xmlNFe: string, 
    configuracao: ConfiguracaoSEFAZ,
    empresaId: string,
    chaveAcesso?: string
  ): Promise<RetornoSEFAZ> {
    const startTime = Date.now();
    
    // Validate before sending
    const validationResult = SefazValidationService.validateSendRequest(xmlNFe, configuracao);
    if (!validationResult.valid) {
      return SefazOperationService.createErrorResponse(validationResult.error, startTime);
    }

    try {
      const result = await SefazOperationService.sendNFe(xmlNFe, configuracao, startTime, chaveAcesso);
      await SefazOperationService.logOperation('enviar_nfe', empresaId, result.chave_acesso || chaveAcesso, xmlNFe, result);
      return result;
    } catch (error) {
      const errorResult = SefazOperationService.handleError(error, startTime);
      await SefazOperationService.logOperation('enviar_nfe', empresaId, chaveAcesso, xmlNFe, errorResult);
      return errorResult;
    }
  }

  /**
   * Consults NFe in SEFAZ
   */
  public static async consultarNFe(
    chaveAcesso: string,
    configuracao: ConfiguracaoSEFAZ,
    empresaId: string
  ): Promise<RetornoSEFAZ> {
    const startTime = Date.now();
    
    // Validate access key
    const validationResult = SefazValidationService.validateConsultRequest(chaveAcesso);
    if (!validationResult.valid) {
      return SefazOperationService.createErrorResponse(validationResult.error, startTime);
    }

    try {
      const result = await SefazOperationService.consultNFe(chaveAcesso, startTime);
      await SefazOperationService.logOperation('consultar_nfe', empresaId, chaveAcesso, undefined, result);
      return result;
    } catch (error) {
      const errorResult = SefazOperationService.handleError(error, startTime);
      await SefazOperationService.logOperation('consultar_nfe', empresaId, chaveAcesso, undefined, errorResult);
      return errorResult;
    }
  }

  /**
   * Cancels NFe in SEFAZ
   */
  public static async cancelarNFe(
    chaveAcesso: string,
    justificativa: string,
    configuracao: ConfiguracaoSEFAZ,
    empresaId: string
  ): Promise<RetornoSEFAZ> {
    const startTime = Date.now();
    
    // Validate cancellation request
    const validationResult = SefazValidationService.validateCancelRequest(chaveAcesso, justificativa);
    if (!validationResult.valid) {
      return SefazOperationService.createErrorResponse(validationResult.error, startTime);
    }

    try {
      const result = await SefazOperationService.cancelNFe(chaveAcesso, justificativa, startTime);
      await SefazOperationService.logOperation('cancelar_nfe', empresaId, chaveAcesso, undefined, result);
      return result;
    } catch (error) {
      const errorResult = SefazOperationService.handleError(error, startTime);
      await SefazOperationService.logOperation('cancelar_nfe', empresaId, chaveAcesso, undefined, errorResult);
      return errorResult;
    }
  }
}
