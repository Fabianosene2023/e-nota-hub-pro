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
        inscricao_estadual: '123456789' // id removido
      },
      cliente: {
        cpf_cnpj: '12345678901',
        nome_razao_social: 'Cliente Teste',
        endereco: 'Rua Cliente, 200',
        cidade: 'Rio de Janeiro',
        estado: 'RJ',
        cep: '20000000',
        inscricao_estadual: '987654321' // id removido
      },
      nota: {
        numero: 1,
        serie: 1,
        natureza_operacao: 'Venda',
        valor_total: 100.0,
        data_emissao: '2024-01-01',
        ambiente: 'homologacao' // id removido
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
      // Caso queira testar transportadora, adicione-a aqui conforme o tipo
    };

    const xml = XMLGenerator.gerar(nfe);
    expect(xml).toMatch(/<NFe>/);
  });

  // Outros testes...
});
