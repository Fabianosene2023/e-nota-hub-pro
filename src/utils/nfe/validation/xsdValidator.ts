
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export class XSDValidator {
  
  /**
   * Valida XML NFe contra schema XSD
   * Em produção, deve usar biblioteca específica para validação XSD
   */
  public static async validarXMLNFe(xmlContent: string): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    try {
      // Validações básicas de estrutura
      if (!xmlContent.includes('<NFe xmlns="http://www.portalfiscal.inf.br/nfe">')) {
        errors.push('Namespace NFe não encontrado ou incorreto');
      }
      
      if (!xmlContent.includes('versao="4.00"')) {
        errors.push('Versão 4.00 não especificada na tag infNFe');
      }
      
      // Validar presença de tags obrigatórias
      const tagsObrigatorias = [
        'infNFe', 'ide', 'emit', 'dest', 'det', 'total', 'transp', 'pag'
      ];
      
      for (const tag of tagsObrigatorias) {
        if (!xmlContent.includes(`<${tag}`)) {
          errors.push(`Tag obrigatória não encontrada: ${tag}`);
        }
      }
      
      // Validar estrutura da tag ide
      if (!this.validarTagIde(xmlContent)) {
        errors.push('Estrutura da tag ide está incorreta');
      }
      
      // Validar emitente
      if (!this.validarEmitente(xmlContent)) {
        errors.push('Dados do emitente estão incorretos');
      }
      
      // Validar destinatário
      if (!this.validarDestinatario(xmlContent)) {
        errors.push('Dados do destinatário estão incorretos');
      }
      
      // Validar detalhes dos produtos
      if (!this.validarDetalhes(xmlContent)) {
        errors.push('Detalhes dos produtos estão incorretos');
      }
      
      return {
        valid: errors.length === 0,
        errors,
        warnings
      };
      
    } catch (error) {
      errors.push(`Erro na validação: ${error instanceof Error ? error.message : String(error)}`);
      return {
        valid: false,
        errors,
        warnings
      };
    }
  }
  
  private static validarTagIde(xml: string): boolean {
    const camposObrigatorios = [
      'cUF', 'cNF', 'natOp', 'mod', 'serie', 'nNF', 'dhEmi',
      'tpNF', 'idDest', 'cMunFG', 'tpImp', 'tpEmis', 'cDV', 'tpAmb'
    ];
    
    return camposObrigatorios.every(campo => xml.includes(`<${campo}>`));
  }
  
  private static validarEmitente(xml: string): boolean {
    return xml.includes('<CNPJ>') && xml.includes('<xNome>') && xml.includes('<enderEmit>');
  }
  
  private static validarDestinatario(xml: string): boolean {
    return (xml.includes('<CPF>') || xml.includes('<CNPJ>')) && 
           xml.includes('<xNome>') && xml.includes('<enderDest>');
  }
  
  private static validarDetalhes(xml: string): boolean {
    return xml.includes('<det nItem="1">') && 
           xml.includes('<prod>') && 
           xml.includes('<imposto>');
  }
}
