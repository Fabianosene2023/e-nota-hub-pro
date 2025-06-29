export interface TransportadoraData {
  id: string;
  empresa_id: string;
  nome_razao_social: string;
  nome_fantasia?: string;
  cpf_cnpj: string;
  tipo_pessoa: 'fisica' | 'juridica';
  inscricao_estadual?: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  telefone?: string;
  email?: string;
  placa_veiculo?: string;
  rntrc?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

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
    data_emissao: string; // ISO string esperado
    ambiente: 'homologacao' | 'producao';
    freight_value?: number;      // Valor do frete (opcional)
    insurance_value?: number;   // Valor do seguro (opcional)
    freight_mode?: string;      // Código modo de frete (opcional)
    volume_quantity?: number;   // Quantidade de volumes (opcional)
    weight_gross?: number;      // Peso bruto (opcional)
    weight_net?: number;        // Peso líquido (opcional)
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
  transportadora?: TransportadoraData; // Opcional
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

export interface RpsData {
  aliquota_iss: number;
  codigo_servico: string;
  codigo_verificacao: string;
  created_at: string;
  data_emissao: string;
  data_processamento: string;
  discriminacao: string;
  id: string;
  iss_retido: boolean;
  numero_rps: string;
  numero_nfse?: string;
  mensagem?: string;
  xml_rps: string;
  // demais campos podem ser adicionados conforme necessário
}

export interface NFSeSubmitResult {
  success?: boolean;
  mensagem?: string;
  numero_rps?: string;
  numero_nfse?: string;
  // outros campos relevantes podem ser adicionados
}

export interface NFSeSubmitResponse {
  rps: RpsData;
  nfseResult: NFSeSubmitResult;
}
