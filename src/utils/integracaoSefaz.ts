
// Simulação de integração com SEFAZ - Em produção, usar biblioteca real como node-nfe
export interface DadosNFe {
  empresa_id: string;
  cliente_id: string;
  numero: number;
  serie: number;
  valor_total: number;
  natureza_operacao: string;
  itens: Array<{
    produto_id: string;
    quantidade: number;
    valor_unitario: number;
    valor_total: number;
    cfop: string;
  }>;
  observacoes?: string;
}

export interface RetornoSefaz {
  success: boolean;
  chave_acesso?: string;
  protocolo?: string;
  xml_nfe?: string;
  danfe_pdf?: string;
  status: 'autorizada' | 'rejeitada' | 'denegada';
  motivo?: string;
  codigo_status?: string;
}

export const emitirNFe = async (dados: DadosNFe): Promise<RetornoSefaz> => {
  console.log('Emitindo NFe com dados:', dados);
  
  // Simular delay da API da SEFAZ
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simular resposta da SEFAZ (90% de sucesso)
  const sucesso = Math.random() > 0.1;
  
  if (sucesso) {
    const chaveAcesso = gerarChaveAcesso(dados);
    const protocolo = gerarProtocolo();
    
    return {
      success: true,
      chave_acesso: chaveAcesso,
      protocolo: protocolo,
      xml_nfe: gerarXMLSimulado(dados, chaveAcesso),
      danfe_pdf: `danfe_${dados.numero}_${dados.serie}.pdf`,
      status: 'autorizada'
    };
  } else {
    return {
      success: false,
      status: 'rejeitada',
      motivo: 'Erro na validação dos dados fiscais',
      codigo_status: '539'
    };
  }
};

export const consultarStatusNFe = async (chaveAcesso: string): Promise<RetornoSefaz> => {
  console.log('Consultando status da NFe:', chaveAcesso);
  
  // Simular consulta na SEFAZ
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    success: true,
    chave_acesso: chaveAcesso,
    status: 'autorizada',
    protocolo: gerarProtocolo()
  };
};

export const cancelarNFe = async (chaveAcesso: string, justificativa: string): Promise<RetornoSefaz> => {
  console.log('Cancelando NFe:', chaveAcesso, 'Justificativa:', justificativa);
  
  if (justificativa.length < 15) {
    return {
      success: false,
      status: 'rejeitada',
      motivo: 'Justificativa deve ter pelo menos 15 caracteres'
    };
  }
  
  // Simular cancelamento na SEFAZ
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    success: true,
    chave_acesso: chaveAcesso,
    status: 'autorizada',
    protocolo: gerarProtocolo()
  };
};

const gerarChaveAcesso = (dados: DadosNFe): string => {
  const estado = '35'; // SP
  const ano = new Date().getFullYear().toString().slice(-2);
  const mes = (new Date().getMonth() + 1).toString().padStart(2, '0');
  const cnpj = '12345678000190'; // Simular CNPJ
  const modelo = '55';
  const serie = dados.serie.toString().padStart(3, '0');
  const numero = dados.numero.toString().padStart(9, '0');
  const forma_emissao = '1';
  const codigo_numerico = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
  
  const chave_sem_dv = `${estado}${ano}${mes}${cnpj}${modelo}${serie}${numero}${forma_emissao}${codigo_numerico}`;
  const dv = calcularDVChaveAcesso(chave_sem_dv);
  
  return `${chave_sem_dv}${dv}`;
};

const calcularDVChaveAcesso = (chave: string): string => {
  const sequencia = '4329876543298765432987654329876543298765432';
  let soma = 0;
  
  for (let i = 0; i < chave.length; i++) {
    soma += parseInt(chave[i]) * parseInt(sequencia[i]);
  }
  
  const resto = soma % 11;
  return resto < 2 ? '0' : (11 - resto).toString();
};

const gerarProtocolo = (): string => {
  return `135${Date.now().toString().slice(-10)}`;
};

const gerarXMLSimulado = (dados: DadosNFe, chaveAcesso: string): string => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe">
  <NFe>
    <infNFe Id="NFe${chaveAcesso}">
      <ide>
        <cUF>35</cUF>
        <cNF>${chaveAcesso.slice(-8)}</cNF>
        <natOp>${dados.natureza_operacao}</natOp>
        <mod>55</mod>
        <serie>${dados.serie}</serie>
        <nNF>${dados.numero}</nNF>
        <dhEmi>${new Date().toISOString()}</dhEmi>
        <tpNF>1</tpNF>
        <idDest>1</idDest>
        <cMunFG>3550308</cMunFG>
        <tpImp>1</tpImp>
        <tpEmis>1</tpEmis>
        <cDV>${chaveAcesso.slice(-1)}</cDV>
        <tpAmb>2</tpAmb>
        <finNFe>1</finNFe>
        <indFinal>1</indFinal>
        <indPres>1</indPres>
      </ide>
    </infNFe>
  </NFe>
</nfeProc>`;
};
