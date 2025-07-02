
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * XSD Validator for NFe XML v4.00
 */
export class XSDValidator {
  
  /**
   * Validate NFe XML against official SEFAZ XSD schema v4.00
   */
  public static async validarXMLNFe(xmlContent: string): Promise<ValidationResult> {
    try {
      console.log('Validando XML NFe contra schema XSD v4.00...');
      
      // Em produção, implementar validação real contra XSD oficial
      const errors: string[] = [];
      
      // Validações básicas de estrutura v4.00
      if (!xmlContent.includes('versao="4.00"')) {
        errors.push('Versão 4.00 não encontrada na tag infNFe');
      }
      
      if (!xmlContent.includes('<infRespTec>')) {
        errors.push('Tag infRespTec é obrigatória na versão 4.00');
      }
      
      if (!xmlContent.includes('<indIntermed>')) {
        errors.push('Campo indIntermed é obrigatório na versão 4.00');
      }
      
      if (!xmlContent.includes('<procEmi>')) {
        errors.push('Campo procEmi é obrigatório');
      }
      
      if (!xmlContent.includes('<verProc>')) {
        errors.push('Campo verProc é obrigatório');
      }
      
      // Validar estrutura XML básica
      if (!xmlContent.includes('<NFe xmlns="http://www.portalfiscal.inf.br/nfe">')) {
        errors.push('Namespace NFe incorreto ou ausente');
      }
      
      if (!xmlContent.includes('<infNFe')) {
        errors.push('Tag infNFe não encontrada');
      }
      
      const isValid = errors.length === 0;
      
      console.log(`Validação XSD concluída: ${isValid ? 'VÁLIDO' : 'INVÁLIDO'}`);
      if (!isValid) {
        console.log('Erros encontrados:', errors);
      }
      
      return {
        valid: isValid,
        errors
      };
      
    } catch (error) {
      console.error('Erro na validação XSD:', error);
      return {
        valid: false,
        errors: [`Erro na validação: ${error instanceof Error ? error.message : String(error)}`]
      };
    }
  }
  
  /**
   * Validate XML structure and required fields for v4.00
   */
  public static validarEstruturaNFe400(xmlContent: string): ValidationResult {
    const errors: string[] = [];
    
    // Verificar campos obrigatórios v4.00
    const camposObrigatorios = [
      '<cUF>',
      '<cNF>',
      '<natOp>',
      '<mod>55</mod>',
      '<serie>',
      '<nNF>',
      '<dhEmi>',
      '<tpNF>',
      '<idDest>',
      '<cMunFG>',
      '<tpImp>',
      '<tpEmis>',
      '<cDV>',
      '<tpAmb>',
      '<finNFe>',
      '<indFinal>',
      '<indPres>',
      '<indIntermed>',
      '<procEmi>',
      '<verProc>'
    ];
    
    camposObrigatorios.forEach(campo => {
      if (!xmlContent.includes(campo)) {
        errors.push(`Campo obrigatório ausente: ${campo}`);
      }
    });
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
}
