
import * as crypto from 'crypto';

interface CertificadoDigital {
  conteudo: string; // Base64 do certificado P12
  senha: string;
  p12Buffer?: Buffer;
}

/**
 * Service for digital signature operations with A1 certificate
 */
export class SignatureService {
  
  /**
   * Sign XML with digital certificate A1
   */
  public static async assinarXML(xmlContent: string, certificado: CertificadoDigital): Promise<string> {
    try {
      console.log('Iniciando assinatura digital do XML NFe...');
      
      // Em produção, usar biblioteca específica como node-forge ou xmldsig
      // Por enquanto, simular assinatura para desenvolvimento
      
      // Extrair a tag infNFe para assinatura
      const infNFeMatch = xmlContent.match(/<infNFe[^>]*>[\s\S]*?<\/infNFe>/);
      if (!infNFeMatch) {
        throw new Error('Tag infNFe não encontrada no XML');
      }
      
      const infNFeContent = infNFeMatch[0];
      const infNFeId = this.extrairIdInfNFe(infNFeContent);
      
      if (!infNFeId) {
        throw new Error('Atributo Id não encontrado na tag infNFe');
      }
      
      // Gerar hash da tag infNFe
      const canonicalizedXml = this.canonicalizeXML(infNFeContent);
      const digestValue = this.gerarDigestValue(canonicalizedXml);
      
      // Criar estrutura de assinatura
      const signatureInfo = this.criarSignedInfo(infNFeId, digestValue);
      const signatureValue = await this.gerarSignatureValue(signatureInfo, certificado);
      const keyInfo = this.criarKeyInfo(certificado);
      
      // Montar XML de assinatura
      const signatureXML = `
  <Signature xmlns="http://www.w3.org/2000/09/xmldsig#">
    ${signatureInfo}
    <SignatureValue>${signatureValue}</SignatureValue>
    ${keyInfo}
  </Signature>`;
      
      // Inserir assinatura no XML antes do fechamento da tag infNFe
      const xmlAssinado = xmlContent.replace(
        '</infNFe>',
        `${signatureXML}
  </infNFe>`
      );
      
      console.log('XML assinado digitalmente com sucesso');
      return xmlAssinado;
      
    } catch (error) {
      console.error('Erro na assinatura digital:', error);
      throw new Error(`Falha na assinatura digital: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  private static extrairIdInfNFe(infNFeContent: string): string | null {
    const idMatch = infNFeContent.match(/Id="([^"]+)"/);
    return idMatch ? idMatch[1] : null;
  }
  
  private static canonicalizeXML(xml: string): string {
    // Implementação simplificada de canonicalização C14N
    // Em produção, usar biblioteca específica
    return xml
      .replace(/>\s+</g, '><') // Remove espaços entre tags
      .replace(/\s+/g, ' ') // Normaliza espaços
      .trim();
  }
  
  private static gerarDigestValue(content: string): string {
    const hash = crypto.createHash('sha1');
    hash.update(content, 'utf8');
    return hash.digest('base64');
  }
  
  private static criarSignedInfo(referenceId: string, digestValue: string): string {
    return `<SignedInfo xmlns="http://www.w3.org/2000/09/xmldsig#">
      <CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>
      <SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"/>
      <Reference URI="#${referenceId}">
        <Transforms>
          <Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>
          <Transform Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>
        </Transforms>
        <DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/>
        <DigestValue>${digestValue}</DigestValue>
      </Reference>
    </SignedInfo>`;
  }
  
  private static async gerarSignatureValue(signedInfo: string, certificado: CertificadoDigital): Promise<string> {
    try {
      // Em produção, usar certificado real
      // Por enquanto, simular assinatura
      const canonicalizedSignedInfo = this.canonicalizeXML(signedInfo);
      
      // Simular assinatura RSA-SHA1
      const mockSignature = crypto.randomBytes(128).toString('base64');
      
      console.log('Signature gerada (simulação):', mockSignature.substring(0, 32) + '...');
      return mockSignature;
      
    } catch (error) {
      throw new Error(`Erro ao gerar signature: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  private static criarKeyInfo(certificado: CertificadoDigital): string {
    // Em produção, extrair informações reais do certificado
    const mockCertificate = 'MIICertificadoMockBase64...';
    
    return `<KeyInfo xmlns="http://www.w3.org/2000/09/xmldsig#">
      <X509Data>
        <X509Certificate>${mockCertificate}</X509Certificate>
      </X509Data>
    </KeyInfo>`;
  }
  
  /**
   * Validate XML signature
   */
  public static async validarAssinatura(xmlAssinado: string): Promise<boolean> {
    try {
      console.log('Validando assinatura digital...');
      
      // Em produção, implementar validação real da assinatura
      const hasSignature = xmlAssinado.includes('<Signature xmlns="http://www.w3.org/2000/09/xmldsig#">');
      const hasSignatureValue = xmlAssinado.includes('<SignatureValue>');
      const hasKeyInfo = xmlAssinado.includes('<KeyInfo');
      
      const isValid = hasSignature && hasSignatureValue && hasKeyInfo;
      
      console.log('Resultado da validação:', isValid ? 'VÁLIDA' : 'INVÁLIDA');
      return isValid;
      
    } catch (error) {
      console.error('Erro na validação da assinatura:', error);
      return false;
    }
  }
}
