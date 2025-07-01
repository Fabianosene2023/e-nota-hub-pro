
import { DadosNFeCompletos } from './types';
import { NFEUtils } from './nfeUtils';

export class XMLGenerator {
  
  public static gerarXMLNFe(dados: DadosNFeCompletos): string {
    const chaveAcesso = NFEUtils.gerarChaveAcesso(dados);
    const dataEmissao = new Date(dados.nota.data_emissao);

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe versao="4.00" Id="NFe${chaveAcesso}">
    ${this.gerarTagIde(dados, chaveAcesso, dataEmissao)}
    ${this.gerarTagEmit(dados)}
    ${this.gerarTagDest(dados)}
    ${this.gerarTagDet(dados)}
    ${this.gerarTagTotal(dados)}
    ${this.gerarTagTransp(dados)}
    ${this.gerarTagPag(dados)}
    ${this.gerarTagInfAdic(dados)}
    ${this.gerarTagInfRespTec()}
  </infNFe>
</NFe>`;

    return xml;
  }

  private static gerarTagIde(dados: DadosNFeCompletos, chaveAcesso: string, dataEmissao: Date): string {
    const cNF = chaveAcesso.substring(25, 33); // Código numérico da NFe
    
    return `<ide>
      <cUF>${NFEUtils.obterCodigoUF(dados.empresa.estado)}</cUF>
      <cNF>${cNF}</cNF>
      <natOp>${dados.nota.natureza_operacao}</natOp>
      <mod>55</mod>
      <serie>${dados.nota.serie}</serie>
      <nNF>${dados.nota.numero}</nNF>
      <dhEmi>${dataEmissao.toISOString()}</dhEmi>
      <tpNF>1</tpNF>
      <idDest>${this.obterIdDest(dados)}</idDest>
      <cMunFG>${NFEUtils.obterCodigoMunicipio(dados.empresa.cidade, dados.empresa.estado)}</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
      <cDV>${chaveAcesso.slice(-1)}</cDV>
      <tpAmb>${dados.nota.ambiente === 'producao' ? '1' : '2'}</tpAmb>
      <finNFe>1</finNFe>
      <indFinal>${this.obterIndFinal(dados)}</indFinal>
      <indPres>1</indPres>
      <indIntermed>0</indIntermed>
      <procEmi>0</procEmi>
      <verProc>1.0</verProc>
    </ide>`;
  }

  private static gerarTagEmit(dados: DadosNFeCompletos): string {
    return `<emit>
      <CNPJ>${dados.empresa.cnpj.replace(/\D/g, '')}</CNPJ>
      <xNome>${this.escaparXML(dados.empresa.razao_social)}</xNome>
      ${dados.empresa.nome_fantasia ? `<xFant>${this.escaparXML(dados.empresa.nome_fantasia)}</xFant>` : ''}
      <enderEmit>
        <xLgr>${this.escaparXML(dados.empresa.endereco)}</xLgr>
        <nro>S/N</nro>
        <xBairro>Centro</xBairro>
        <cMun>${NFEUtils.obterCodigoMunicipio(dados.empresa.cidade, dados.empresa.estado)}</cMun>
        <xMun>${this.escaparXML(dados.empresa.cidade)}</xMun>
        <UF>${dados.empresa.estado}</UF>
        <CEP>${dados.empresa.cep.replace(/\D/g, '')}</CEP>
        <cPais>1058</cPais>
        <xPais>Brasil</xPais>
      </enderEmit>
      ${dados.empresa.inscricao_estadual ? `<IE>${dados.empresa.inscricao_estadual}</IE>` : '<IE>ISENTO</IE>'}
      <CRT>1</CRT>
    </emit>`;
  }

  private static gerarTagDest(dados: DadosNFeCompletos): string {
    const cpfCnpj = dados.cliente.cpf_cnpj.replace(/\D/g, '');
    const tagDocumento = cpfCnpj.length === 11 ? `<CPF>${cpfCnpj}</CPF>` : `<CNPJ>${cpfCnpj}</CNPJ>`;

    return `<dest>
      ${tagDocumento}
      <xNome>${this.escaparXML(dados.cliente.nome_razao_social)}</xNome>
      <enderDest>
        <xLgr>${this.escaparXML(dados.cliente.endereco)}</xLgr>
        <nro>S/N</nro>
        <xBairro>Centro</xBairro>
        <cMun>${NFEUtils.obterCodigoMunicipio(dados.cliente.cidade, dados.cliente.estado)}</cMun>
        <xMun>${this.escaparXML(dados.cliente.cidade)}</xMun>
        <UF>${dados.cliente.estado}</UF>
        <CEP>${dados.cliente.cep.replace(/\D/g, '')}</CEP>
        <cPais>1058</cPais>
        <xPais>Brasil</xPais>
      </enderDest>
      ${dados.cliente.inscricao_estadual ? `<IE>${dados.cliente.inscricao_estadual}</IE>` : ''}
      <indIEDest>${dados.cliente.inscricao_estadual ? '1' : '9'}</indIEDest>
    </dest>`;
  }

  private static gerarTagDet(dados: DadosNFeCompletos): string {
    return dados.itens.map((item, index) => `
    <det nItem="${index + 1}">
      <prod>
        <cProd>${this.escaparXML(item.codigo)}</cProd>
        <cEAN>SEM GTIN</cEAN>
        <xProd>${this.escaparXML(item.descricao)}</xProd>
        <NCM>${item.ncm || '00000000'}</NCM>
        <CFOP>${item.cfop}</CFOP>
        <uCom>${item.unidade}</uCom>
        <qCom>${item.quantidade.toFixed(4)}</qCom>
        <vUnCom>${item.valor_unitario.toFixed(10)}</vUnCom>
        <vProd>${item.valor_total.toFixed(2)}</vProd>
        <cEANTrib>SEM GTIN</cEANTrib>
        <uTrib>${item.unidade}</uTrib>
        <qTrib>${item.quantidade.toFixed(4)}</qTrib>
        <vUnTrib>${item.valor_unitario.toFixed(10)}</vUnTrib>
        <indTot>1</indTot>
      </prod>
      <imposto>
        <vTotTrib>0.00</vTotTrib>
        <ICMS>
          <ICMS00>
            <orig>0</orig>
            <CST>00</CST>
            <modBC>3</modBC>
            <vBC>0.00</vBC>
            <pICMS>0.00</pICMS>
            <vICMS>0.00</vICMS>
          </ICMS00>
        </ICMS>
        <PIS>
          <PISAliq>
            <CST>01</CST>
            <vBC>0.00</vBC>
            <pPIS>0.00</pPIS>
            <vPIS>0.00</vPIS>
          </PISAliq>
        </PIS>
        <COFINS>
          <COFINSAliq>
            <CST>01</CST>
            <vBC>0.00</vBC>
            <pCOFINS>0.00</pCOFINS>
            <vCOFINS>0.00</vCOFINS>
          </COFINSAliq>
        </COFINS>
      </imposto>
    </det>`).join('');
  }

  private static gerarTagTotal(dados: DadosNFeCompletos): string {
    const freightValue = dados.nota.freight_value ?? 0;
    const insuranceValue = dados.nota.insurance_value ?? 0;
    const totalValue = dados.nota.valor_total + freightValue + insuranceValue;

    return `<total>
      <ICMSTot>
        <vBC>0.00</vBC>
        <vICMS>0.00</vICMS>
        <vICMSDeson>0.00</vICMSDeson>
        <vFCPUFDest>0.00</vFCPUFDest>
        <vICMSUFDest>0.00</vICMSUFDest>
        <vICMSUFRemet>0.00</vICMSUFRemet>
        <vFCP>0.00</vFCP>
        <vBCST>0.00</vBCST>
        <vST>0.00</vST>
        <vFCPST>0.00</vFCPST>
        <vFCPSTRet>0.00</vFCPSTRet>
        <vProd>${dados.nota.valor_total.toFixed(2)}</vProd>
        <vFrete>${freightValue.toFixed(2)}</vFrete>
        <vSeg>${insuranceValue.toFixed(2)}</vSeg>
        <vDesc>0.00</vDesc>
        <vII>0.00</vII>
        <vIPI>0.00</vIPI>
        <vIPIDevol>0.00</vIPIDevol>
        <vPIS>0.00</vPIS>
        <vCOFINS>0.00</vCOFINS>
        <vOutro>0.00</vOutro>
        <vNF>${totalValue.toFixed(2)}</vNF>
        <vTotTrib>0.00</vTotTrib>
      </ICMSTot>
    </total>`;
  }

  private static gerarTagTransp(dados: DadosNFeCompletos): string {
    const freightMode = dados.nota.freight_mode ?? '9';
    return `<transp>
      <modFrete>${freightMode}</modFrete>
    </transp>`;
  }

  private static gerarTagPag(dados: DadosNFeCompletos): string {
    return `<pag>
      <detPag>
        <indPag>0</indPag>
        <tPag>99</tPag>
        <vPag>${dados.nota.valor_total.toFixed(2)}</vPag>
      </detPag>
    </pag>`;
  }

  private static gerarTagInfAdic(dados: DadosNFeCompletos): string {
    const observacoes = dados.nota.observacoes || '';
    if (!observacoes.trim()) return '';
    
    return `<infAdic>
      <infCpl>${this.escaparXML(observacoes)}</infCpl>
    </infAdic>`;
  }

  private static gerarTagInfRespTec(): string {
    return `<infRespTec>
      <CNPJ>07952851000168</CNPJ>
      <xContato>Suporte Técnico</xContato>
      <email>suporte@sistema.com.br</email>
      <fone>1133334444</fone>
    </infRespTec>`;
  }

  private static obterIdDest(dados: DadosNFeCompletos): string {
    if (dados.empresa.estado === dados.cliente.estado) {
      return '1'; // Operação interna
    }
    return '2'; // Operação interestadual
  }

  private static obterIndFinal(dados: DadosNFeCompletos): string {
    const cpfCnpj = dados.cliente.cpf_cnpj.replace(/\D/g, '');
    return cpfCnpj.length === 11 ? '1' : '0'; // 1 = Consumidor final, 0 = Normal
  }

  private static escaparXML(texto: string): string {
    if (!texto) return '';
    return texto
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
