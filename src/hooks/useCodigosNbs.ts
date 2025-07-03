
import { useState, useEffect } from 'react';

export interface CodigoNbs {
  codigo: string;
  descricao: string;
}

// Lista básica de códigos NBS mais comuns - pode ser expandida
const CODIGOS_NBS: CodigoNbs[] = [
  { codigo: '1.01', descricao: 'Análise e desenvolvimento de sistemas' },
  { codigo: '1.02', descricao: 'Programação' },
  { codigo: '1.03', descricao: 'Processamento de dados e congêneres' },
  { codigo: '1.04', descricao: 'Elaboração de programas de computadores' },
  { codigo: '1.05', descricao: 'Licenciamento ou cessão de direito de uso de programas de computação' },
  { codigo: '2.01', descricao: 'Serviços de pesquisas e desenvolvimento de qualquer natureza' },
  { codigo: '3.02', descricao: 'Cessão de direito de uso de marcas e de sinais de propaganda' },
  { codigo: '4.01', descricao: 'Medicina e biomedicina' },
  { codigo: '4.02', descricao: 'Análises clínicas, patologia, eletricidade médica, radioterapia' },
  { codigo: '4.03', descricao: 'Hospitais, clínicas, laboratórios, sanatórios, manicômios' },
  { codigo: '5.01', descricao: 'Medicina veterinária' },
  { codigo: '6.01', descricao: 'Cuidados pessoais, estética, atividades físicas e congêneres' },
  { codigo: '7.01', descricao: 'Engenharia, agronomia, agrimensura, arquitetura, geologia' },
  { codigo: '7.02', descricao: 'Execução, por administração, empreitada ou subempreitada' },
  { codigo: '8.01', descricao: 'Ensino regular pré-escolar, fundamental, médio e superior' },
  { codigo: '8.02', descricao: 'Instrução, treinamento, orientação pedagógica e educacional' },
  { codigo: '9.01', descricao: 'Hospedagem em hotéis, apart-service condominiais, flat' },
  { codigo: '9.02', descricao: 'Turismo, agências de viagens, guias de turismo' },
  { codigo: '10.01', descricao: 'Agenciamento, corretagem ou intermediação de títulos' },
  { codigo: '10.02', descricao: 'Abertura de contas em geral, inclusive conta-corrente' },
  { codigo: '11.01', descricao: 'Guarda e estacionamento de veículos terrestres automotores' },
  { codigo: '11.02', descricao: 'Vigilância, segurança ou monitoramento de bens e pessoas' },
  { codigo: '12.01', descricao: 'Espetáculos teatrais' },
  { codigo: '12.02', descricao: 'Exibições cinematográficas' },
  { codigo: '13.01', descricao: 'Serviços de avaliação de bens e serviços de qualquer natureza' },
  { codigo: '13.02', descricao: 'Auditoria' },
  { codigo: '13.03', descricao: 'Domicílio tributário' },
  { codigo: '13.04', descricao: 'Consultoria' },
  { codigo: '13.05', descricao: 'Planejamento, coordenação, programação ou organização técnica' },
  { codigo: '14.01', descricao: 'Lubrificação, limpeza, lustração, revisão, carga e recarga' },
  { codigo: '14.02', descricao: 'Assistência técnica' },
  { codigo: '15.01', descricao: 'Administração de fundos quaisquer, de consórcio, de cartão de crédito' },
  { codigo: '15.02', descricao: 'Abertura de contas em geral, inclusive conta-corrente' },
  { codigo: '16.01', descricao: 'Serviços de transporte coletivo municipal rodoviário' },
  { codigo: '17.01', descricao: 'Assessoria ou consultoria de qualquer natureza' },
  { codigo: '17.02', descricao: 'Datilografia, digitação, estenografia, expediente' },
  { codigo: '17.03', descricao: 'Planejamento, coordenação, programação ou organização técnica' },
  { codigo: '17.04', descricao: 'Cobrança em geral' },
  { codigo: '17.05', descricao: 'Correspondência' },
  { codigo: '17.06', descricao: 'Contabilidade' },
  { codigo: '17.08', descricao: 'Franquia (franchising)' },
  { codigo: '17.09', descricao: 'Perícia, laudo, exame técnico' },
  { codigo: '17.10', descricao: 'Planejamento, organização e administração de feiras' },
  { codigo: '17.11', descricao: 'Organização de festas e recepções; bufê' },
  { codigo: '17.12', descricao: 'Administração em geral' },
  { codigo: '17.13', descricao: 'Leilão e congêneres' },
  { codigo: '17.14', descricao: 'Advocacia' },
  { codigo: '17.15', descricao: 'Arbitragem de qualquer espécie, inclusive jurídica' },
  { codigo: '17.16', descricao: 'Auditoria' },
  { codigo: '17.17', descricao: 'Análise, exame, pesquisa, coleta, compilação e fornecimento de dados e informações de qualquer natureza' },
  { codigo: '17.18', descricao: 'Atuária e cálculos técnicos de qualquer natureza' },
  { codigo: '17.19', descricao: 'Análise de organização e métodos' },
  { codigo: '17.20', descricao: 'Acompanhamento e coordenação de terceiros' },
  { codigo: '17.21', descricao: 'Relações públicas, propaganda e publicidade' },
  { codigo: '17.22', descricao: 'Franquia (franchising)' },
  { codigo: '17.23', descricao: 'Advocacia' },
  { codigo: '17.24', descricao: 'Inserção de textos, desenhos e outros materiais de propaganda e publicidade' }
];

export const useCodigosNbs = () => {
  const [codigosNbs] = useState<CodigoNbs[]>(CODIGOS_NBS);
  const [loading, setLoading] = useState(false);

  const buscarCodigoPorDescricao = (termo: string): CodigoNbs[] => {
    if (!termo) return codigosNbs;
    
    return codigosNbs.filter(codigo => 
      codigo.descricao.toLowerCase().includes(termo.toLowerCase()) ||
      codigo.codigo.includes(termo)
    );
  };

  return {
    codigosNbs,
    loading,
    buscarCodigoPorDescricao
  };
};
