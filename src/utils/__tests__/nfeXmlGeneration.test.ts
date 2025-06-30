
import { describe, it, expect } from 'vitest';
import { XMLGenerator } from '../nfe/xmlGenerator';
import type { DadosNFeCompletos } from '../nfe/types';

describe('XMLGenerator', () => {
  it('gera XML de uma NFe básica', () => {
    const nfe: DadosNFeCompletos = {
      empresa: {
        cnpj: '12345678000195',
        razao_social: 'Empresa Teste LTDA',
        nome_fantasia: 'Empresa Teste',
        endereco: 'Rua Teste, 100',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01001000',
        inscricao_estadual: '123456789'
      },
      cliente: {
        cpf_cnpj: '12345678901',
        nome_razao_social: 'Cliente Teste',
        endereco: 'Rua Cliente, 200',
        cidade: 'Rio de Janeiro',
        estado: 'RJ',
        cep: '20000000',
        inscricao_estadual: '987654321'
      },
      nota: {
        numero: 1,
        serie: 1,
        natureza_operacao: 'Venda',
        valor_total: 100.0,
        data_emissao: '2024-01-01',
        ambiente: 'homologacao'
      },
      itens: [
        {
          codigo: '1',
          descricao: 'Produto A',
          quantidade: 1,
          valor_unitario: 100,
          valor_total: 100,
          cfop: '5102',
          unidade: 'UN'
        }
      ]
    };

    const xml = XMLGenerator.gerarXMLNFe(nfe);
    expect(xml).toMatch(/<NFe>/);
    expect(xml).toMatch(/<infNFe/);
    expect(xml).toMatch(/Empresa Teste LTDA/);
    expect(xml).toMatch(/Cliente Teste/);
  });

  it('gera XML com dados de frete', () => {
    const nfe: DadosNFeCompletos = {
      empresa: {
        cnpj: '12345678000195',
        razao_social: 'Empresa Teste LTDA',
        nome_fantasia: 'Empresa Teste',
        endereco: 'Rua Teste, 100',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01001000',
        inscricao_estadual: '123456789'
      },
      cliente: {
        cpf_cnpj: '12345678901',
        nome_razao_social: 'Cliente Teste',
        endereco: 'Rua Cliente, 200',
        cidade: 'Rio de Janeiro',
        estado: 'RJ',
        cep: '20000000',
        inscricao_estadual: '987654321'
      },
      nota: {
        numero: 1,
        serie: 1,
        natureza_operacao: 'Venda',
        valor_total: 100.0,
        data_emissao: '2024-01-01',
        ambiente: 'homologacao',
        freight_mode: '1',
        freight_value: 15.50,
        insurance_value: 5.00,
        volume_quantity: 2,
        weight_gross: 10.5,
        weight_net: 9.0
      },
      itens: [
        {
          codigo: '1',
          descricao: 'Produto A',
          quantidade: 1,
          valor_unitario: 100,
          valor_total: 100,
          cfop: '5102',
          unidade: 'UN'
        }
      ],
      transportadora: {
        id: 'test-transporter-id',
        empresa_id: 'test-empresa-id',
        nome_razao_social: 'Transportadora XYZ',
        nome_fantasia: 'Transportadora XYZ',
        cpf_cnpj: '98765432000123',
        tipo_pessoa: 'juridica',
        inscricao_estadual: '555666777',
        endereco: 'Rua Transporte, 300',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01000000',
        telefone: '11999999999',
        email: 'contato@transportadora.com',
        placa_veiculo: 'ABC1234',
        rntrc: '123456789',
        ativo: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    };

    const xml = XMLGenerator.gerarXMLNFe(nfe);
    expect(xml).toMatch(/<transp>/);
    expect(xml).toMatch(/<modFrete>1<\/modFrete>/);
    expect(xml).toMatch(/Transportadora XYZ/);
    expect(xml).toMatch(/<vFrete>15.50<\/vFrete>/);
    expect(xml).toMatch(/<vSeg>5.00<\/vSeg>/);
  });
});
