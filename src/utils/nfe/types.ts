
export interface DadosEmpresa {
  cnpj: string;
  razao_social: string;
  nome_fantasia?: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  inscricao_estadual?: string;
}

export interface DadosCliente {
  cpf_cnpj: string;
  nome_razao_social: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  inscricao_estadual?: string;
}

export interface DadosTransportadora {
  cpf_cnpj: string;
  nome_razao_social: string;
  inscricao_estadual?: string;
  endereco: string;
  cidade: string;
  estado: string;
  placa_veiculo?: string;
  rntrc?: string;
}

export interface ItemNFe {
  codigo: string;
  descricao: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  cfop: string;
  unidade: string;
  ncm?: string;
}

export interface DadosNota {
  numero: number;
  serie: number;
  natureza_operacao: string;
  valor_total: number;
  data_emissao: string;
  ambiente: 'homologacao' | 'producao';
  observacoes?: string;
  freight_value?: number;
  insurance_value?: number;
  freight_mode?: string;
  volume_quantity?: number;
  weight_gross?: number;
  weight_net?: number;
}

export interface DadosNFeCompletos {
  empresa: DadosEmpresa;
  cliente: DadosCliente;
  transportadora?: DadosTransportadora;
  nota: DadosNota;
  itens: ItemNFe[];
}

export interface RetornoNFe {
  success: boolean;
  chave_acesso?: string;
  protocolo?: string;
  xml_nfe?: string;
  xml_nfe_proc?: string;
  danfe_url?: string;
  erro?: string;
  codigo_status?: string;
  mensagem?: string;
}
