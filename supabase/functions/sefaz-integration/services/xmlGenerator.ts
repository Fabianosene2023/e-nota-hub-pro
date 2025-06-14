
export class XMLGenerator {
  static async gerarXMLNFE(dadosCompletos: any, configs: any, numero: number): Promise<string> {
    const { empresa, cliente } = dadosCompletos;
    
    // Gerar chave de acesso (44 dígitos)
    const chaveAcesso = this.gerarChaveAcesso(empresa, configs, numero);

    // XML simplificado (em produção seria muito mais complexo)
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe${chaveAcesso}">
    <ide>
      <cUF>35</cUF>
      <cNF>${chaveAcesso.slice(-8)}</cNF>
      <natOp>Venda</natOp>
      <mod>55</mod>
      <serie>${configs.serie_nfe}</serie>
      <nNF>${numero}</nNF>
      <dhEmi>${new Date().toISOString()}</dhEmi>
      <tpNF>1</tpNF>
      <idDest>1</idDest>
      <cMunFG>3550308</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
      <cDV>${chaveAcesso.slice(-1)}</cDV>
      <tpAmb>${configs.ambiente === 'producao' ? '1' : '2'}</tpAmb>
      <finNFe>1</finNFe>
      <indFinal>1</indFinal>
      <indPres>1</indPres>
    </ide>
    <emit>
      <CNPJ>${empresa.cnpj.replace(/\D/g, '')}</CNPJ>
      <xNome>${empresa.razao_social}</xNome>
      <xFant>${empresa.nome_fantasia || empresa.razao_social}</xFant>
      <enderEmit>
        <xLgr>${empresa.endereco}</xLgr>
        <xMun>${empresa.cidade}</xMun>
        <UF>${empresa.estado}</UF>
        <CEP>${empresa.cep.replace(/\D/g, '')}</CEP>
      </enderEmit>
      <IE>${empresa.inscricao_estadual || ''}</IE>
      <CRT>1</CRT>
    </emit>
    <dest>
      <CNPJ>${cliente.cpf_cnpj.replace(/\D/g, '')}</CNPJ>
      <xNome>${cliente.nome_razao_social}</xNome>
      <enderDest>
        <xLgr>${cliente.endereco}</xLgr>
        <xMun>${cliente.cidade}</xMun>
        <UF>${cliente.estado}</UF>
        <CEP>${cliente.cep.replace(/\D/g, '')}</CEP>
      </enderDest>
    </dest>
  </infNFe>
</NFe>`;

    return xml;
  }

  private static gerarChaveAcesso(empresa: any, configs: any, numero: number): string {
    const agora = new Date();
    const uf = '35'; // SP
    const aamm = agora.getFullYear().toString().substr(2) + (agora.getMonth() + 1).toString().padStart(2, '0');
    const cnpj = empresa.cnpj.replace(/\D/g, '');
    const mod = '55';
    const serie = configs.serie_nfe.toString().padStart(3, '0');
    const numeroStr = numero.toString().padStart(9, '0');
    const tpEmis = '1';
    const cNF = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
    
    const chaveBase = uf + aamm + cnpj + mod + serie + numeroStr + tpEmis + cNF;
    const dv = this.calcularDVChaveAcesso(chaveBase);
    
    return chaveBase + dv;
  }

  private static calcularDVChaveAcesso(chave: string): string {
    const sequence = '4329876543298765432987654329876543298765432';
    let sum = 0;
    
    for (let i = 0; i < chave.length; i++) {
      sum += parseInt(chave[i]) * parseInt(sequence[i]);
    }
    
    const remainder = sum % 11;
    return remainder < 2 ? '0' : (11 - remainder).toString();
  }
}
