
import { useState, useEffect } from 'react';

export interface CodigoNbs {
  codigo: string;
  descricao: string;
}

// Lista expandida de códigos NBS mais comuns
const CODIGOS_NBS: CodigoNbs[] = [
  { codigo: '1.01', descricao: 'Análise e desenvolvimento de sistemas' },
  { codigo: '1.02', descricao: 'Programação' },
  { codigo: '1.03', descricao: 'Processamento de dados e congêneres' },
  { codigo: '1.04', descricao: 'Elaboração de programas de computadores' },
  { codigo: '1.05', descricao: 'Licenciamento ou cessão de direito de uso de programas de computação' },
  { codigo: '1.06', descricao: 'Assessoria e consultoria em informática' },
  { codigo: '1.07', descricao: 'Suporte técnico em informática, inclusive instalação, configuração e manutenção de programas de computação e bancos de dados' },
  { codigo: '1.08', descricao: 'Planejamento, confecção, manutenção e atualização de páginas eletrônicas' },
  { codigo: '2.01', descricao: 'Serviços de pesquisas e desenvolvimento de qualquer natureza' },
  { codigo: '3.01', descricao: 'Cessão de direito de uso de programa de computação' },
  { codigo: '3.02', descricao: 'Cessão de direito de uso de marcas e de sinais de propaganda' },
  { codigo: '3.03', descricao: 'Cessão de direito de exploração de salões de festas, centro de convenções, escritórios virtuais, stands, quadras esportivas, estádios, ginásios, auditórios, casa de espetáculos, parques de diversões, canchas e congêneres, para realização de eventos ou negócios de qualquer natureza' },
  { codigo: '3.04', descricao: 'Cessão de direito de uso de andaimes, palcos, coberturas e outras estruturas de uso temporário' },
  { codigo: '4.01', descricao: 'Medicina e biomedicina' },
  { codigo: '4.02', descricao: 'Análises clínicas, patologia, eletricidade médica, radioterapia, quimioterapia, ultra-sonografia, ressonância magnética, radiologia, tomografia e congêneres' },
  { codigo: '4.03', descricao: 'Hospitais, clínicas, laboratórios, sanatórios, manicômios, casas de saúde, prontos-socorros, ambulatórios e congêneres' },
  { codigo: '4.04', descricao: 'Instrumentação cirúrgica' },
  { codigo: '4.05', descricao: 'Acupuntura' },
  { codigo: '4.06', descricao: 'Enfermagem, inclusive serviços auxiliares' },
  { codigo: '4.07', descricao: 'Serviços farmacêuticos' },
  { codigo: '4.08', descricao: 'Terapia ocupacional, fisioterapia e fonoaudiologia' },
  { codigo: '4.09', descricao: 'Terapias de qualquer espécie destinadas ao tratamento físico, orgânico e mental' },
  { codigo: '4.10', descricao: 'Nutrição' },
  { codigo: '4.11', descricao: 'Obstetrícia' },
  { codigo: '4.12', descricao: 'Odontologia' },
  { codigo: '4.13', descricao: 'Ortóptica' },
  { codigo: '4.14', descricao: 'Próteses sob encomenda' },
  { codigo: '4.15', descricao: 'Psicanálise' },
  { codigo: '4.16', descricao: 'Psicologia' },
  { codigo: '4.17', descricao: 'Casas de repouso e de recuperação, creches, asilos e congêneres' },
  { codigo: '4.18', descricao: 'Inseminação artificial, fertilização in vitro e congêneres' },
  { codigo: '4.19', descricao: 'Bancos de sangue, leite, pele, olhos, óvulos, sêmen e congêneres' },
  { codigo: '4.20', descricao: 'Coleta de sangue, leite, tecidos, sêmen, órgãos e materiais biológicos de qualquer espécie' },
  { codigo: '4.21', descricao: 'Unidade de atendimento, assistência ou tratamento móvel e congêneres' },
  { codigo: '4.22', descricao: 'Planos de medicina de grupo ou individual e convênios para prestação de assistência médica, hospitalar, odontológica e congêneres' },
  { codigo: '4.23', descricao: 'Outros planos de saúde que se cumpram através de serviços de terceiros contratados, credenciados, cooperados ou apenas pagos pelo operador do plano mediante indicação do beneficiário' },
  { codigo: '5.01', descricao: 'Medicina veterinária' },
  { codigo: '5.02', descricao: 'Hospitais veterinários' },
  { codigo: '5.03', descricao: 'Laboratórios de análise clínica veterinária' },
  { codigo: '5.04', descricao: 'Inseminação artificial em animais' },
  { codigo: '5.05', descricao: 'Bancos de sêmen animal' },
  { codigo: '5.06', descricao: 'Coleta de sangue animal' },
  { codigo: '5.07', descricao: 'Unidade de atendimento, assistência ou tratamento móvel veterinário' },
  { codigo: '5.08', descricao: 'Guarda, tratamento, amestramento, embelezamento, alojamento e congêneres' },
  { codigo: '5.09', descricao: 'Planos de atendimento e assistência médico-veterinária' },
  { codigo: '6.01', descricao: 'Barbearia, cabeleireiros, manicuros, pedicuros e congêneres' },
  { codigo: '6.02', descricao: 'Esteticistas, tratamento de pele, depilação e congêneres' },
  { codigo: '6.03', descricao: 'Banhos, duchas, sauna, massagens e congêneres' },
  { codigo: '6.04', descricao: 'Ginástica, dança, esportes, natação, artes marciais e demais atividades físicas' },
  { codigo: '6.05', descricao: 'Centros de emagrecimento, spa e congêneres' },
  { codigo: '6.06', descricao: 'Aplicação de tatuagens, piercings e congêneres' },
  { codigo: '7.01', descricao: 'Engenharia, agronomia, agrimensura, arquitetura, geologia, urbanismo, paisagismo e congêneres' },
  { codigo: '7.02', descricao: 'Execução, por administração, empreitada ou subempreitada, de obras de construção civil, hidráulica ou elétrica e de outras obras semelhantes, inclusive sondagem, perfuração de poços, escavação, drenagem e irrigação, terraplanagem, pavimentação, concretagem e a instalação e montagem de produtos, peças e equipamentos (exceto o fornecimento de mercadorias produzidas pelo prestador de serviços fora do local da prestação dos serviços, que fica sujeito ao ICMS)' },
  { codigo: '7.03', descricao: 'Elaboração de planos diretores, estudos de viabilidade, estudos organizacionais e outros, relacionados com obras e serviços de engenharia; elaboração de anteprojetos, projetos básicos e projetos executivos para trabalhos de engenharia' },
  { codigo: '7.04', descricao: 'Demolição' },
  { codigo: '7.05', descricao: 'Reparação, conservação e reforma de edifícios, estradas, pontes, portos e congêneres (exceto o fornecimento de mercadorias produzidas pelo prestador dos serviços, fora do local da prestação dos serviços, que fica sujeito ao ICMS)' },
  { codigo: '8.01', descricao: 'Ensino regular pré-escolar, fundamental, médio e superior' },
  { codigo: '8.02', descricao: 'Instrução, treinamento, orientação pedagógica e educacional, avaliação de conhecimentos de qualquer natureza' }
];

export const useCodigosNbs = () => {
  const [codigosNbs, setCodigosNbs] = useState<CodigoNbs[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Carregando códigos NBS...');
    setCodigosNbs(CODIGOS_NBS);
    setLoading(false);
    console.log('Códigos NBS carregados:', CODIGOS_NBS.length);
  }, []);

  const buscarCodigoPorDescricao = (termo: string): CodigoNbs[] => {
    if (!termo) return codigosNbs;
    
    const termoLower = termo.toLowerCase();
    return codigosNbs.filter(codigo => 
      codigo.descricao.toLowerCase().includes(termoLower) ||
      codigo.codigo.includes(termo)
    );
  };

  const buscarCodigoPorCodigo = (codigo: string): CodigoNbs | undefined => {
    return codigosNbs.find(item => item.codigo === codigo);
  };

  return {
    codigosNbs,
    loading,
    buscarCodigoPorDescricao,
    buscarCodigoPorCodigo
  };
};
