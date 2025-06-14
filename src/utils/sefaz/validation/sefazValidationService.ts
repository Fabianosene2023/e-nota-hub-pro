
import { SefazValidators } from '../sefazValidators';
import { ConfiguracaoSEFAZ } from '../../sefazWebService';

interface ValidationResult {
  valid: boolean;
  error?: string;
}

export class SefazValidationService {
  static validateSendRequest(xmlNFe: string, configuracao: ConfiguracaoSEFAZ): ValidationResult {
    // Validate certificate
    const validacaoCert = SefazValidators.validarCertificado(configuracao.certificado);
    if (!validacaoCert.valido) {
      return {
        valid: false,
        error: validacaoCert.erro || 'Certificado digital inválido'
      };
    }

    // Validate XML content
    if (!xmlNFe || xmlNFe.trim().length === 0) {
      return {
        valid: false,
        error: 'XML da NFe não pode estar vazio'
      };
    }

    return { valid: true };
  }

  static validateConsultRequest(chaveAcesso: string): ValidationResult {
    if (!SefazValidators.validarChaveAcesso(chaveAcesso)) {
      return {
        valid: false,
        error: 'Chave de acesso inválida'
      };
    }

    return { valid: true };
  }

  static validateCancelRequest(chaveAcesso: string, justificativa: string): ValidationResult {
    if (!SefazValidators.validarJustificativaCancelamento(justificativa)) {
      return {
        valid: false,
        error: 'Justificativa deve ter pelo menos 15 caracteres'
      };
    }

    if (!SefazValidators.validarChaveAcesso(chaveAcesso)) {
      return {
        valid: false,
        error: 'Chave de acesso inválida'
      };
    }

    return { valid: true };
  }
}
