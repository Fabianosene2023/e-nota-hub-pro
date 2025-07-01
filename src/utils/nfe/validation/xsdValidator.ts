
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
      // Validações estruturais básicas
      if (!xmlContent.includes('<?xml version="1.0" encoding="UTF-8"?>')) {
        warnings.push('Declaração XML recomendada não encontrada');
      }
      
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
        errors.push('Estrutura da tag ide está incorreta ou incompleta');
      }
      
      // Validar emitente
      if (!this.validarEmitente(xmlContent)) {
        errors.push('Dados do emitente estão incorretos ou incompletos');
      }
      
      // Validar destinatário
      if (!this.validarDestinatario(xmlContent)) {
        errors.push('Dados do destinatário estão incorretos ou incompletos');
      }
      
      // Validar detalhes dos produtos
      if (!this.validarDetalhes(xmlContent)) {
        errors.push('Detalhes dos produtos estão incorretos ou incompletos');
      }
      
      // Validar totais
      if (!this.validarTotais(xmlContent)) {
        errors.push('Totais da NFe estão incorretos ou incompletos');
      }
      
      // Validar chave de acesso
      const chaveMatch = xmlContent.match(/Id="NFe(\d{44})"/);
      if (!chaveMatch) {
        errors.push('Chave de acesso não encontrada ou formato inválido');
      } else {
        const chave = chaveMatch[1];
        if (!this.validarChaveAcesso(chave)) {
          errors.push('Chave de acesso com formato inválido');
        }
      }
      
      // Validações específicas do layout 4.00
      this.validarLayout400(xmlContent, errors, warnings);
      
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
      'tpNF', 'idDest', 'cMunFG', 'tpImp', 'tpEmis', 'cDV', 'tpAmb',
      'finNFe', 'indFinal', 'indPres'
    ];
    
    return camposObrigatorios.every(campo => xml.includes(`<${campo}>`));
  }
  
  private static validarEmitente(xml: string): boolean {
    const temCNPJ = xml.includes('<CNPJ>') && xml.match(/<CNPJ>\d{14}<\/CNPJ>/);
    const temNome = xml.includes('<xNome>') && xml.match(/<xNome>.+<\/xNome>/);
    const temEndereco = xml.includes('<enderEmit>');
    const temIE = xml.includes('<IE>') || xml.includes('<IE>ISENTO</IE>');
    const temCRT = xml.includes('<CRT>');
    
    return !!(temCNPJ && temNome && temEndereco && temIE && temCRT);
  }
  
  private static validarDestinatario(xml: string): boolean {
    const temDocumento = xml.includes('<CPF>') || xml.includes('<CNPJ>');
    const temNome = xml.includes('<xNome>') && xml.match(/<xNome>.+<\/xNome>/);
    const temEndereco = xml.includes('<enderDest>');
    const temIndIE = xml.includes('<indIEDest>');
    
    return !!(temDocumento && temNome && temEndereco && temIndIE);
  }
  
  private static validarDetalhes(xml: string): boolean {
    const temDet = xml.includes('<det nItem="1">');
    const temProd = xml.includes('<prod>');
    const temImposto = xml.includes('<imposto>');
    const temCProd = xml.includes('<cProd>');
    const temXProd = xml.includes('<xProd>');
    const temNCM = xml.includes('<NCM>');
    const temCFOP = xml.includes('<CFOP>');
    const temValores = xml.includes('<vProd>') && xml.includes('<qCom>') && xml.includes('<vUnCom>');
    
    return !!(temDet && temProd && temImposto && temCProd && temXProd && temNCM && temCFOP && temValores);
  }
  
  private static validarTotais(xml: string): boolean {
    const temTotal = xml.includes('<total>');
    const temICMSTot = xml.includes('<ICMSTot>');
    const temVProd = xml.includes('<vProd>');
    const temVNF = xml.includes('<vNF>');
    
    return !!(temTotal && temICMSTot && temVProd && temVNF);
  }
  
  private static validarChaveAcesso(chave: string): boolean {
    if (chave.length !== 44) return false;
    if (!/^\d{44}$/.test(chave)) return false;
    
    // Validar dígito verificador
    const chaveBase = chave.substring(0, 43);
    const dvInformado = chave.substring(43);
    const dvCalculado = this.calcularDVChaveAcesso(chaveBase);
    
    return dvInformado === dvCalculado;
  }
  
  private static calcularDVChaveAcesso(chave: string): string {
    const sequence = '4329876543298765432987654329876543298765432';
    let sum = 0;
    
    for (let i = 0; i < chave.length; i++) {
      sum += parseInt(chave[i]) * parseInt(sequence[i]);
    }
    
    const remainder = sum % 11;
    return remainder < 2 ? '0' : (11 - remainder).toString();
  }
  
  private static validarLayout400(xml: string, errors: string[], warnings: string[]): void {
    // Validações específicas da versão 4.00
    
    // Validar campos obrigatórios novos na v4.00
    if (!xml.includes('<indIntermed>')) {
      errors.push('Campo indIntermed obrigatório na versão 4.00');
    }
    
    // Validar formato de data/hora
    const dhEmiMatch = xml.match(/<dhEmi>([^<]+)<\/dhEmi>/);
    if (dhEmiMatch) {
      const dataHora = dhEmiMatch[1];
      if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(dataHora)) {
        errors.push('Formato de data/hora dhEmi inválido (deve ser ISO 8601)');
      }
    }
    
    // Validar códigos de país
    if (xml.includes('<cPais>') && !xml.includes('<cPais>1058</cPais>')) {
      warnings.push('Código do país deve ser 1058 para Brasil');
    }
    
    // Validar presença de QR Code para NFCe
    if (xml.includes('<mod>65</mod>') && !xml.includes('<qrCode>')) {
      errors.push('QR Code obrigatório para NFC-e');
    }
    
    // Validar CSOSN para Simples Nacional
    if (xml.includes('<CRT>1</CRT>') && !xml.includes('<CSOSN>')) {
      warnings.push('CSOSN recomendado para empresas do Simples Nacional');
    }
  }
}
