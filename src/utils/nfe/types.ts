
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
