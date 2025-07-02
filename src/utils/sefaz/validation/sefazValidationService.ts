
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * SEFAZ Validation Service for NFe operations
 */
export class SefazValidationService {
  
  /**
   * Validate NFe send request
   */
  public static validateSendRequest(xmlNFe: string, configuracao: any): ValidationResult {
    if (!xmlNFe || xmlNFe.trim().length === 0) {
      return { valid: false, error: 'XML da NFe é obrigatório' };
    }
    
    if (!xmlNFe.includes('versao="4.00"')) {
      return { valid: false, error: 'XML deve ser versão 4.00' };
    }
    
    if (!configuracao.certificado?.conteudo || !configuracao.certificado?.senha) {
      return { valid: false, error: 'Certificado digital é obrigatório' };
    }
    
    if (!configuracao.uf) {
      return { valid: false, error: 'UF é obrigatória' };
    }
    
    if (!['homologacao', 'producao'].includes(configuracao.ambiente)) {
      return { valid: false, error: 'Ambiente deve ser homologacao ou producao' };
    }
    
    return { valid: true };
  }
  
  /**
   * Validate NFe consultation request
   */
  public static validateConsultRequest(chaveAcesso: string): ValidationResult {
    if (!chaveAcesso) {
      return { valid: false, error: 'Chave de acesso é obrigatória' };
    }
    
    if (chaveAcesso.length !== 44) {
      return { valid: false, error: 'Chave de acesso deve ter 44 dígitos' };
    }
    
    if (!/^\d{44}$/.test(chaveAcesso)) {
      return { valid: false, error: 'Chave de acesso deve conter apenas números' };
    }
    
    return { valid: true };
  }
  
  /**
   * Validate NFe cancellation request
   */
  public static validateCancelRequest(chaveAcesso: string, justificativa: string): ValidationResult {
    const chaveValidation = this.validateConsultRequest(chaveAcesso);
    if (!chaveValidation.valid) {
      return chaveValidation;
    }
    
    if (!justificativa || justificativa.trim().length < 15) {
      return { valid: false, error: 'Justificativa deve ter pelo menos 15 caracteres' };
    }
    
    if (justificativa.length > 255) {
      return { valid: false, error: 'Justificativa não pode exceder 255 caracteres' };
    }
    
    return { valid: true };
  }
}
