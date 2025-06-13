
import { describe, it, expect } from 'vitest';
import { validarCNPJ, validarCPF, validarNCM, validarCFOP, formatarCNPJ, formatarCPF } from '../validacoesFiscais';

describe('Validações Fiscais', () => {
  describe('CNPJ', () => {
    it('deve validar CNPJ válido', () => {
      const cnpjsValidos = [
        '11.222.333/0001-81',
        '11222333000181',
        '32.073.077/0001-78',
        '32073077000178'
      ];
      
      cnpjsValidos.forEach(cnpj => {
        expect(validarCNPJ(cnpj)).toBe(true);
      });
    });

    it('deve rejeitar CNPJ inválido', () => {
      const cnpjsInvalidos = [
        '11.222.333/0001-82', // DV incorreto
        '11222333000182',
        '123.456.789/0001-00',
        '12345678000100'
      ];
      
      cnpjsInvalidos.forEach(cnpj => {
        expect(validarCNPJ(cnpj)).toBe(false);
      });
    });

    it('deve rejeitar CNPJ com sequência inválida', () => {
      const cnpjsSequencia = [
        '11.111.111/1111-11',
        '00000000000000',
        '22222222222222',
        '99999999999999'
      ];
      
      cnpjsSequencia.forEach(cnpj => {
        expect(validarCNPJ(cnpj)).toBe(false);
      });
    });

    it('deve rejeitar CNPJ com tamanho incorreto', () => {
      const cnpjsTamanhoIncorreto = [
        '123.456.789/0001-1', // 13 dígitos
        '123.456.789/0001-123', // 15 dígitos
        '123456789001',
        ''
      ];
      
      cnpjsTamanhoIncorreto.forEach(cnpj => {
        expect(validarCNPJ(cnpj)).toBe(false);
      });
    });
  });

  describe('CPF', () => {
    it('deve validar CPF válido', () => {
      const cpfsValidos = [
        '123.456.789-09',
        '12345678909',
        '111.444.777-35',
        '11144477735'
      ];
      
      cpfsValidos.forEach(cpf => {
        expect(validarCPF(cpf)).toBe(true);
      });
    });

    it('deve rejeitar CPF inválido', () => {
      const cpfsInvalidos = [
        '123.456.789-00', // DV incorreto
        '12345678900',
        '111.444.777-36',
        '11144477736'
      ];
      
      cpfsInvalidos.forEach(cpf => {
        expect(validarCPF(cpf)).toBe(false);
      });
    });

    it('deve rejeitar CPF com sequência inválida', () => {
      const cpfsSequencia = [
        '111.111.111-11',
        '00000000000',
        '22222222222',
        '99999999999'
      ];
      
      cpfsSequencia.forEach(cpf => {
        expect(validarCPF(cpf)).toBe(false);
      });
    });

    it('deve rejeitar CPF com tamanho incorreto', () => {
      const cpfsTamanhoIncorreto = [
        '123.456.789-1', // 10 dígitos
        '123.456.789-123', // 12 dígitos
        '1234567890',
        ''
      ];
      
      cpfsTamanhoIncorreto.forEach(cpf => {
        expect(validarCPF(cpf)).toBe(false);
      });
    });
  });

  describe('NCM', () => {
    it('deve validar NCM de 8 dígitos', () => {
      const ncmsValidos = [
        '12345678',
        '87654321',
        '00000000',
        '99999999'
      ];
      
      ncmsValidos.forEach(ncm => {
        expect(validarNCM(ncm)).toBe(true);
      });
    });

    it('deve validar NCM com formatação', () => {
      const ncmsComFormatacao = [
        '1234.56.78',
        '8765-43-21'
      ];
      
      ncmsComFormatacao.forEach(ncm => {
        expect(validarNCM(ncm)).toBe(true);
      });
    });

    it('deve rejeitar NCM com menos de 8 dígitos', () => {
      const ncmsInvalidos = [
        '1234567', // 7 dígitos
        '123456',  // 6 dígitos
        '12345',   // 5 dígitos
        ''
      ];
      
      ncmsInvalidos.forEach(ncm => {
        expect(validarNCM(ncm)).toBe(false);
      });
    });

    it('deve rejeitar NCM com mais de 8 dígitos', () => {
      const ncmsInvalidos = [
        '123456789', // 9 dígitos
        '1234567890' // 10 dígitos
      ];
      
      ncmsInvalidos.forEach(ncm => {
        expect(validarNCM(ncm)).toBe(false);
      });
    });
  });

  describe('CFOP', () => {
    it('deve validar CFOP de 4 dígitos', () => {
      const cfopsValidos = [
        '5102', // Venda de mercadoria
        '6102', // Venda de mercadoria para fora do estado
        '1102', // Compra para industrialização
        '2102'  // Compra para industrialização de fora do estado
      ];
      
      cfopsValidos.forEach(cfop => {
        expect(validarCFOP(cfop)).toBe(true);
      });
    });

    it('deve validar CFOP com formatação', () => {
      const cfopsComFormatacao = [
        '5.102',
        '6-102'
      ];
      
      cfopsComFormatacao.forEach(cfop => {
        expect(validarCFOP(cfop)).toBe(true);
      });
    });

    it('deve rejeitar CFOP inválido', () => {
      const cfopsInvalidos = [
        '123',    // 3 dígitos
        '12345',  // 5 dígitos
        '0000',   // CFOP zero
        '',
        'abcd'    // não numérico
      ];
      
      cfopsInvalidos.forEach(cfop => {
        expect(validarCFOP(cfop)).toBe(false);
      });
    });
  });

  describe('Formatação', () => {
    it('deve formatar CNPJ corretamente', () => {
      expect(formatarCNPJ('11222333000181')).toBe('11.222.333/0001-81');
      expect(formatarCNPJ('32073077000178')).toBe('32.073.077/0001-78');
    });

    it('deve formatar CPF corretamente', () => {
      expect(formatarCPF('12345678909')).toBe('123.456.789-09');
      expect(formatarCPF('11144477735')).toBe('111.444.777-35');
    });

    it('deve manter formatação se já formatado', () => {
      expect(formatarCNPJ('11.222.333/0001-81')).toBe('11.222.333/0001-81');
      expect(formatarCPF('123.456.789-09')).toBe('123.456.789-09');
    });
  });
});
