
import { describe, it, expect } from 'vitest';
import { XMLGenerator } from '../nfe/xmlGenerator';
import { DadosNFeCompletos } from '../nfe/types';

describe('NFe XML Generation', () => {
  const mockDadosCompletos: DadosNFeCompletos = {
    empresa: {
      id: '1',
      razao_social: 'Empresa Teste LTDA',
      nome_fantasia: 'Empresa Teste',
      cnpj: '12.345.678/0001-90',
      inscricao_estadual: '123456789',
      endereco: 'Rua Teste, 123',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234-567',
      email: 'test@empresa.com',
      telefone: '(11) 1234-5678'
    },
    cliente: {
      id: '1',
      nome_razao_social: 'Cliente Teste LTDA',
      cpf_cnpj: '98.765.432/0001-10',
      endereco: 'Av Cliente, 456',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '04567-890',
      email: 'client@test.com',
      telefone: '(11) 9876-5432'
    },
    nota: {
      id: '1',
      numero: 1,
      serie: 1,
      data_emissao: '2024-01-01T10:00:00Z',
      natureza_operacao: 'Venda de mercadoria',
      valor_total: 1000.00,
      ambiente: 'homologacao',
      freight_mode: '0',
      freight_value: 50.00,
      insurance_value: 25.00,
      volume_quantity: 2,
      weight_gross: 10.500,
      weight_net: 9.800
    },
    itens: [
      {
        codigo: 'PROD001',
        descricao: 'Produto Teste',
        ncm: '12345678',
        cfop: '5102',
        unidade: 'UN',
        quantidade: 10,
        valor_unitario: 100.00,
        valor_total: 1000.00
      }
    ],
    transportadora: {
      nome_razao_social: 'Transportadora Teste',
      cpf_cnpj: '11.222.333/0001-44',
      inscricao_estadual: '987654321',
      endereco: 'Rua Transporte, 789',
      cidade: 'São Paulo',
      estado: 'SP'
    }
  };

  it('should generate valid NFe XML structure', () => {
    const xml = XMLGenerator.gerarXMLNFe(mockDadosCompletos);
    
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<NFe xmlns="http://www.portalfiscal.inf.br/nfe">');
    expect(xml).toContain('</NFe>');
  });

  it('should include empresa data in emit section', () => {
    const xml = XMLGenerator.gerarXMLNFe(mockDadosCompletos);
    
    expect(xml).toContain('<emit>');
    expect(xml).toContain('<CNPJ>12345678000190</CNPJ>');
    expect(xml).toContain('<xNome>Empresa Teste LTDA</xNome>');
    expect(xml).toContain('<xFant>Empresa Teste</xFant>');
    expect(xml).toContain('</emit>');
  });

  it('should include cliente data in dest section', () => {
    const xml = XMLGenerator.gerarXMLNFe(mockDadosCompletos);
    
    expect(xml).toContain('<dest>');
    expect(xml).toContain('<CNPJ>98765432000110</CNPJ>');
    expect(xml).toContain('<xNome>Cliente Teste LTDA</xNome>');
    expect(xml).toContain('</dest>');
  });

  it('should include freight data in transp section', () => {
    const xml = XMLGenerator.gerarXMLNFe(mockDadosCompletos);
    
    expect(xml).toContain('<transp>');
    expect(xml).toContain('<modFrete>0</modFrete>');
    expect(xml).toContain('<transporta>');
    expect(xml).toContain('<xNome>Transportadora Teste</xNome>');
    expect(xml).toContain('<vol>');
    expect(xml).toContain('<qVol>2</qVol>');
    expect(xml).toContain('<pesoL>9.800</pesoL>');
    expect(xml).toContain('<pesoB>10.500</pesoB>');
    expect(xml).toContain('</transp>');
  });

  it('should include freight and insurance values in total section', () => {
    const xml = XMLGenerator.gerarXMLNFe(mockDadosCompletos);
    
    expect(xml).toContain('<total>');
    expect(xml).toContain('<vProd>1000.00</vProd>');
    expect(xml).toContain('<vFrete>50.00</vFrete>');
    expect(xml).toContain('<vSeg>25.00</vSeg>');
    expect(xml).toContain('<vNF>1075.00</vNF>'); // 1000 + 50 + 25
    expect(xml).toContain('</total>');
  });

  it('should handle freight mode 9 (no transport)', () => {
    const dadosComFreteNulo = {
      ...mockDadosCompletos,
      nota: {
        ...mockDadosCompletos.nota,
        freight_mode: '9'
      }
    };
    
    const xml = XMLGenerator.gerarXMLNFe(dadosComFreteNulo);
    
    expect(xml).toContain('<modFrete>9</modFrete>');
    expect(xml).not.toContain('<transporta>');
  });

  it('should include product details in det section', () => {
    const xml = XMLGenerator.gerarXMLNFe(mockDadosCompletos);
    
    expect(xml).toContain('<det nItem="1">');
    expect(xml).toContain('<cProd>PROD001</cProd>');
    expect(xml).toContain('<xProd>Produto Teste</xProd>');
    expect(xml).toContain('<NCM>12345678</NCM>');
    expect(xml).toContain('<CFOP>5102</CFOP>');
    expect(xml).toContain('<qCom>10</qCom>');
    expect(xml).toContain('<vUnCom>100.00</vUnCom>');
  });
});
