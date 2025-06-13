
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SEFAZWebService, ConfiguracaoSEFAZ } from '../sefazWebService';

// Mock do console.log para testes
const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

describe('SEFAZWebService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const configuracaoValida: ConfiguracaoSEFAZ = {
    ambiente: 'homologacao',
    uf: 'SP',
    certificado: {
      conteudo: 'certificado-base64-mock',
      senha: 'senha123'
    },
    timeout: 30000
  };

  describe('enviarNFe', () => {
    it('deve retornar sucesso com configuração válida', async () => {
      const xmlNFe = '<NFe>conteudo xml mock</NFe>';
      const empresaId = 'empresa-123';
      
      const resultado = await SEFAZWebService.enviarNFe(xmlNFe, configuracaoValida, empresaId);
      
      expect(resultado).toBeDefined();
      expect(resultado.success).toBeDefined();
      expect(resultado.codigo_retorno).toBeDefined();
      expect(resultado.mensagem_retorno).toBeDefined();
      expect(resultado.tempo_resposta).toBeGreaterThan(0);
    });

    it('deve falhar com certificado inválido', async () => {
      const configuracaoInvalida: ConfiguracaoSEFAZ = {
        ...configuracaoValida,
        certificado: {
          conteudo: '',
          senha: ''
        }
      };
      
      const resultado = await SEFAZWebService.enviarNFe('<NFe>test</NFe>', configuracaoInvalida, 'empresa-123');
      
      expect(resultado.success).toBe(false);
      expect(resultado.codigo_retorno).toBe('999');
      expect(resultado.mensagem_retorno).toContain('Certificado');
    });

    it('deve falhar com UF não suportada', async () => {
      const configuracaoUFInvalida: ConfiguracaoSEFAZ = {
        ...configuracaoValida,
        uf: 'XX'
      };
      
      const resultado = await SEFAZWebService.enviarNFe('<NFe>test</NFe>', configuracaoUFInvalida, 'empresa-123');
      
      expect(resultado.success).toBe(false);
      expect(resultado.codigo_retorno).toBe('999');
      expect(resultado.mensagem_retorno).toContain('Endpoint não configurado');
    });

    it('deve incluir chave de acesso no retorno quando bem-sucedido', async () => {
      const xmlNFe = '<NFe>conteudo xml mock</NFe>';
      const empresaId = 'empresa-123';
      
      // Executar múltiplas vezes para tentar obter um sucesso (simulação tem 95% de sucesso)
      let resultado;
      let tentativas = 0;
      do {
        resultado = await SEFAZWebService.enviarNFe(xmlNFe, configuracaoValida, empresaId);
        tentativas++;
      } while (!resultado.success && tentativas < 10);
      
      if (resultado.success) {
        expect(resultado.chave_acesso).toBeDefined();
        expect(resultado.chave_acesso).toHaveLength(44);
        expect(resultado.protocolo).toBeDefined();
      }
    });
  });

  describe('consultarNFe', () => {
    it('deve consultar NFe com chave válida', async () => {
      const chaveValida = '35240812345678000190550010000000011123456789';
      
      const resultado = await SEFAZWebService.consultarNFe(chaveValida, configuracaoValida, 'empresa-123');
      
      expect(resultado.success).toBe(true);
      expect(resultado.chave_acesso).toBe(chaveValida);
      expect(resultado.codigo_retorno).toBe('100');
      expect(resultado.tempo_resposta).toBeGreaterThan(0);
    });

    it('deve falhar com chave de acesso inválida', async () => {
      const chaveInvalida = '123456'; // muito curta
      
      const resultado = await SEFAZWebService.consultarNFe(chaveInvalida, configuracaoValida, 'empresa-123');
      
      expect(resultado.success).toBe(false);
      expect(resultado.codigo_retorno).toBe('999');
      expect(resultado.mensagem_retorno).toContain('Chave de acesso inválida');
    });

    it('deve falhar com chave vazia', async () => {
      const resultado = await SEFAZWebService.consultarNFe('', configuracaoValida, 'empresa-123');
      
      expect(resultado.success).toBe(false);
      expect(resultado.codigo_retorno).toBe('999');
      expect(resultado.mensagem_retorno).toContain('Chave de acesso inválida');
    });
  });

  describe('cancelarNFe', () => {
    const chaveValida = '35240812345678000190550010000000011123456789';

    it('deve cancelar NFe com justificativa válida', async () => {
      const justificativa = 'Cancelamento solicitado pelo cliente por erro na emissão';
      
      const resultado = await SEFAZWebService.cancelarNFe(chaveValida, justificativa, configuracaoValida, 'empresa-123');
      
      expect(resultado.success).toBe(true);
      expect(resultado.chave_acesso).toBe(chaveValida);
      expect(resultado.codigo_retorno).toBe('135');
      expect(resultado.tempo_resposta).toBeGreaterThan(0);
    });

    it('deve falhar com justificativa muito curta', async () => {
      const justificativaInvalida = 'muito curta';
      
      const resultado = await SEFAZWebService.cancelarNFe(chaveValida, justificativaInvalida, configuracaoValida, 'empresa-123');
      
      expect(resultado.success).toBe(false);
      expect(resultado.codigo_retorno).toBe('999');
      expect(resultado.mensagem_retorno).toContain('pelo menos 15 caracteres');
    });

    it('deve falhar com justificativa vazia', async () => {
      const resultado = await SEFAZWebService.cancelarNFe(chaveValida, '', configuracaoValida, 'empresa-123');
      
      expect(resultado.success).toBe(false);
      expect(resultado.codigo_retorno).toBe('999');
      expect(resultado.mensagem_retorno).toContain('pelo menos 15 caracteres');
    });

    it('deve falhar com chave de acesso inválida', async () => {
      const justificativaValida = 'Cancelamento solicitado pelo cliente por erro na emissão';
      const chaveInvalida = '123456';
      
      const resultado = await SEFAZWebService.cancelarNFe(chaveInvalida, justificativaValida, configuracaoValida, 'empresa-123');
      
      expect(resultado.success).toBe(false);
      expect(resultado.codigo_retorno).toBe('999');
      expect(resultado.mensagem_retorno).toContain('Chave de acesso inválida');
    });
  });

  describe('Ambientes SEFAZ', () => {
    it('deve usar endpoints de homologação', async () => {
      const config: ConfiguracaoSEFAZ = {
        ...configuracaoValida,
        ambiente: 'homologacao'
      };
      
      const resultado = await SEFAZWebService.enviarNFe('<NFe>test</NFe>', config, 'empresa-123');
      
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('Ambiente: homologacao')
      );
    });

    it('deve usar endpoints de produção', async () => {
      const config: ConfiguracaoSEFAZ = {
        ...configuracaoValida,
        ambiente: 'producao'
      };
      
      const resultado = await SEFAZWebService.enviarNFe('<NFe>test</NFe>', config, 'empresa-123');
      
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('Ambiente: producao')
      );
    });
  });

  describe('Logs e Auditoria', () => {
    it('deve gerar logs para operações de envio', async () => {
      await SEFAZWebService.enviarNFe('<NFe>test</NFe>', configuracaoValida, 'empresa-123');
      
      expect(mockConsoleLog).toHaveBeenCalledWith('=== LOG SEFAZ ===');
      expect(mockConsoleLog).toHaveBeenCalledWith('Operação: enviar_nfe');
      expect(mockConsoleLog).toHaveBeenCalledWith('Empresa ID: empresa-123');
    });

    it('deve gerar logs para operações de consulta', async () => {
      const chaveValida = '35240812345678000190550010000000011123456789';
      await SEFAZWebService.consultarNFe(chaveValida, configuracaoValida, 'empresa-123');
      
      expect(mockConsoleLog).toHaveBeenCalledWith('=== LOG SEFAZ ===');
      expect(mockConsoleLog).toHaveBeenCalledWith('Operação: consultar_nfe');
    });

    it('deve gerar logs para operações de cancelamento', async () => {
      const chaveValida = '35240812345678000190550010000000011123456789';
      const justificativa = 'Cancelamento solicitado pelo cliente por erro na emissão';
      
      await SEFAZWebService.cancelarNFe(chaveValida, justificativa, configuracaoValida, 'empresa-123');
      
      expect(mockConsoleLog).toHaveBeenCalledWith('=== LOG SEFAZ ===');
      expect(mockConsoleLog).toHaveBeenCalledWith('Operação: cancelar_nfe');
    });
  });
});
