
import { useState, useEffect } from 'react';

export interface CodigoNbs {
  codigo: string;
  descricao: string;
}

// Lista completa e atualizada de códigos NBS
const CODIGOS_NBS: CodigoNbs[] = [
  { codigo: '1.01', descricao: 'Análise e desenvolvimento de sistemas' },
  { codigo: '1.02', descricao: 'Programação' },
  { codigo: '1.03', descricao: 'Processamento de dados e congêneres' },
  { codigo: '1.04', descricao: 'Elaboração de programas de computadores, inclusive de jogos eletrônicos' },
  { codigo: '1.05', descricao: 'Licenciamento ou cessão de direito de uso de programas de computação' },
  { codigo: '1.06', descricao: 'Assessoria e consultoria em informática' },
  { codigo: '1.07', descricao: 'Suporte técnico em informática, inclusive instalação, configuração e manutenção de programas de computação e bancos de dados' },
  { codigo: '1.08', descricao: 'Planejamento, confecção, manutenção e atualização de páginas eletrônicas' },
  { codigo: '1.09', descricao: 'Disponibilização, sem cessão definitiva, de conteúdos de áudio, vídeo, imagem e texto por meio da internet' },
  { codigo: '2.01', descricao: 'Serviços de pesquisas e desenvolvimento de qualquer natureza' },
  { codigo: '3.01', descricao: 'Cessão de direito de uso de programa de computação' },
  { codigo: '3.02', descricao: 'Cessão de direito de uso de marcas e de sinais de propaganda' },
  { codigo: '3.03', descricao: 'Cessão de direito de exploração de salões de festas, centro de convenções, escritórios virtuais, stands, quadras esportivas, estádios, ginásios, auditórios, casa de espetáculos, parques de diversões, canchas e congêneres' },
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
  { codigo: '7.02', descricao: 'Execução, por administração, empreitada ou subempreitada, de obras de construção civil, hidráulica ou elétrica e de outras obras semelhantes' },
  { codigo: '7.03', descricao: 'Elaboração de planos diretores, estudos de viabilidade, estudos organizacionais e outros, relacionados com obras e serviços de engenharia' },
  { codigo: '7.04', descricao: 'Demolição' },
  { codigo: '7.05', descricao: 'Reparação, conservação e reforma de edifícios, estradas, pontes, portos e congêneres' },
  { codigo: '7.06', descricao: 'Limpeza e dragagem de rios, portos, canais, baías, lagos, lagoas, represas, açudes e congêneres' },
  { codigo: '7.07', descricao: 'Florestamento, reflorestamento, semeadura, adubação e congêneres' },
  { codigo: '7.08', descricao: 'Escoramento, contenção de encostas e congêneres' },
  { codigo: '7.09', descricao: 'Paisagismo, jardinagem e decoração' },
  { codigo: '7.10', descricao: 'Iluminação em bens públicos' },
  { codigo: '7.11', descricao: 'Vigilância e segurança' },
  { codigo: '7.12', descricao: 'Limpeza, manutenção e conservação de vias e logradouros públicos' },
  { codigo: '7.13', descricao: 'Varrição, coleta, remoção, incineração, tratamento, reciclagem, separação e destinação final de lixo, rejeitos e outros resíduos quaisquer' },
  { codigo: '8.01', descricao: 'Ensino regular pré-escolar, fundamental, médio e superior' },
  { codigo: '8.02', descricao: 'Instrução, treinamento, orientação pedagógica e educacional, avaliação de conhecimentos de qualquer natureza' },
  { codigo: '9.01', descricao: 'Hospedagem de qualquer natureza em hotéis, apart-service condominiais, flat, apart-hotéis, hotéis residência, residence-service, suite service, hotelaria marítima, motéis, pensões e congêneres' },
  { codigo: '9.02', descricao: 'Agenciamento, organização, promoção, intermediação e execução de programas de turismo, passeios, viagens, excursões, hospedagens e congêneres' },
  { codigo: '9.03', descricao: 'Guias de turismo' },
  { codigo: '10.01', descricao: 'Agenciamento, corretagem ou intermediação de câmbio, de seguros, de cartões de crédito, de planos de saúde e de planos de previdência privada' },
  { codigo: '10.02', descricao: 'Agenciamento, corretagem ou intermediação de títulos em geral, valores mobiliários e contratos quaisquer' },
  { codigo: '10.03', descricao: 'Agenciamento, corretagem ou intermediação de direitos de propriedade industrial, artística ou literária' },
  { codigo: '10.04', descricao: 'Agenciamento, corretagem ou intermediação de contratos de arrendamento mercantil (leasing), de franquia (franchising) e de faturização (factoring)' },
  { codigo: '10.05', descricao: 'Agenciamento, corretagem ou intermediação de bens móveis ou imóveis, não abrangidos em outros itens ou subitens' },
  { codigo: '10.06', descricao: 'Agenciamento marítimo' },
  { codigo: '10.07', descricao: 'Agenciamento de notícias' },
  { codigo: '10.08', descricao: 'Agenciamento de publicidade e propaganda, inclusive o agenciamento de veiculação por qualquer meio' },
  { codigo: '10.09', descricao: 'Representação de qualquer natureza, inclusive comercial' },
  { codigo: '10.10', descricao: 'Distribuição de bens de terceiros' },
  { codigo: '11.01', descricao: 'Guarda e estacionamento de veículos terrestres automotores, de aeronaves e de embarcações' },
  { codigo: '11.02', descricao: 'Vigilância, segurança ou monitoramento de bens e pessoas' },
  { codigo: '11.03', descricao: 'Escolta, inclusive de veículos e cargas' },
  { codigo: '11.04', descricao: 'Armazenamento, depósito, carga, descarga, arrumação e guarda de bens de qualquer espécie' },
  { codigo: '12.01', descricao: 'Espetáculos teatrais' },
  { codigo: '12.02', descricao: 'Exibições cinematográficas' },
  { codigo: '12.03', descricao: 'Espetáculos circenses' },
  { codigo: '12.04', descricao: 'Programas de auditório' },
  { codigo: '12.05', descricao: 'Parques de diversões, centros de lazer e congêneres' },
  { codigo: '12.06', descricao: 'Boates, taxi-dancing e congêneres' },
  { codigo: '12.07', descricao: 'Shows, ballet, danças, desfiles, bailes, óperas, concertos, recitais, festivais e congêneres' },
  { codigo: '12.08', descricao: 'Feiras, exposições, congressos e congêneres' },
  { codigo: '12.09', descricao: 'Bilhares, boliches e diversões eletrônicas ou não' },
  { codigo: '12.10', descricao: 'Corridas e competições de animais' },
  { codigo: '12.11', descricao: 'Competições esportivas ou de destreza física ou intelectual, com ou sem a participação do espectador' },
  { codigo: '12.12', descricao: 'Execução de música' },
  { codigo: '12.13', descricao: 'Produção, mediante ou sem encomenda prévia, de eventos, espetáculos, entrevistas, shows, ballet, danças, desfiles, bailes, teatros, óperas, concertos, recitais, festivais e congêneres' },
  { codigo: '12.14', descricao: 'Fornecimento de música para ambientes fechados ou não, mediante transmissão por qualquer processo' },
  { codigo: '12.15', descricao: 'Desfiles de blocos carnavalescos ou folclóricos, trios elétricos e congêneres' },
  { codigo: '12.16', descricao: 'Exibição de filmes, entrevistas, musicais, espetáculos, shows, concertos, desfiles, óperas, competições esportivas, de destreza intelectual ou congêneres' },
  { codigo: '12.17', descricao: 'Recreação e animação, inclusive em festas e eventos' },
  { codigo: '13.01', descricao: 'Serviços de biblioteconomia' },
  { codigo: '13.02', descricao: 'Decoração e jardinagem, inclusive corte e poda de árvores' },
  { codigo: '13.03', descricao: 'Elaboração de desenhos, projetos e cálculos para trabalhos de engenharia civil, hidráulica, elétrica, mecânica, telecomunicações e de outras modalidades' },
  { codigo: '13.04', descricao: 'Elaboração de planos diretores, estudos de viabilidade, estudos organizacionais e outros, relacionados com obras e serviços de engenharia' },
  { codigo: '13.05', descricao: 'Elaboração de anteprojetos, projetos básicos e projetos executivos para trabalhos de engenharia' }
];

export const useCodigosNbs = () => {
  const [codigosNbs, setCodigosNbs] = useState<CodigoNbs[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('=== useCodigosNbs Hook ===');
    console.log('Iniciando carregamento dos códigos NBS...');
    
    // Simular um pequeno delay para mostrar o loading
    const timer = setTimeout(() => {
      setCodigosNbs(CODIGOS_NBS);
      setLoading(false);
      console.log('Códigos NBS carregados com sucesso:', CODIGOS_NBS.length, 'códigos');
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const buscarCodigoPorDescricao = (termo: string): CodigoNbs[] => {
    console.log('=== Busca NBS ===');
    console.log('Termo de busca:', termo);
    
    if (!termo || termo.trim() === '') {
      console.log('Retornando array vazio (termo vazio)');
      return [];
    }
    
    const termoLower = termo.toLowerCase().trim();
    const resultados = codigosNbs.filter(codigo => {
      const codigoMatch = codigo.codigo.toLowerCase().includes(termoLower);
      const descricaoMatch = codigo.descricao.toLowerCase().includes(termoLower);
      return codigoMatch || descricaoMatch;
    });
    
    console.log('Resultados encontrados:', resultados.length);
    console.log('Primeiros 3 resultados:', resultados.slice(0, 3));
    
    return resultados;
  };

  const buscarCodigoPorCodigo = (codigo: string): CodigoNbs | undefined => {
    console.log('Buscando código específico:', codigo);
    const resultado = codigosNbs.find(item => item.codigo === codigo);
    console.log('Código encontrado:', resultado);
    return resultado;
  };

  return {
    codigosNbs,
    loading,
    buscarCodigoPorDescricao,
    buscarCodigoPorCodigo
  };
};
