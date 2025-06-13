
import { DOMParser, XMLSerializer } from '@xmldom/xmldom';
import CryptoJS from 'crypto-js';

export interface DadosNFeCompletos {
  empresa: {
    cnpj: string;
    razao_social: string;
    nome_fantasia?: string;
    endereco: string;
    cidade: string;
    estado: string;
    cep: string;
    inscricao_estadual?: string;
  };
  cliente: {
    cpf_cnpj: string;
    nome_razao_social: string;
    endereco: string;
    cidade: string;
    estado: string;
    cep: string;
    inscricao_estadual?: string;
  };
  nota: {
    numero: number;
    serie: number;
    natureza_operacao: string;
    valor_total: number;
    data_emissao: string;
    ambiente: 'homologacao' | 'producao';
  };
  itens: Array<{
    codigo: string;
    descricao: string;
    quantidade: number;
    valor_unitario: number;
    valor_total: number;
    cfop: string;
    ncm?: string;
    unidade: string;
  }>;
}

export interface RetornoNFe {
  success: boolean;
  chave_acesso?: string;
  protocolo?: string;
  xml_nfe?: string;
  danfe_pdf?: Uint8Array;
  codigo_retorno?: string;
  mensagem_retorno?: string;
  error?: string;
}

export class NFEService {
  private static gerarChaveAcesso(dados: DadosNFeCompletos): string {
    const uf = this.obterCodigoUF(dados.empresa.estado);
    const dataEmissao = new Date(dados.nota.data_emissao);
    const aamm = dataEmissao.getFullYear().toString().substr(2) + 
                 (dataEmissao.getMonth() + 1).toString().padStart(2, '0');
    const cnpj = dados.empresa.cnpj.replace(/\D/g, '');
    const modelo = '55'; // NFe
    const serie = dados.nota.serie.toString().padStart(3, '0');
    const numero = dados.nota.numero.toString().padStart(9, '0');
    const tipoEmissao = '1'; // Normal
    const codigoNumerico = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
    
    const chaveBase = uf + aamm + cnpj + modelo + serie + numero + tipoEmissao + codigoNumerico;
    const dv = this.calcularDVChaveAcesso(chaveBase);
    
    return chaveBase + dv;
  }

  private static calcularDVChaveAcesso(chave: string): string {
    const sequencia = '4329876543298765432987654329876543298765432';
    let soma = 0;
    
    for (let i = 0; i < chave.length; i++) {
      soma += parseInt(chave[i]) * parseInt(sequencia[i]);
    }
    
    const resto = soma % 11;
    return resto < 2 ? '0' : (11 - resto).toString();
  }

  private static obterCodigoUF(estado: string): string {
    const codigosUF: { [key: string]: string } = {
      'AC': '12', 'AL': '17', 'AP': '16', 'AM': '23', 'BA': '29',
      'CE': '23', 'DF': '53', 'ES': '32', 'GO': '52', 'MA': '21',
      'MT': '51', 'MS': '50', 'MG': '31', 'PA': '15', 'PB': '25',
      'PR': '41', 'PE': '26', 'PI': '22', 'RJ': '33', 'RN': '24',
      'RS': '43', 'RO': '11', 'RR': '14', 'SC': '42', 'SP': '35',
      'SE': '28', 'TO': '17'
    };
    return codigosUF[estado] || '35';
  }

  public static gerarXMLNFe(dados: DadosNFeCompletos): string {
    const chaveAcesso = this.gerarChaveAcesso(dados);
    const dataEmissao = new Date(dados.nota.data_emissao);
    
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe${chaveAcesso}">
    <ide>
      <cUF>${this.obterCodigoUF(dados.empresa.estado)}</cUF>
      <cNF>${chaveAcesso.slice(-8)}</cNF>
      <natOp>${dados.nota.natureza_operacao}</natOp>
      <mod>55</mod>
      <serie>${dados.nota.serie}</serie>
      <nNF>${dados.nota.numero}</nNF>
      <dhEmi>${dataEmissao.toISOString()}</dhEmi>
      <tpNF>1</tpNF>
      <idDest>1</idDest>
      <cMunFG>3550308</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
      <cDV>${chaveAcesso.slice(-1)}</cDV>
      <tpAmb>${dados.nota.ambiente === 'producao' ? '1' : '2'}</tpAmb>
      <finNFe>1</finNFe>
      <indFinal>1</indFinal>
      <indPres>1</indPres>
    </ide>
    <emit>
      <CNPJ>${dados.empresa.cnpj.replace(/\D/g, '')}</CNPJ>
      <xNome>${dados.empresa.razao_social}</xNome>
      ${dados.empresa.nome_fantasia ? `<xFant>${dados.empresa.nome_fantasia}</xFant>` : ''}
      <enderEmit>
        <xLgr>${dados.empresa.endereco}</xLgr>
        <xMun>${dados.empresa.cidade}</xMun>
        <UF>${dados.empresa.estado}</UF>
        <CEP>${dados.empresa.cep.replace(/\D/g, '')}</CEP>
      </enderEmit>
      ${dados.empresa.inscricao_estadual ? `<IE>${dados.empresa.inscricao_estadual}</IE>` : ''}
      <CRT>1</CRT>
    </emit>
    <dest>
      <CNPJ>${dados.cliente.cpf_cnpj.replace(/\D/g, '')}</CNPJ>
      <xNome>${dados.cliente.nome_razao_social}</xNome>
      <enderDest>
        <xLgr>${dados.cliente.endereco}</xLgr>
        <xMun>${dados.cliente.cidade}</xMun>
        <UF>${dados.cliente.estado}</UF>
        <CEP>${dados.cliente.cep.replace(/\D/g, '')}</CEP>
      </enderDest>
    </dest>
    <det nItem="1">
      ${dados.itens.map((item, index) => `
      <det nItem="${index + 1}">
        <prod>
          <cProd>${item.codigo}</cProd>
          <xProd>${item.descricao}</xProd>
          <NCM>${item.ncm || '00000000'}</NCM>
          <CFOP>${item.cfop}</CFOP>
          <uCom>${item.unidade}</uCom>
          <qCom>${item.quantidade}</qCom>
          <vUnCom>${item.valor_unitario.toFixed(2)}</vUnCom>
          <vProd>${item.valor_total.toFixed(2)}</vProd>
        </prod>
        <imposto>
          <ICMS>
            <ICMS00>
              <orig>0</orig>
              <CST>00</CST>
              <pICMS>0.00</pICMS>
              <vICMS>0.00</vICMS>
            </ICMS00>
          </ICMS>
        </imposto>
      </det>
      `).join('')}
    </det>
    <total>
      <ICMSTot>
        <vBC>0.00</vBC>
        <vICMS>0.00</vICMS>
        <vBCST>0.00</vBCST>
        <vST>0.00</vST>
        <vProd>${dados.nota.valor_total.toFixed(2)}</vProd>
        <vFrete>0.00</vFrete>
        <vSeg>0.00</vSeg>
        <vDesc>0.00</vDesc>
        <vII>0.00</vII>
        <vIPI>0.00</vIPI>
        <vPIS>0.00</vPIS>
        <vCOFINS>0.00</vCOFINS>
        <vOutro>0.00</vOutro>
        <vNF>${dados.nota.valor_total.toFixed(2)}</vNF>
      </ICMSTot>
    </total>
    <transp>
      <modFrete>9</modFrete>
    </transp>
    <pag>
      <detPag>
        <tPag>99</tPag>
        <vPag>${dados.nota.valor_total.toFixed(2)}</vPag>
      </detPag>
    </pag>
  </infNFe>
</NFe>`;

    return xml;
  }

  public static async assinarXML(xmlContent: string, certificado: {
    conteudo: string;
    senha: string;
  }): Promise<string> {
    // Em produção, aqui seria implementada a assinatura digital real
    // Por enquanto, retorna o XML sem assinatura para desenvolvimento
    console.log('Assinando XML com certificado digital');
    
    // TODO: Implementar assinatura digital real usando xmldsig
    // const parser = new DOMParser();
    // const doc = parser.parseFromString(xmlContent, 'text/xml');
    // ... lógica de assinatura ...
    
    return xmlContent;
  }
}
