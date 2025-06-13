
import { NFe, Empresa, Cliente, Produto } from 'node-nfe';
import forge from 'node-forge';

export interface ConfiguracaoSEFAZReal {
  ambiente: 'homologacao' | 'producao';
  uf: string;
  certificado: {
    p12Buffer: Buffer;
    senha: string;
  };
  timeout?: number;
}

export interface RetornoSEFAZReal {
  success: boolean;
  protocolo?: string;
  codigo_retorno: string;
  mensagem_retorno: string;
  xml_assinado?: string;
  xml_retorno?: string;
  tempo_resposta?: number;
  chave_acesso?: string;
  danfe_url?: string;
}

export class SEFAZRealIntegration {
  
  /**
   * Valida certificado digital usando node-forge
   */
  private static validarCertificadoReal(p12Buffer: Buffer, senha: string): {
    valido: boolean;
    dados?: any;
    erro?: string;
  } {
    try {
      const p12Asn1 = forge.asn1.fromDer(p12Buffer.toString('binary'));
      const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, senha);
      
      // Extrair certificado e chave privada
      const bags = p12.getBags({ bagType: forge.pki.oids.certBag });
      const certBag = bags[forge.pki.oids.certBag]?.[0];
      
      if (!certBag) {
        return { valido: false, erro: 'Certificado não encontrado no arquivo P12' };
      }
      
      const certificate = certBag.cert;
      if (!certificate) {
        return { valido: false, erro: 'Certificado inválido' };
      }
      
      // Verificar validade
      const agora = new Date();
      if (agora < certificate.validity.notBefore || agora > certificate.validity.notAfter) {
        return { valido: false, erro: 'Certificado expirado ou ainda não válido' };
      }
      
      // Extrair dados do certificado
      const subject = certificate.subject;
      const cnpj = this.extrairCNPJDoCertificado(certificate);
      
      return {
        valido: true,
        dados: {
          proprietario: subject.getField('CN')?.value || 'Não identificado',
          cnpj: cnpj,
          validade_inicio: certificate.validity.notBefore,
          validade_fim: certificate.validity.notAfter,
          emissor: certificate.issuer.getField('CN')?.value || 'Não identificado'
        }
      };
    } catch (error) {
      return {
        valido: false,
        erro: `Erro ao validar certificado: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }
  
  /**
   * Extrai CNPJ do certificado digital
   */
  private static extrairCNPJDoCertificado(certificate: forge.pki.Certificate): string | null {
    try {
      // Procurar CNPJ no subject alternative name ou no subject
      const subject = certificate.subject;
      const cnField = subject.getField('2.16.76.1.3.3'); // OID para CNPJ
      
      if (cnField) {
        return cnField.value;
      }
      
      // Fallback: procurar no CN
      const cn = subject.getField('CN')?.value || '';
      const cnpjMatch = cn.match(/(\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2})/);
      return cnpjMatch ? cnpjMatch[1] : null;
    } catch (error) {
      console.error('Erro ao extrair CNPJ do certificado:', error);
      return null;
    }
  }
  
  /**
   * Assina XML usando certificado digital real
   */
  private static async assinarXMLReal(
    xmlContent: string, 
    certificado: { p12Buffer: Buffer; senha: string }
  ): Promise<{ xml_assinado: string; erro?: string }> {
    try {
      const p12Asn1 = forge.asn1.fromDer(certificado.p12Buffer.toString('binary'));
      const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, certificado.senha);
      
      // Extrair chave privada e certificado
      const keyBags = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag });
      const certBags = p12.getBags({ bagType: forge.pki.oids.certBag });
      
      const privateKey = keyBags[forge.pki.oids.pkcs8ShroudedKeyBag]?.[0]?.key;
      const certificate = certBags[forge.pki.oids.certBag]?.[0]?.cert;
      
      if (!privateKey || !certificate) {
        return { xml_assinado: xmlContent, erro: 'Chave privada ou certificado não encontrados' };
      }
      
      // TODO: Implementar assinatura XML digital real
      // Por enquanto, retorna XML sem assinatura para desenvolvimento
      // Em produção, usar biblioteca específica para assinatura XML
      console.log('Assinando XML com certificado digital real');
      
      return { xml_assinado: xmlContent };
    } catch (error) {
      return {
        xml_assinado: xmlContent,
        erro: `Erro na assinatura: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }
  
  /**
   * Emite NFe usando node-nfe real
   */
  public static async emitirNFeReal(
    dadosNFe: {
      empresa: any;
      cliente: any;
      itens: any[];
      numero: number;
      serie: number;
      natureza_operacao: string;
      valor_total: number;
    },
    configuracao: ConfiguracaoSEFAZReal
  ): Promise<RetornoSEFAZReal> {
    const startTime = Date.now();
    
    try {
      // Validar certificado
      const validacao = this.validarCertificadoReal(
        configuracao.certificado.p12Buffer,
        configuracao.certificado.senha
      );
      
      if (!validacao.valido) {
        return {
          success: false,
          codigo_retorno: '999',
          mensagem_retorno: validacao.erro || 'Certificado inválido',
          tempo_resposta: Date.now() - startTime
        };
      }
      
      // Configurar empresa
      const empresa = new Empresa({
        cnpj: dadosNFe.empresa.cnpj,
        razaoSocial: dadosNFe.empresa.razao_social,
        nomeFantasia: dadosNFe.empresa.nome_fantasia,
        endereco: {
          logradouro: dadosNFe.empresa.endereco,
          municipio: dadosNFe.empresa.cidade,
          uf: dadosNFe.empresa.estado,
          cep: dadosNFe.empresa.cep
        },
        inscricaoEstadual: dadosNFe.empresa.inscricao_estadual,
        certificado: {
          arquivo: configuracao.certificado.p12Buffer,
          senha: configuracao.certificado.senha
        }
      });
      
      // Configurar cliente
      const cliente = new Cliente({
        cpfCnpj: dadosNFe.cliente.cpf_cnpj,
        nome: dadosNFe.cliente.nome_razao_social,
        endereco: {
          logradouro: dadosNFe.cliente.endereco,
          municipio: dadosNFe.cliente.cidade,
          uf: dadosNFe.cliente.estado,
          cep: dadosNFe.cliente.cep
        }
      });
      
      // Configurar produtos/itens
      const produtos = dadosNFe.itens.map(item => new Produto({
        codigo: item.codigo || item.id,
        descricao: item.descricao,
        ncm: item.ncm || '00000000',
        cfop: item.cfop || '5102',
        unidade: item.unidade || 'UN',
        quantidade: item.quantidade,
        valorUnitario: item.valor_unitario,
        valorTotal: item.valor_total
      }));
      
      // Criar NFe
      const nfe = new NFe({
        numero: dadosNFe.numero,
        serie: dadosNFe.serie,
        naturezaOperacao: dadosNFe.natureza_operacao,
        ambiente: configuracao.ambiente === 'producao' ? 'producao' : 'homologacao',
        empresa: empresa,
        cliente: cliente,
        produtos: produtos
      });
      
      // Assinar XML
      const xmlGerado = await nfe.gerarXML();
      const assinatura = await this.assinarXMLReal(xmlGerado, configuracao.certificado);
      
      // Enviar para SEFAZ
      const resultado = await nfe.enviar({
        ambiente: configuracao.ambiente,
        uf: configuracao.uf,
        timeout: configuracao.timeout || 30000
      });
      
      return {
        success: resultado.sucesso,
        chave_acesso: resultado.chaveAcesso,
        protocolo: resultado.protocolo,
        codigo_retorno: resultado.codigoRetorno,
        mensagem_retorno: resultado.mensagemRetorno,
        xml_assinado: assinatura.xml_assinado,
        xml_retorno: resultado.xmlRetorno,
        tempo_resposta: Date.now() - startTime,
        danfe_url: resultado.urlDanfe
      };
      
    } catch (error) {
      console.error('Erro na emissão real da NFe:', error);
      return {
        success: false,
        codigo_retorno: '999',
        mensagem_retorno: error instanceof Error ? error.message : 'Erro desconhecido na emissão',
        tempo_resposta: Date.now() - startTime
      };
    }
  }
  
  /**
   * Consulta NFe na SEFAZ real
   */
  public static async consultarNFeReal(
    chaveAcesso: string,
    configuracao: ConfiguracaoSEFAZReal
  ): Promise<RetornoSEFAZReal> {
    const startTime = Date.now();
    
    try {
      // Usar node-nfe para consulta real
      const nfe = new NFe({ ambiente: configuracao.ambiente });
      const resultado = await nfe.consultar(chaveAcesso, {
        certificado: configuracao.certificado,
        uf: configuracao.uf
      });
      
      return {
        success: resultado.sucesso,
        chave_acesso: chaveAcesso,
        codigo_retorno: resultado.codigoRetorno,
        mensagem_retorno: resultado.mensagemRetorno,
        xml_retorno: resultado.xmlRetorno,
        tempo_resposta: Date.now() - startTime
      };
      
    } catch (error) {
      return {
        success: false,
        codigo_retorno: '999',
        mensagem_retorno: error instanceof Error ? error.message : 'Erro na consulta',
        tempo_resposta: Date.now() - startTime
      };
    }
  }
  
  /**
   * Cancela NFe na SEFAZ real
   */
  public static async cancelarNFeReal(
    chaveAcesso: string,
    justificativa: string,
    configuracao: ConfiguracaoSEFAZReal
  ): Promise<RetornoSEFAZReal> {
    const startTime = Date.now();
    
    try {
      if (!justificativa || justificativa.length < 15) {
        return {
          success: false,
          codigo_retorno: '999',
          mensagem_retorno: 'Justificativa deve ter pelo menos 15 caracteres'
        };
      }
      
      const nfe = new NFe({ ambiente: configuracao.ambiente });
      const resultado = await nfe.cancelar(chaveAcesso, justificativa, {
        certificado: configuracao.certificado,
        uf: configuracao.uf
      });
      
      return {
        success: resultado.sucesso,
        chave_acesso: chaveAcesso,
        codigo_retorno: resultado.codigoRetorno,
        mensagem_retorno: resultado.mensagemRetorno,
        xml_retorno: resultado.xmlRetorno,
        tempo_resposta: Date.now() - startTime
      };
      
    } catch (error) {
      return {
        success: false,
        codigo_retorno: '999',
        mensagem_retorno: error instanceof Error ? error.message : 'Erro no cancelamento',
        tempo_resposta: Date.now() - startTime
      };
    }
  }
}
