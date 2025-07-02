
export interface DadosNFeCompletos {
  empresa: {
    cnpj: string;
    razao_social: string;
    nome_fantasia?: string;
    inscricao_estadual?: string;
    endereco: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  cliente: {
    cpf_cnpj: string;
    nome_razao_social: string;
    inscricao_estadual?: string;
    endereco: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  itens: Array<{
    codigo: string;
    descricao: string;
    ncm?: string;
    cfop: string;
    unidade: string;
    quantidade: number;
    valor_unitario: number;
    valor_total: number;
  }>;
  nota: {
    numero: number;
    serie: number;
    data_emissao: string;
    natureza_operacao: string;
    valor_total: number;
    ambiente: 'homologacao' | 'producao';
    observacoes?: string;
    freight_value?: number;
    insurance_value?: number;
    freight_mode?: string;
  };
  transportadora?: {
    cpf_cnpj: string;
    nome_razao_social: string;
    inscricao_estadual?: string;
    endereco: string;
    cidade: string;
    estado: string;
    placa_veiculo?: string;
    rntrc?: string;
  };
}

export interface RetornoNFe {
  success: boolean;
  chave_acesso?: string;
  protocolo?: string;
  xml_nfe?: string;
  xml_nfe_proc?: string;
  codigo_status?: string;
  mensagem?: string;
  erro?: string;
}

export interface CertificadoDigital {
  conteudo: string;
  senha: string;
}
