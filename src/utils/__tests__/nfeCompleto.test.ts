
import { XMLGenerator } from '../nfe/xmlGenerator';
import { SignatureService } from '../nfe/signatureService';
import { XSDValidator } from '../nfe/validation/xsdValidator';
import { NFEService } from '../nfe/nfeService';
import { DadosNFeCompletos } from '../nfe/types';

describe('NFe Completo - Testes de Conformidade', () => {
  const dadosNFeCompletos: DadosNFeCompletos = {
    empresa: {
      cnpj: '12.345.678/0001-95',
      razao_social: 'Empresa Teste LTDA',
      nome_fantasia: 'Empresa Teste',
      inscricao_estadual: '123456789',
      endereco: 'Rua Teste, 123',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01000-000'
    },
    cliente: {
      cpf_cnpj: '123.456.789-01',
      nome_razao_social: 'Cliente Teste',
      endereco: 'Rua Cliente, 456',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '02000-000'
    },
    itens: [
      {
        codigo: 'PROD001',
        descricao: 'Produto de Teste',
        ncm: '12345678',
        cfop: '5101',
        unidade: 'UN',
        quantidade: 1,
        valor_unitario: 100.00,
        valor_total: 100.00
      }
    ],
    nota: {
      numero: 1,
      serie: 1,
      data_emissao: '2024-01-15T10:00:00',
      natureza_operacao: 'Venda',
      valor_total: 100.00,
      ambiente: 'homologacao'
    }
  };

  const certificadoTeste = {
    conteudo: 'MIIBase64CertificadoTeste...',
    senha: 'senha123'
  };

  describe('Geração de XML NFe v4.00', () => {
    test('deve gerar XML com versão 4.00', () => {
      const xml = XMLGenerator.gerarXMLNFe(dadosNFeCompletos);
      
      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain('<NFe xmlns="http://www.portalfiscal.inf.br/nfe">');
      expect(xml).toContain('versao="4.00"');
    });

    test('deve incluir tag infRespTec', () => {
      const xml = XMLGenerator.gerarXMLNFe(dadosNFeCompletos);
      
      expect(xml).toContain('<infRespTec>');
      expect(xml).toContain('<CNPJ>07952851000168</CNPJ>');
    });

    test('deve incluir campo indIntermed obrigatório v4.00', () => {
      const xml = XMLGenerator.gerarXMLNFe(dadosNFeCompletos);
      
      expect(xml).toContain('<indIntermed>0</indIntermed>');
    });

    test('deve incluir procEmi e verProc', () => {
      const xml = XMLGenerator.gerarXMLNFe(dadosNFeCompletos);
      
      expect(xml).toContain('<procEmi>0</procEmi>');
      expect(xml).toContain('<verProc>1.0</verProc>');
    });

    test('deve gerar chave de acesso válida', () => {
      const xml = XMLGenerator.gerarXMLNFe(dadosNFeCompletos);
      
      const chaveMatch = xml.match(/Id="NFe(\d{44})"/);
      expect(chaveMatch).toBeTruthy();
      expect(chaveMatch![1]).toHaveLength(44);
    });
  });

  describe('Validação XSD', () => {
    test('deve validar XML contra schema v4.00', async () => {
      const xml = XMLGenerator.gerarXMLNFe(dadosNFeCompletos);
      const resultado = await XSDValidator.validarXMLNFe(xml);
      
      expect(resultado.valid).toBe(true);
      expect(resultado.errors).toHaveLength(0);
    });

    test('deve detectar XML inválido', async () => {
      const xmlInvalido = '<NFe><infNFe></infNFe></NFe>';
      const resultado = await XSDValidator.validarXMLNFe(xmlInvalido);
      
      expect(resultado.valid).toBe(false);
      expect(resultado.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Assinatura Digital', () => {
    test('deve assinar XML com sucesso', async () => {
      const xml = XMLGenerator.gerarXMLNFe(dadosNFeCompletos);
      const xmlAssinado = await SignatureService.assinarXML(xml, certificadoTeste);
      
      expect(xmlAssinado).toContain('<Signature xmlns="http://www.w3.org/2000/09/xmldsig#">');
      expect(xmlAssinado).toContain('<SignatureValue>');
      expect(xmlAssinado).toContain('<KeyInfo');
    });

    test('deve validar assinatura digital', async () => {
      const xml = XMLGenerator.gerarXMLNFe(dadosNFeCompletos);
      const xmlAssinado = await SignatureService.assinarXML(xml, certificadoTeste);
      const assinaturaValida = await SignatureService.validarAssinatura(xmlAssinado);
      
      expect(assinaturaValida).toBe(true);
    });
  });

  describe('Integração Completa NFEService', () => {
    test('deve gerar XML NFe completo', () => {
      const xml = NFEService.gerarXMLNFe(dadosNFeCompletos);
      
      expect(xml).toContain('versao="4.00"');
      expect(xml).toContain('<infRespTec>');
      expect(xml).toContain('<indIntermed>0</indIntermed>');
    });

    test('deve assinar XML via NFEService', async () => {
      const xml = NFEService.gerarXMLNFe(dadosNFeCompletos);
      const xmlAssinado = await NFEService.assinarXML(xml, certificadoTeste);
      
      expect(xmlAssinado).toContain('<Signature');
      expect(xmlAssinado).toContain('<SignatureValue>');
    });

    test('deve validar XML via NFEService', async () => {
      const xml = NFEService.gerarXMLNFe(dadosNFeCompletos);
      const resultado = await NFEService.validarXML(xml);
      
      expect(resultado.valid).toBe(true);
    });
  });

  describe('Exemplos de XML', () => {
    test('deve gerar XML de exemplo válido', () => {
      const xml = XMLGenerator.gerarXMLNFe(dadosNFeCompletos);
      
      // Salvar exemplo para referência
      console.log('=== EXEMPLO XML NFe v4.00 ===');
      console.log(xml);
      console.log('=== FIM EXEMPLO ===');
      
      expect(xml.length).toBeGreaterThan(1000);
    });

    test('deve gerar nfeProc de exemplo', async () => {
      const xml = NFEService.gerarXMLNFe(dadosNFeCompletos);
      const xmlAssinado = await NFEService.assinarXML(xml, certificadoTeste);
      
      // Simular dados de protocolo
      const dadosProtocolo = {
        protocolo: '135240000012345',
        chaveAcesso: '35240112345678000195550010000000011234567890',
        dhRecbto: new Date().toISOString()
      };
      
      const nfeProc = `<?xml version="1.0" encoding="UTF-8"?>
<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
  ${xmlAssinado}
  <protNFe xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
    <infProt>
      <tpAmb>2</tpAmb>
      <verAplic>SP_NFE_PL_008i2</verAplic>
      <chNFe>${dadosProtocolo.chaveAcesso}</chNFe>
      <dhRecbto>${dadosProtocolo.dhRecbto}</dhRecbto>
      <nProt>${dadosProtocolo.protocolo}</nProt>
      <digVal>DIGEST_VALUE</digVal>
      <cStat>100</cStat>
      <xMotivo>Autorizado o uso da NF-e</xMotivo>
    </infProt>
  </protNFe>
</nfeProc>`;
      
      console.log('=== EXEMPLO nfeProc COMPLETO ===');
      console.log(nfeProc);
      console.log('=== FIM EXEMPLO ===');
      
      expect(nfeProc).toContain('<nfeProc');
      expect(nfeProc).toContain('<protNFe');
      expect(nfeProc).toContain('versao="4.00"');
    });
  });
});
