
import { ConfiguracaoSEFAZ } from '../sefazWebService';

/**
 * SEFAZ Validation utilities
 */
export class SefazValidators {
  /**
   * Validates digital certificate
   */
  static validarCertificado(certificado: { conteudo: string; senha: string }): { 
    valido: boolean; 
    erro?: string 
  } {
    try {
      if (!certificado.conteudo || !certificado.senha) {
        return { valido: false, erro: 'Certificado ou senha não informados' };
      }

      // TODO: Implementar validação real do certificado A1/A3
      const agora = new Date();
      const validadeInicio = new Date('2024-01-01');
      const validadeFim = new Date('2025-12-31');
      
      if (agora < validadeInicio || agora > validadeFim) {
        return { valido: false, erro: 'Certificado digital expirado ou ainda não válido' };
      }

      return { valido: true };
    } catch (error) {
      return { 
        valido: false, 
        erro: `Erro ao validar certificado: ${error instanceof Error ? error.message : 'Erro desconhecido'}` 
      };
    }
  }

  /**
   * Validates NFe access key format
   */
  static validarChaveAcesso(chaveAcesso: string): boolean {
    return chaveAcesso && chaveAcesso.length === 44;
  }

  /**
   * Validates cancellation justification
   */
  static validarJustificativaCancelamento(justificativa: string): boolean {
    return justificativa && justificativa.trim().length >= 15;
  }

  /**
   * Generates temporary access key for development
   */
  static gerarChaveAcessoTemp(): string {
    const uf = '35'; // SP como padrão
    const aamm = new Date().getFullYear().toString().substr(2) + 
                 (new Date().getMonth() + 1).toString().padStart(2, '0');
    const cnpj = '12345678000190'; // CNPJ exemplo
    const mod = '55';
    const serie = '001';
    const nNF = Math.floor(Math.random() * 999999999).toString().padStart(9, '0');
    const tpEmis = '1';
    const cNF = Math.floor(Math.random() * 99999999).toString().padStart(8, '0');
    
    const chaveBase = uf + aamm + cnpj + mod + serie + nNF + tpEmis + cNF;
    const dv = this.calcularDVChaveAcesso(chaveBase);
    
    return chaveBase + dv;
  }

  /**
   * Calculates access key verification digit
   */
  private static calcularDVChaveAcesso(chave: string): string {
    const sequencia = '4329876543298765432987654329876543298765432';
    let soma = 0;
    
    for (let i = 0; i < chave.length; i++) {
      soma += parseInt(chave[i]) * parseInt(sequencia[i]);
    }
    
    const resto = soma % 11;
    return resto < 2 ? '0' : (11 - resto).toString();
  }
}
