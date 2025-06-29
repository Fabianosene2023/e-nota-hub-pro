
import { DadosNFeCompletos } from './types';
import { NFEUtils } from './nfeUtils';

/**
 * Service for generating NFe XML
 */
export class XMLGenerator {
  
  /**
   * Generate complete NFe XML
   */
  public static gerarXMLNFe(dados: DadosNFeCompletos): string {
    const chaveAcesso = NFEUtils.gerarChaveAcesso(dados);
    const dataEmissao = new Date(dados.nota.data_emissao);
    
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe${chaveAcesso}">
    ${this.gerarTagIde(dados, chaveAcesso, dataEmissao)}
    ${this.gerarTagEmit(dados)}
    ${this.gerarTagDest(dados)}
    ${this.gerarTagDet(dados)}
    ${this.gerarTagTotal(dados)}
    ${this.gerarTagTransp(dados)}
    ${this.gerarTagPag(dados)}
  </infNFe>
</NFe>`;

    return xml;
  }

  private static gerarTagIde(dados: DadosNFeCompletos, chaveAcesso: string, dataEmissao: Date): string {
    return `<ide>
      <cUF>${NFEUtils.obterCodigoUF(dados.empresa.estado)}</cUF>
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
    </ide>`;
  }

  private static gerarTagEmit(dados: DadosNFeCompletos): string {
    return `<emit>
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
    </emit>`;
  }

  private static gerarTagDest(dados: DadosNFeCompletos): string {
    return `<dest>
      <CNPJ>${dados.cliente.cpf_cnpj.replace(/\D/g, '')}</CNPJ>
      <xNome>${dados.cliente.nome_razao_social}</xNome>
      <enderDest>
        <xLgr>${dados.cliente.endereco}</xLgr>
        <xMun>${dados.cliente.cidade}</xMun>
        <UF>${dados.cliente.estado}</UF>
        <CEP>${dados.cliente.cep.replace(/\D/g, '')}</CEP>
      </enderDest>
    </dest>`;
  }

  private static gerarTagDet(dados: DadosNFeCompletos): string {
    return dados.itens.map((item, index) => `
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
    `).join('');
  }

  private static gerarTagTotal(dados: DadosNFeCompletos): string {
    const freightValue = dados.nota.freight_value || 0;
    const insuranceValue = dados.nota.insurance_value || 0;
    const totalValue = dados.nota.valor_total + freightValue + insuranceValue;

    return `<total>
      <ICMSTot>
        <vBC>0.00</vBC>
        <vICMS>0.00</vICMS>
        <vBCST>0.00</vBCST>
        <vST>0.00</vST>
        <vProd>${dados.nota.valor_total.toFixed(2)}</vProd>
        <vFrete>${freightValue.toFixed(2)}</vFrete>
        <vSeg>${insuranceValue.toFixed(2)}</vSeg>
        <vDesc>0.00</vDesc>
        <vII>0.00</vII>
        <vIPI>0.00</vIPI>
        <vPIS>0.00</vPIS>
        <vCOFINS>0.00</vCOFINS>
        <vOutro>0.00</vOutro>
        <vNF>${totalValue.toFixed(2)}</vNF>
      </ICMSTot>
    </total>`;
  }

  private static gerarTagTransp(dados: DadosNFeCompletos): string {
    const freightMode = dados.nota.freight_mode || '9';
    
    let transpXML = `<transp>
      <modFrete>${freightMode}</modFrete>`;

    // Add transporter data if freight mode is not "9" (no transport) and transporter exists
    if (freightMode !== '9' && dados.transportadora) {
      transpXML += `
      <transporta>
        <CNPJ>${dados.transportadora.cpf_cnpj.replace(/\D/g, '')}</CNPJ>
        <xNome>${dados.transportadora.nome_razao_social}</xNome>
        ${dados.transportadora.inscricao_estadual ? `<IE>${dados.transportadora.inscricao_estadual}</IE>` : ''}
        <xEnder>${dados.transportadora.endereco}</xEnder>
        <xMun>${dados.transportadora.cidade}</xMun>
        <UF>${dados.transportadora.estado}</UF>
      </transporta>`;
    }

    // Add volume data if exists
    const volumeQuantity = dados.nota.volume_quantity || 0;
    const weightGross = dados.nota.weight_gross || 0;
    const weightNet = dados.nota.weight_net || 0;

    if (volumeQuantity > 0 || weightGross > 0 || weightNet > 0) {
      transpXML += `
      <vol>
        <qVol>${volumeQuantity}</qVol>
        <pesoL>${weightNet.toFixed(3)}</pesoL>
        <pesoB>${weightGross.toFixed(3)}</pesoB>
      </vol>`;
    }

    transpXML += `
    </transp>`;

    return transpXML;
  }

  private static gerarTagPag(dados: DadosNFeCompletos): string {
    return `<pag>
      <detPag>
        <tPag>99</tPag>
        <vPag>${dados.nota.valor_total.toFixed(2)}</vPag>
      </detPag>
    </pag>`;
  }
}
