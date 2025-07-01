
import { XMLGenerator } from '../xmlGenerator';
import { SignatureService } from '../signatureService';
import { XSDValidator } from '../validation/xsdValidator';
import { DadosNFeCompletos } from '../types';

export interface TestResult {
  testName: string;
  success: boolean;
  message: string;
  details?: any;
}

export class NFETestService {
  
  /**
   * Executa todos os testes de NFe
   */
  public static async executarTestesCompletos(): Promise<TestResult[]> {
    const resultados: TestResult[] = [];
    
    // Teste 1: Geração de XML
    resultados.push(await this.testarGeracaoXML());
    
    // Teste 2: Validação XSD
    resultados.push(await this.testarValidacaoXSD());
    
    // Teste 3: Assinatura Digital
    resultados.push(await this.testarAssinaturaDigital());
    
    // Teste 4: Chave de Acesso
    resultados.push(await this.testarChaveAcesso());
    
    // Teste 5: Validações de Campo
    resultados.push(await this.testarValidacoesCampos());
    
    return resultados;
  }
  
  private static async testarGeracaoXML(): Promise<TestResult> {
    try {
      const dadosExemplo = this.obterDadosExemplo();
      const xml = XMLGenerator.gerarXMLNFe(dadosExemplo);
      
      const validacoes = [
        xml.includes('versao="4.00"'),
        xml.includes('<NFe xmlns="http://www.portalfiscal.inf.br/nfe">'),
        xml.includes('<infNFe'),
        xml.includes('<ide>'),
        xml.includes('<emit>'),
        xml.includes('<dest>'),
        xml.includes('<det nItem="1">'),
        xml.includes('<total>'),
        xml.includes('<transp>'),
        xml.includes('<pag>')
      ];
      
      const todasValidacoes = validacoes.every(v => v);
      
      return {
        testName: 'Geração de XML NFe',
        success: todasValidacoes,
        message: todasValidacoes ? 'XML gerado com sucesso' : 'XML gerado com problemas',
        details: {
          xml: xml.substring(0, 500) + '...',
          validacoes: validacoes
        }
      };
      
    } catch (error) {
      return {
        testName: 'Geração de XML NFe',
        success: false,
        message: `Erro na geração: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }
  
  private static async testarValidacaoXSD(): Promise<TestResult> {
    try {
      const dadosExemplo = this.obterDadosExemplo();
      const xml = XMLGenerator.gerarXMLNFe(dadosExemplo);
      
      const resultado = await XSDValidator.validarXMLNFe(xml);
      
      return {
        testName: 'Validação XSD',
        success: resultado.valid,
        message: resultado.valid ? 'XML válido segundo XSD' : `Erros encontrados: ${resultado.errors.join(', ')}`,
        details: resultado
      };
      
    } catch (error) {
      return {
        testName: 'Validação XSD',
        success: false,
        message: `Erro na validação: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }
  
  private static async testarAssinaturaDigital(): Promise<TestResult> {
    try {
      const dadosExemplo = this.obterDadosExemplo();
      const xml = XMLGenerator.gerarXMLNFe(dadosExemplo);
      
      const certificadoTeste = {
        conteudo: 'CERTIFICADO_TESTE_BASE64',
        senha: 'senha_teste'
      };
      
      const xmlAssinado = await SignatureService.assinarXML(xml, certificadoTeste);
      
      // Em ambiente de teste, apenas verifica se o processo não gera erro
      const sucesso = xmlAssinado.length > 0;
      
      return {
        testName: 'Assinatura Digital',
        success: sucesso,
        message: sucesso ? 'Processo de assinatura executado' : 'Falha na assinatura',
        details: {
          tamanhoOriginal: xml.length,
          tamanhoAssinado: xmlAssinado.length
        }
      };
      
    } catch (error) {
      return {
        testName: 'Assinatura Digital',
        success: false,
        message: `Erro na assinatura: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }
  
  private static async testarChaveAcesso(): Promise<TestResult> {
    try {
      const dadosExemplo = this.obterDadosExemplo();
      const xml = XMLGenerator.gerarXMLNFe(dadosExemplo);
      
      // Extrair chave de acesso do XML
      const chaveMatch = xml.match(/Id="NFe(\d{44})"/);
      if (!chaveMatch) {
        throw new Error('Chave de acesso não encontrada no XML');
      }
      
      const chave = chaveMatch[1];
      
      // Validações da chave
      const validacoes = {
        tamanho: chave.length === 44,
        numerica: /^\d{44}$/.test(chave),
        uf: chave.substring(0, 2) === '35', // SP
        modelo: chave.substring(20, 22) === '55'
      };
      
      const todasValidacoes = Object.values(validacoes).every(v => v);
      
      return {
        testName: 'Chave de Acesso',
        success: todasValidacoes,
        message: todasValidacoes ? 'Chave de acesso válida' : 'Problemas na chave de acesso',
        details: {
          chave,
          validacoes
        }
      };
      
    } catch (error) {
      return {
        testName: 'Chave de Acesso',
        success: false,
        message: `Erro na validação da chave: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }
  
  private static async testarValidacoesCampos(): Promise<TestResult> {
    try {
      const dadosExemplo = this.obterDadosExemplo();
      
      const validacoes = {
        cnpjEmpresa: dadosExemplo.empresa.cnpj.replace(/\D/g, '').length === 14,
        cpfCliente: dadosExemplo.cliente.cpf_cnpj.replace(/\D/g, '').length === 11,
        valorTotal: dadosExemplo.nota.valor_total > 0,
        itensPresentes: dadosExemplo.itens.length > 0,
        numeroNota: dadosExemplo.nota.numero > 0,
        serie: dadosExemplo.nota.serie > 0
      };
      
      const todasValidacoes = Object.values(validacoes).every(v => v);
      
      return {
        testName: 'Validações de Campos',
        success: todasValidacoes,
        message: todasValidacoes ? 'Todos os campos válidos' : 'Alguns campos com problemas',
        details: validacoes
      };
      
    } catch (error) {
      return {
        testName: 'Validações de Campos',
        success: false,
        message: `Erro nas validações: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }
  
  /**
   * Gera dados de exemplo para testes
   */
  public static obterDadosExemplo(): DadosNFeCompletos {
    return {
      empresa: {
        cnpj: '12345678000195',
        razao_social: 'EMPRESA TESTE LTDA',
        nome_fantasia: 'Empresa Teste',
        endereco: 'Rua Teste, 100',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01001000',
        inscricao_estadual: '123456789012'
      },
      cliente: {
        cpf_cnpj: '12345678901',
        nome_razao_social: 'CLIENTE TESTE',
        endereco: 'Rua Cliente, 200',
        cidade: 'Rio de Janeiro',
        estado: 'RJ',
        cep: '20000000'
      },
      nota: {
        numero: 1,
        serie: 1,
        natureza_operacao: 'Venda de mercadoria',
        valor_total: 150.00,
        data_emissao: new Date().toISOString(),
        ambiente: 'homologacao',
        observacoes: 'Nota fiscal de teste'
      },
      itens: [
        {
          codigo: 'PROD001',
          descricao: 'Produto de Teste',
          quantidade: 1,
          valor_unitario: 100.00,
          valor_total: 100.00,
          cfop: '5102',
          unidade: 'UN',
          ncm: '12345678'
        },
        {
          codigo: 'PROD002',
          descricao: 'Segundo Produto',
          quantidade: 2,
          valor_unitario: 25.00,
          valor_total: 50.00,
          cfop: '5102',
          unidade: 'UN',
          ncm: '87654321'
        }
      ]
    };
  }
  
  /**
   * Gera exemplo de XML NFe completo
   */
  public static gerarExemploXML(): string {
    const dadosExemplo = this.obterDadosExemplo();
    return XMLGenerator.gerarXMLNFe(dadosExemplo);
  }
}
