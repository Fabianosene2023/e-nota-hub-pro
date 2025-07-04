import { useState, useEffect } from 'react';

export interface CodigoNbs {
  codigo: string;
  descricao: string;
}

// Lista oficial completa de códigos NBS - Fonte: gov.br
const CODIGOS_NBS: CodigoNbs[] = [
  { codigo: '1.01', descricao: 'Análise e desenvolvimento de sistemas' },
  { codigo: '1.02', descricao: 'Programação' },
  { codigo: '1.03.01', descricao: 'Processamento de dados, textos, imagens, vídeos, páginas eletrônicas, aplicativos e sistemas de informação, entre outros formatos, e congêneres' },
  { codigo: '1.03.02', descricao: 'Armazenamento ou hospedagem de dados, textos, imagens, vídeos, páginas eletrônicas, aplicativos e sistemas de informação, entre outros formatos, e congêneres' },
  { codigo: '1.04', descricao: 'Elaboração de programas de computadores, inclusive de jogos eletrônicos, independentemente da arquitetura construtiva da máquina em que o programa será executado, incluindo tablets, smartphones e congêneres' },
  { codigo: '1.05', descricao: 'Licenciamento ou cessão de direito de uso de programas de computação' },
  { codigo: '1.06', descricao: 'Assessoria e consultoria em informática' },
  { codigo: '1.07', descricao: 'Suporte técnico em informática, inclusive instalação, configuração e manutenção de programas de computação e bancos de dados' },
  { codigo: '1.08', descricao: 'Planejamento, confecção, manutenção e atualização de páginas eletrônicas' },
  { codigo: '1.09.01', descricao: 'Disponibilização, sem cessão definitiva, de conteúdos de áudio por meio da internet (exceto a distribuição de conteúdos pelas prestadoras de Serviço de Acesso Condicionado, de que trata a Lei nº 12.485, de 12 de setembro de 2011, sujeita ao ICMS)' },
  { codigo: '1.09.02', descricao: 'Disponibilização, sem cessão definitiva, de conteúdos de vídeo, imagem e texto por meio da internet, respeitada a imunidade de livros, jornais e periódicos (exceto a distribuição de conteúdos pelas prestadoras de Serviço de Acesso Condicionado, de que trata a Lei nº 12.485, de 12 de setembro de 2011, sujeita ao ICMS)' },
  { codigo: '2.01', descricao: 'Serviços de pesquisas e desenvolvimento de qualquer natureza' },
  { codigo: '3.02', descricao: 'Cessão de direito de uso de marcas e de sinais de propaganda' },
  { codigo: '3.03.01', descricao: 'Exploração de salões de festas, centro de convenções, stands e congêneres, para realização de eventos ou negócios de qualquer natureza' },
  { codigo: '3.03.02', descricao: 'Exploração de escritórios virtuais e congêneres, para realização de eventos ou negócios de qualquer natureza' },
  { codigo: '3.03.03', descricao: 'Exploração de quadras esportivas, estádios, ginásios, canchas e congêneres, para realização de eventos ou negócios de qualquer natureza' },
  { codigo: '3.03.04', descricao: 'Exploração de auditórios, casas de espetáculos e congêneres, para realização de eventos ou negócios de qualquer natureza' },
  { codigo: '3.03.05', descricao: 'Exploração de parques de diversões e congêneres, para realização de eventos ou negócios de qualquer natureza' },
  { codigo: '3.04.01', descricao: 'Locação, sublocação, arrendamento, direito de passagem ou permissão de uso, compartilhado ou não, de ferrovia' },
  { codigo: '3.04.02', descricao: 'Locação, sublocação, arrendamento, direito de passagem ou permissão de uso, compartilhado ou não, de rodovia' },
  { codigo: '3.04.03', descricao: 'Locação, sublocação, arrendamento, direito de passagem ou permissão de uso, compartilhado ou não, de postes, cabos, dutos e condutos de qualquer natureza' },
  { codigo: '3.05', descricao: 'Cessão de andaimes, palcos, coberturas e outras estruturas de uso temporário' },
  { codigo: '4.01.01', descricao: 'Medicina' },
  { codigo: '4.01.02', descricao: 'Biomedicina' },
  { codigo: '4.02.01', descricao: 'Análises clínicas e congêneres' },
  { codigo: '4.02.02', descricao: 'Patologia e congêneres' },
  { codigo: '4.02.03', descricao: 'Eletricidade médica (eletroestimulação de nervos e musculos, cardioversão, etc) e congêneres' },
  { codigo: '4.02.04', descricao: 'Radioterapia, quimioterapia e congêneres' },
  { codigo: '4.02.05', descricao: 'Ultra-sonografia, ressonância magnética, radiologia, tomografia e congêneres' },
  { codigo: '4.03.01', descricao: 'Hospitais e congêneres' },
  { codigo: '4.03.02', descricao: 'Laboratórios e congêneres' },
  { codigo: '4.03.03', descricao: 'Clínicas, sanatórios, manicômios, casas de saúde, prontos-socorros, ambulatórios e congêneres' },
  { codigo: '4.04', descricao: 'Instrumentação cirúrgica' },
  { codigo: '4.05', descricao: 'Acupuntura' },
  { codigo: '4.06', descricao: 'Enfermagem, inclusive serviços auxiliares' },
  { codigo: '4.07', descricao: 'Serviços farmacêuticos' },
  { codigo: '4.08.01', descricao: 'Terapia ocupacional' },
  { codigo: '4.08.02', descricao: 'Fisioterapia' },
  { codigo: '4.08.03', descricao: 'Fonoaudiologia' },
  { codigo: '4.09', descricao: 'Terapias de qualquer espécie destinadas ao tratamento físico, orgânico e mental' },
  { codigo: '4.10', descricao: 'Nutrição' },
  { codigo: '4.11', descricao: 'Obstetrícia' },
  { codigo: '4.12', descricao: 'Odontologia' },
  { codigo: '4.13', descricao: 'Ortóptica' },
  { codigo: '4.14', descricao: 'Próteses sob encomenda' },
  { codigo: '4.15', descricao: 'Psicanálise' },
  { codigo: '4.16', descricao: 'Psicologia' },
  { codigo: '4.17.01', descricao: 'Casas de repouso e congêneres' },
  { codigo: '4.17.02', descricao: 'Casas de recuperação e congêneres' },
  { codigo: '4.17.03', descricao: 'Creches e congêneres' },
  { codigo: '4.17.04', descricao: 'Asilos e congêneres' },
  { codigo: '4.18', descricao: 'Inseminação artificial, fertilização in vitro e congêneres' },
  { codigo: '4.19', descricao: 'Bancos de sangue, leite, pele, olhos, óvulos, sêmen e congêneres' },
  { codigo: '4.20', descricao: 'Coleta de sangue, leite, tecidos, sêmen, órgãos e materiais biológicos de qualquer espécie' },
  { codigo: '4.21', descricao: 'Unidade de atendimento, assistência ou tratamento móvel e congêneres' },
  { codigo: '4.22', descricao: 'Planos de medicina de grupo ou individual e convênios para prestação de assistência médica, hospitalar, odontológica e congêneres' },
  { codigo: '4.23', descricao: 'Outros planos de saúde que se cumpram através de serviços de terceiros contratados, credenciados, cooperados ou apenas pagos pelo operador do plano mediante indicação do beneficiário' },
  { codigo: '5.01.01', descricao: 'Medicina veterinária' },
  { codigo: '5.01.02', descricao: 'Zootecnia' },
  { codigo: '5.02.01', descricao: 'Hospitais e congêneres, na área veterinária' },
  { codigo: '5.02.02', descricao: 'Clínicas, ambulatórios, prontos-socorros e congêneres, na área veterinária' },
  { codigo: '5.03', descricao: 'Laboratórios de análise na área veterinária' },
  { codigo: '5.04', descricao: 'Inseminação artificial, fertilização in vitro e congêneres' },
  { codigo: '5.05', descricao: 'Bancos de sangue e de órgãos e congêneres' },
  { codigo: '5.06', descricao: 'Coleta de sangue, leite, tecidos, sêmen, órgãos e materiais biológicos de qualquer espécie' },
  { codigo: '5.07', descricao: 'Unidade de atendimento, assistência ou tratamento móvel e congêneres' },
  { codigo: '5.08', descricao: 'Guarda, tratamento, amestramento, embelezamento, alojamento e congêneres' },
  { codigo: '5.09', descricao: 'Planos de atendimento e assistência médico-veterinária' },
  { codigo: '6.01', descricao: 'Barbearia, cabeleireiros, manicuros, pedicuros e congêneres' },
  { codigo: '6.02', descricao: 'Esteticistas, tratamento de pele, depilação e congêneres' },
  { codigo: '6.03', descricao: 'Banhos, duchas, sauna, massagens e congêneres' },
  { codigo: '6.04', descricao: 'Ginástica, dança, esportes, natação, artes marciais e demais atividades físicas' },
  { codigo: '6.05', descricao: 'Centros de emagrecimento, spa e congêneres' },
  { codigo: '6.06', descricao: 'Aplicação de tatuagens, piercings e congêneres' },
  { codigo: '7.01.01', descricao: 'Engenharia e congêneres' },
  { codigo: '7.01.02', descricao: 'Agronomia e congêneres' },
  { codigo: '7.01.03', descricao: 'Agrimensura e congêneres' },
  { codigo: '7.01.04', descricao: 'Arquitetura, urbanismo e congêneres' },
  { codigo: '7.01.05', descricao: 'Geologia e congêneres' },
  { codigo: '7.01.06', descricao: 'Paisagismo e congêneres' },
  { codigo: '7.02.01', descricao: 'Execução, por administração, de obras de construção civil, hidráulica ou elétrica e de outras obras semelhantes, inclusive sondagem, perfuração de poços, escavação, drenagem e irrigação, terraplanagem, pavimentação, concretagem e a instalação e montagem de produtos, peças e equipamentos (exceto o fornecimento de mercadorias produzidas pelo prestador de serviços fora do local da prestação dos serviços, que fica sujeito ao ICMS)' },
  { codigo: '7.02.02', descricao: 'Execução, por empreitada ou subempreitada, de obras de construção civil, hidráulica ou elétrica e de outras obras semelhantes, inclusive sondagem, perfuração de poços, escavação, drenagem e irrigação, terraplanagem, pavimentação, concretagem e a instalação e montagem de produtos, peças e equipamentos (exceto o fornecimento de mercadorias produzidas pelo prestador de serviços fora do local da prestação dos serviços, que fica sujeito ao ICMS)' },
  { codigo: '7.03.01', descricao: 'Elaboração de planos diretores, estudos de viabilidade, estudos organizacionais e outros, relacionados com obras e serviços de engenharia' },
  { codigo: '7.03.02', descricao: 'Elaboração de anteprojetos, projetos básicos e projetos executivos para trabalhos de engenharia' },
  { codigo: '7.04', descricao: 'Demolição' },
  { codigo: '7.05.01', descricao: 'Reparação, conservação e reforma de edifícios e congêneres (exceto o fornecimento de mercadorias produzidas pelo prestador dos serviços, fora do local da prestação dos serviços, que fica sujeito ao ICMS)' },
  { codigo: '7.05.02', descricao: 'Reparação, conservação e reforma de estradas, pontes, portos e congêneres (exceto o fornecimento de mercadorias produzidas pelo prestador dos serviços, fora do local da prestação dos serviços, que fica sujeito ao ICMS)' },
  { codigo: '7.06.01', descricao: 'Colocação e instalação de tapetes, carpetes, cortinas e congêneres, com material fornecido pelo tomador do serviço' },
  { codigo: '7.06.02', descricao: 'Colocação e instalação de assoalhos, revestimentos de parede, vidros, divisórias, placas de gesso e congêneres, com material fornecido pelo tomador do serviço' },
  { codigo: '7.07', descricao: 'Recuperação, raspagem, polimento e lustração de pisos e congêneres' },
  { codigo: '7.08', descricao: 'Calafetação' },
  { codigo: '7.09.01', descricao: 'Varrição, coleta e remoção de lixo, rejeitos e outros resíduos quaisquer' },
  { codigo: '7.09.02', descricao: 'Incineração, tratamento, reciclagem, separação e destinação final de lixo, rejeitos e outros resíduos quaisquer' },
  { codigo: '7.10.01', descricao: 'Limpeza, manutenção e conservação de vias e logradouros públicos, parques, jardins e congêneres' },
  { codigo: '7.10.02', descricao: 'Limpeza, manutenção e conservação de imóveis, chaminés, piscinas e congêneres' },
  { codigo: '7.11.01', descricao: 'Decoração' },
  { codigo: '7.11.02', descricao: 'Jardinagem, inclusive corte e poda de árvores' },
  { codigo: '7.12', descricao: 'Controle e tratamento de efluentes de qualquer natureza e de agentes físicos, químicos e biológicos' },
  { codigo: '7.13', descricao: 'Dedetização, desinfecção, desinsetização, imunização, higienização, desratização, pulverização e congêneres' },
  { codigo: '7.16', descricao: 'Florestamento, reflorestamento, semeadura, adubação, reparação de solo, plantio, silagem, colheita, corte e descascamento de árvores, silvicultura, exploração florestal e dos serviços congêneres indissociáveis da formação, manutenção e colheita de florestas, para quaisquer fins e por quaisquer meios' },
  { codigo: '7.17', descricao: 'Escoramento, contenção de encostas e serviços congêneres' },
  { codigo: '7.18', descricao: 'Limpeza e dragagem de rios, portos, canais, baías, lagos, lagoas, represas, açudes e congêneres' },
  { codigo: '7.19', descricao: 'Acompanhamento e fiscalização da execução de obras de engenharia, arquitetura e urbanismo' },
  { codigo: '7.20.01', descricao: 'Aerofotogrametria (inclusive interpretação), cartografia, mapeamento e congêneres' },
  { codigo: '7.20.02', descricao: 'Levantamentos batimétricos, geográficos, geodésicos, geológicos, geofísicos e congêneres' },
  { codigo: '7.20.03', descricao: 'Levantamentos topográficos e congêneres' },
  { codigo: '7.21', descricao: 'Pesquisa, perfuração, cimentação, mergulho, perfilagem, concretação, testemunhagem, pescaria, estimulação e outros serviços relacionados com a exploração e explotação de petróleo, gás natural e de outros recursos minerais' },
  { codigo: '7.22', descricao: 'Nucleação e bombardeamento de nuvens e congêneres' },
  { codigo: '8.01.01', descricao: 'Ensino regular pré-escolar, fundamental e médio' },
  { codigo: '8.01.02', descricao: 'Ensino regular superior' },
  { codigo: '8.02', descricao: 'Instrução, treinamento, orientação pedagógica e educacional, avaliação de conhecimentos de qualquer natureza' },
  { codigo: '9.01.01', descricao: 'Hospedagem em hotéis, hotelaria marítima e congêneres (o valor da alimentação e gorjeta, quando incluído no preço da diária, fica sujeito ao Imposto Sobre Serviços)' },
  { codigo: '9.01.02', descricao: 'Hospedagem em pensões, albergues, pousadas, hospedarias, ocupação por temporada com fornecimento de serviços e congêneres (o valor da alimentação e gorjeta, quando incluído no preço da diária, fica sujeito ao Imposto Sobre Serviços)' },
  { codigo: '9.01.03', descricao: 'Hospedagem em motéis e congêneres (o valor da alimentação e gorjeta, quando incluído no preço da diária, fica sujeito ao Imposto Sobre Serviços)' },
  { codigo: '9.01.04', descricao: 'Hospedagem em apart-service condominiais, flat, apart-hotéis, hotéis residência, residence-service, suite service e congêneres (o valor da alimentação e gorjeta, quando incluído no preço da diária, fica sujeito ao Imposto Sobre Serviços)' },
  { codigo: '9.02.01', descricao: 'Agenciamento e intermediação de programas de turismo, passeios, viagens, excursões, hospedagens e congêneres' },
  { codigo: '9.02.02', descricao: 'Organização, promoção e execução de programas de turismo, passeios, viagens, excursões, hospedagens e congêneres' },
  { codigo: '9.03', descricao: 'Guias de turismo' },
  { codigo: '10.01.01', descricao: 'Agenciamento, corretagem ou intermediação de câmbio' },
  { codigo: '10.01.02', descricao: 'Agenciamento, corretagem ou intermediação de seguros' },
  { codigo: '10.01.03', descricao: 'Agenciamento, corretagem ou intermediação de cartões de crédito' },
  { codigo: '10.01.04', descricao: 'Agenciamento, corretagem ou intermediação de planos de saúde' },
  { codigo: '10.01.05', descricao: 'Agenciamento, corretagem ou intermediação de planos de previdência privada' },
  { codigo: '10.02.01', descricao: 'Agenciamento, corretagem ou intermediação de títulos em geral e valores mobiliários' },
  { codigo: '10.02.02', descricao: 'Agenciamento, corretagem ou intermediação de contratos quaisquer' },
  { codigo: '10.03', descricao: 'Agenciamento, corretagem ou intermediação de direitos de propriedade industrial, artística ou literária' },
  { codigo: '10.04.01', descricao: 'Agenciamento, corretagem ou intermediação de contratos de arrendamento mercantil (leasing)' },
  { codigo: '10.04.02', descricao: 'Agenciamento, corretagem ou intermediação de contratos de franquia (franchising)' },
  { codigo: '10.04.03', descricao: 'Agenciamento, corretagem ou intermediação de faturização (factoring)' },
  { codigo: '10.05.01', descricao: 'Agenciamento, corretagem ou intermediação de bens móveis ou imóveis, não abrangidos em outros itens ou subitens, por quaisquer meios' },
  { codigo: '10.05.02', descricao: 'Agenciamento, corretagem ou intermediação de bens móveis ou imóveis realizados no âmbito de Bolsas de Mercadorias e Futuros, por quaisquer meios' },
  { codigo: '10.06', descricao: 'Agenciamento marítimo' },
  { codigo: '10.07', descricao: 'Agenciamento de notícias' },
  { codigo: '10.08', descricao: 'Agenciamento de publicidade e propaganda, inclusive o agenciamento de veiculação por quaisquer meios' },
  { codigo: '10.09', descricao: 'Representação de qualquer natureza, inclusive comercial' },
  { codigo: '10.10', descricao: 'Distribuição de bens de terceiros' },
  { codigo: '11.01.01', descricao: 'Guarda e estacionamento de veículos terrestres automotores' },
  { codigo: '11.01.02', descricao: 'Guarda e estacionamento de aeronaves e de embarcações' },
  { codigo: '11.02', descricao: 'Vigilância, segurança ou monitoramento de bens, pessoas e semoventes' },
  { codigo: '11.03', descricao: 'Escolta, inclusive de veículos e cargas' },
  { codigo: '11.04.01', descricao: 'Armazenamento, depósito, guarda de bens de qualquer espécie' },
  { codigo: '11.04.02', descricao: 'Carga, descarga, arrumação de bens de qualquer espécie' },
  { codigo: '12.01', descricao: 'Espetáculos teatrais' },
  { codigo: '12.02', descricao: 'Exibições cinematográficas' },
  { codigo: '12.03', descricao: 'Espetáculos circenses' },
  { codigo: '12.04', descricao: 'Programas de auditório' },
  { codigo: '12.05', descricao: 'Parques de diversões, centros de lazer e congêneres' },
  { codigo: '12.06', descricao: 'Boates, taxi-dancing e congêneres' },
  { codigo: '12.07', descricao: 'Shows, ballet, danças, desfiles, bailes, óperas, concertos, recitais, festivais e congêneres' },
  { codigo: '12.08', descricao: 'Feiras, exposições, congressos e congêneres' },
  { codigo: '12.09.01', descricao: 'Bilhares' },
  { codigo: '12.09.02', descricao: 'Boliches' },
  { codigo: '12.09.03', descricao: 'Diversões eletrônicas ou não' },
  { codigo: '12.10', descricao: 'Corridas e competições de animais' },
  { codigo: '12.11', descricao: 'Competições esportivas ou de destreza física ou intelectual, com ou sem a participação do espectador' },
  { codigo: '12.12', descricao: 'Execução de música' },
  { codigo: '12.13', descricao: 'Produção, mediante ou sem encomenda prévia, de eventos, espetáculos, entrevistas, shows, ballet, danças, desfiles, bailes, teatros, óperas, concertos, recitais, festivais e congêneres' },
  { codigo: '12.14', descricao: 'Fornecimento de música para ambientes fechados ou não, mediante transmissão por qualquer processo' },
  { codigo: '12.15', descricao: 'Desfiles de blocos carnavalescos ou folclóricos, trios elétricos e congêneres' },
  { codigo: '12.16', descricao: 'Exibição de filmes, entrevistas, musicais, espetáculos, shows, concertos, desfiles, óperas, competições esportivas, de destreza intelectual ou congêneres' },
  { codigo: '12.17', descricao: 'Recreação e animação, inclusive em festas e eventos de qualquer natureza' },
  { codigo: '13.02', descricao: 'Fonografia ou gravação de sons, inclusive trucagem, dublagem, mixagem e congêneres' },
  { codigo: '13.03', descricao: 'Fotografia e cinematografia, inclusive revelação, ampliação, cópia, reprodução, trucagem e congêneres' },
  { codigo: '13.04', descricao: 'Reprografia, microfilmagem e digitalização' },
  { codigo: '13.05', descricao: 'Composição gráfica, inclusive confecção de impressos gráficos, fotocomposição, clicheria, zincografia, litografia e fotolitografia, exceto se destinados a posterior operação de comercialização ou industrialização, ainda que incorporados, de qualquer forma, a outra mercadoria que deva ser objeto de posterior circulação, tais como bulas, rótulos, etiquetas, caixas, cartuchos, embalagens e manuais técnicos e de instrução, quando ficarão sujeitos ao ICMS' },
  { codigo: '14.01', descricao: 'Lubrificação, limpeza, lustração, revisão, carga e recarga, conserto, restauração, blindagem, manutenção e conservação de máquinas, veículos, aparelhos, equipamentos, motores, elevadores ou de qualquer objeto (exceto peças e partes empregadas, que ficam sujeitas ao ICMS)' },
  { codigo: '14.02', descricao: 'Assistência técnica' },
  { codigo: '14.03', descricao: 'Recondicionamento de motores (exceto peças e partes empregadas, que ficam sujeitas ao ICMS)' },
  { codigo: '14.04', descricao: 'Recauchutagem ou regeneração de pneus' },
  { codigo: '14.05', descricao: 'Restauração, recondicionamento, acondicionamento, pintura, beneficiamento, lavagem, secagem, tingimento, galvanoplastia, anodização, corte, recorte, plastificação, costura, acabamento, polimento e congêneres de objetos quaisquer' },
  { codigo: '14.06', descricao: 'Instalação e montagem de aparelhos, máquinas e equipamentos, inclusive montagem industrial, prestados ao usuário final, exclusivamente com material por ele fornecido' },
  { codigo: '14.07', descricao: 'Colocação de molduras e congêneres' },
  { codigo: '14.08', descricao: 'Encadernação, gravação e douração de livros, revistas e congêneres' },
  { codigo: '14.09', descricao: 'Alfaiataria e costura, quando o material for fornecido pelo usuário final, exceto aviamento' },
  { codigo: '14.10', descricao: 'Tinturaria e lavanderia' },
  { codigo: '14.11', descricao: 'Tapeçaria e reforma de estofamentos em geral' },
  { codigo: '14.12', descricao: 'Funilaria e lanternagem' },
  { codigo: '14.13.01', descricao: 'Carpintaria' },
  { codigo: '14.13.02', descricao: 'Serralheria' },
  { codigo: '14.14.01', descricao: 'Guincho intramunicipal' },
  { codigo: '14.14.02', descricao: 'Guindaste e içamento' },
  { codigo: '15.01.01', descricao: 'Administração de fundos quaisquer e congêneres' },
  { codigo: '15.01.02', descricao: 'Administração de consórcio e congêneres' },
  { codigo: '15.01.03', descricao: 'Administração de cartão de crédito ou débito e congêneres' },
  { codigo: '15.01.04', descricao: 'Administração de carteira de clientes e congêneres' },
  { codigo: '15.01.05', descricao: 'Administração de cheques pré-datados e congêneres' },
  { codigo: '15.02.01', descricao: 'Abertura de conta-corrente no País, bem como a manutenção da referida conta ativa e inativa' },
  { codigo: '15.02.02', descricao: 'Abertura de conta-corrente no exterior, bem como a manutenção da referida conta ativa e inativa' },
  { codigo: '15.02.03', descricao: 'Abertura de conta de investimentos e aplicação no País, bem como a manutenção da referida conta ativa e inativa' },
  { codigo: '15.02.04', descricao: 'Abertura de conta de investimentos e aplicação no exterior, bem como a manutenção da referida conta ativa e inativa' },
  { codigo: '15.02.05', descricao: 'Abertura de caderneta de poupança no País, bem como a manutenção da referida conta ativa e inativa' },
  { codigo: '15.02.06', descricao: 'Abertura de caderneta de poupança no exterior, bem como a manutenção da referida conta ativa e inativa' },
  { codigo: '15.02.07', descricao: 'Abertura de contas em geral no País, não abrangida em outro subitem, bem como a manutenção das referidas contas ativas e inativas' },
  { codigo: '15.02.08', descricao: 'Abertura de contas em geral no exterior, não abrangida em outro subitem, bem como a manutenção das referidas contas ativas e inativas' },
  { codigo: '15.03.01', descricao: 'Locação de cofres particulares' },
  { codigo: '15.03.02', descricao: 'Manutenção de cofres particulares' },
  { codigo: '15.03.03', descricao: 'Locação de terminais eletrônicos' },
  { codigo: '15.03.04', descricao: 'Manutenção de terminais eletrônicos' },
  { codigo: '15.03.05', descricao: 'Locação de terminais de atendimento' },
  { codigo: '15.03.06', descricao: 'Manutenção de terminais de atendimento' },
  { codigo: '15.03.07', descricao: 'Locação de bens e equipamentos em geral' },
  { codigo: '15.03.08', descricao: 'Manutenção de bens e equipamentos em geral' },
  { codigo: '15.04', descricao: 'Fornecimento ou emissão de atestados em geral, inclusive atestado de idoneidade, atestado de capacidade financeira e congêneres' },
  { codigo: '15.05.01', descricao: 'Cadastro, elaboração de ficha cadastral, renovação cadastral e congêneres' },
  { codigo: '15.05.02', descricao: 'Inclusão no Cadastro de Emitentes de Cheques sem Fundos - CCF' },
  { codigo: '15.05.03', descricao: 'Exclusão no Cadastro de Emitentes de Cheques sem Fundos - CCF' },
  { codigo: '15.05.04', descricao: 'Inclusão em quaisquer outros bancos cadastrais' },
  { codigo: '15.05.05', descricao: 'Exclusão em quaisquer outros bancos cadastrais' },
  { codigo: '15.06.01', descricao: 'Emissão, reemissão e fornecimento de avisos, comprovantes e documentos em geral' },
  { codigo: '15.06.02', descricao: 'Abono de firmas' },
  { codigo: '15.06.03', descricao: 'Coleta e entrega de documentos, bens e valores' },
  { codigo: '15.06.04', descricao: 'Comunicação com outra agência ou com a administração central' },
  { codigo: '15.06.05', descricao: 'Licenciamento eletrônico de veículos' },
  { codigo: '15.06.06', descricao: 'Transferência de veículos' },
  { codigo: '15.06.07', descricao: 'Agenciamento fiduciário ou depositário' },
  { codigo: '15.06.08', descricao: 'Devolução de bens em custódia' },
  { codigo: '15.07.01', descricao: 'Acesso, movimentação, atendimento e consulta a contas em geral, por qualquer meio ou processo, inclusive por telefone, fac-símile, internet e telex' },
  { codigo: '15.07.02', descricao: 'Acesso a terminais de atendimento, inclusive vinte e quatro horas' },
  { codigo: '15.07.03', descricao: 'Acesso a outro banco e à rede compartilhada' },
  { codigo: '15.07.04', descricao: 'Fornecimento de saldo, extrato e demais informações relativas a contas em geral, por qualquer meio ou processo' },
  { codigo: '15.08.01', descricao: 'Emissão, reemissão, alteração, cessão, substituição, cancelamento e registro de contrato de crédito' },
  { codigo: '15.08.02', descricao: 'Estudo, análise e avaliação de operações de crédito' },
  { codigo: '15.08.03', descricao: 'Emissão, concessão, alteração ou contratação de aval, fiança, anuência e congêneres' },
  { codigo: '15.08.04', descricao: 'Serviços relativos à abertura de crédito, para quaisquer fins' },
  { codigo: '15.09', descricao: 'Arrendamento mercantil (leasing) de quaisquer bens, inclusive cessão de direitos e obrigações, substituição de garantia, alteração, cancelamento e registro de contrato, e demais serviços relacionados ao arrendamento mercantil (leasing)' },
  { codigo: '15.10.01', descricao: 'Serviços relacionados a cobranças em geral, de títulos quaisquer, de contas ou carnês, de câmbio, de tributos e por conta de terceiros, inclusive os efetuados por meio eletrônico, automático ou por máquinas de atendimento' },
  { codigo: '15.10.02', descricao: 'Serviços relacionados a recebimentos em geral, de títulos quaisquer, de contas ou carnês, de câmbio, de tributos e por conta de terceiros, inclusive os efetuados por meio eletrônico, automático ou por máquinas de atendimento' },
  { codigo: '15.10.03', descricao: 'Serviços relacionados a pagamentos em geral, de títulos quaisquer, de contas ou carnês, de câmbio, de tributos e por conta de terceiros, inclusive os efetuados por meio eletrônico, automático ou por máquinas de atendimento' },
  { codigo: '15.10.04', descricao: 'Serviços relacionados a fornecimento de posição de cobrança, recebimento ou pagamento' },
  { codigo: '15.10.05', descricao: 'Serviços relacionados a emissão de carnês, fichas de compensação, impressos e documentos em geral' },
  { codigo: '15.11', descricao: 'Devolução de títulos, protesto de títulos, sustação de protesto, manutenção de títulos, reapresentação de títulos, e demais serviços a eles relacionados' },
  { codigo: '15.12', descricao: 'Custódia em geral, inclusive de títulos e valores mobiliários' },
  { codigo: '15.13.01', descricao: 'Serviços relacionados a operações de câmbio em geral, edição, alteração, prorrogação, cancelamento e baixa de contrato de câmbio' },
  { codigo: '15.13.02', descricao: 'Serviços relacionados a emissão de registro de exportação ou de crédito' },
  { codigo: '15.13.03', descricao: 'Serviços relacionados a cobrança ou depósito no exterior' },
  { codigo: '15.13.04', descricao: 'Serviços relacionados a emissão, fornecimento e cancelamento de cheques de viagem' },
  { codigo: '15.13.05', descricao: 'Serviços relacionados a fornecimento, transferência, cancelamento e demais serviços relativos a carta de crédito de importação, exportação e garantias recebidas' },
  { codigo: '15.13.06', descricao: 'Serviços relacionados a envio e recebimento de mensagens em geral relacionadas a operações de câmbio' },
  { codigo: '15.14.01', descricao: 'Fornecimento, emissão, reemissão de cartão magnético, cartão de crédito, cartão de débito, cartão salário e congêneres' },
  { codigo: '15.14.02', descricao: 'Renovação de cartão magnético, cartão de crédito, cartão de débito, cartão salário e congêneres' },
  { codigo: '15.14.03', descricao: 'Manutenção de cartão magnético, cartão de crédito, cartão de débito, cartão salário e congêneres' },
  { codigo: '15.15.01', descricao: 'Compensação de cheques e títulos quaisquer' },
  { codigo: '15.15.02', descricao: 'Serviços relacionados a depósito, inclusive depósito identificado, a saque de contas quaisquer, por qualquer meio ou processo, inclusive em terminais eletrônicos e de atendimento' },
  { codigo: '15.16.01', descricao: 'Emissão, reemissão, liquidação, alteração, cancelamento e baixa de ordens de pagamento, ordens de crédito e similares, por qualquer meio ou processo' },
  { codigo: '15.16.02', descricao: 'Serviços relacionados à transferência de valores, dados, fundos, pagamentos e similares, inclusive entre contas em geral' },
  { codigo: '15.17.01', descricao: 'Emissão e fornecimento de cheques quaisquer, avulso ou por talão' },
  { codigo: '15.17.02', descricao: 'Devolução de cheques quaisquer, avulso ou por talão' },
  { codigo: '15.17.03', descricao: 'Sustação, cancelamento e oposição de cheques quaisquer, avulso ou por talão' },
  { codigo: '15.18.01', descricao: 'Serviços relacionados a crédito imobiliário, de avaliação e vistoria de imóvel ou obra' },
  { codigo: '15.18.02', descricao: 'Serviços relacionados a crédito imobiliário, de análise técnica e jurídica' },
  { codigo: '15.18.03', descricao: 'Serviços relacionados a crédito imobiliário, de emissão, reemissão, alteração, transferência e renegociação de contrato' },
  { codigo: '15.18.04', descricao: 'Serviços relacionados a crédito imobiliário, de emissão e reemissão do termo de quitação' },
  { codigo: '15.18.05', descricao: 'Demais serviços relacionados a crédito imobiliário' },
  { codigo: '16.01.01', descricao: 'Serviços de transporte coletivo municipal rodoviário de passageiros' },
  { codigo: '16.01.02', descricao: 'Serviços de transporte coletivo municipal metroviário de passageiros' },
  { codigo: '16.01.03', descricao: 'Serviços de transporte coletivo municipal ferroviário de passageiros' },
  { codigo: '16.01.04', descricao: 'Serviços de transporte coletivo municipal aquaviário de passageiros' },
  { codigo: '16.02', descricao: 'Outros serviços de transporte de natureza municipal' },
  { codigo: '17.01.01', descricao: 'Assessoria ou consultoria de qualquer natureza, não contida em outros itens desta lista' },
  { codigo: '17.01.02', descricao: 'Análise, exame, pesquisa, coleta, compilação e fornecimento de dados e informações de qualquer natureza, inclusive cadastro e similares' },
  { codigo: '17.02.01', descricao: 'Datilografia, digitação, estenografia e congêneres' },
  { codigo: '17.02.02', descricao: 'Expediente, secretaria em geral, apoio e infra-estrutura administrativa e congêneres' },
  { codigo: '17.02.03', descricao: 'Resposta audível e congêneres' },
  { codigo: '17.02.04', descricao: 'Redação, edição, revisão e congêneres' },
  { codigo: '17.02.05', descricao: 'Interpretação, tradução e congêneres' },
  { codigo: '17.03.01', descricao: 'Planejamento, coordenação, programação ou organização técnica' },
  { codigo: '17.03.02', descricao: 'Planejamento, coordenação, programação ou organização financeira' },
  { codigo: '17.03.03', descricao: 'Planejamento, coordenação, programação ou organização administrativa' },
  { codigo: '17.04', descricao: 'Recrutamento, agenciamento, seleção e colocação de mão-de-obra' },
  { codigo: '17.05', descricao: 'Fornecimento de mão-de-obra, mesmo em caráter temporário, inclusive de empregados ou trabalhadores, avulsos ou temporários, contratados pelo prestador de serviço' },
  { codigo: '17.06', descricao: 'Propaganda e publicidade, inclusive promoção de vendas, planejamento de campanhas ou sistemas de publicidade, elaboração de desenhos, textos e demais materiais publicitários' },
  { codigo: '17.08', descricao: 'Franquia (franchising)' },
  { codigo: '17.09', descricao: 'Perícias, laudos, exames técnicos e análises técnicas' },
  { codigo: '17.10.01', descricao: 'Planejamento, organização e administração de feiras, exposições, e congêneres' },
  { codigo: '17.10.02', descricao: 'Planejamento, organização e administração de congressos e congêneres' },
  { codigo: '17.11.01', descricao: 'Organização de festas e recepções' },
  { codigo: '17.11.02', descricao: 'Bufê (exceto o fornecimento de alimentação e bebidas, que fica sujeito ao ICMS)' },
  { codigo: '17.12', descricao: 'Administração em geral, inclusive de bens e negócios de terceiros' },
  { codigo: '17.13', descricao: 'Leilão e congêneres' },
  { codigo: '17.14', descricao: 'Advocacia' },
  { codigo: '17.15', descricao: 'Arbitragem de qualquer espécie, inclusive jurídica' },
  { codigo: '17.16', descricao: 'Auditoria' },
  { codigo: '17.17', descricao: 'Análise de Organização e Métodos' },
  { codigo: '17.18', descricao: 'Atuária e cálculos técnicos de qualquer natureza' },
  { codigo: '17.19', descricao: 'Contabilidade, inclusive serviços técnicos e auxiliares' },
  { codigo: '17.20', descricao: 'Consultoria e assessoria econômica ou financeira' },
  { codigo: '17.21', descricao: 'Estatística' },
  { codigo: '17.22', descricao: 'Cobrança em geral' },
  { codigo: '17.23', descricao: 'Assessoria, análise, avaliação, atendimento, consulta, cadastro, seleção, gerenciamento de informações, administração de contas a receber ou a pagar e em geral, relacionados a operações de faturização (factoring)' },
  { codigo: '17.24', descricao: 'Apresentação de palestras, conferências, seminários e congêneres' },
  { codigo: '17.25', descricao: 'Inserção de textos, desenhos e outros materiais de propaganda e publicidade, em qualquer meio (exceto em livros, jornais, periódicos e nas modalidades de serviços de radiodifusão sonora e de sons e imagens de recepção livre e gratuita)' },
  { codigo: '18.01.01', descricao: 'Serviços de regulação de sinistros vinculados a contratos de seguros e congêneres' },
  { codigo: '18.01.02', descricao: 'Serviços de inspeção e avaliação de riscos para cobertura de contratos de seguros e congêneres' },
  { codigo: '18.01.03', descricao: 'Serviços de prevenção e gerência de riscos seguráveis e congêneres' },
  { codigo: '19.01.01', descricao: 'Serviços de distribuição e venda de bilhetes e demais produtos de loteria, cartões, pules ou cupons de apostas, sorteios, prêmios, inclusive os decorrentes de títulos de capitalização e congêneres' },
  { codigo: '19.01.02', descricao: 'Serviços de distribuição e venda de bingos e congêneres' },
  { codigo: '20.01.01', descricao: 'Serviços portuários, ferroportuários, utilização de porto, movimentação de passageiros, reboque de embarcações, rebocador escoteiro, atracação, desatracação, serviços de praticagem, capatazia, armazenagem de qualquer natureza, serviços acessórios, movimentação de mercadorias, serviços de apoio marítimo, de movimentação ao largo, serviços de armadores, estiva, conferência, logística e congêneres (prestado em terra)' },
  { codigo: '20.01.02', descricao: 'Serviços portuários, ferroportuários, utilização de porto, movimentação de passageiros, reboque de embarcações, rebocador escoteiro, atracação, desatracação, serviços de praticagem, capatazia, armazenagem de qualquer natureza, serviços acessórios, movimentação de mercadorias, serviços de apoio marítimo, de movimentação ao largo, serviços de armadores, estiva, conferência, logística e congêneres (prestado em águas marinhas)' },
  { codigo: '20.02', descricao: 'Serviços aeroportuários, utilização de aeroporto, movimentação de passageiros, armazenagem de qualquer natureza, capatazia, movimentação de aeronaves, serviços de apoio aeroportuários, serviços acessórios, movimentação de mercadorias, logística e congêneres' },
  { codigo: '20.03', descricao: 'Serviços de terminais rodoviários, ferroviários, metroviários, movimentação de passageiros, mercadorias, inclusive suas operações, logística e congêneres' },
  { codigo: '21.01', descricao: 'Serviços de registros públicos, cartorários e notariais' },
  { codigo: '22.01', descricao: 'Serviços de exploração de rodovia mediante cobrança de preço ou pedágio dos usuários, envolvendo execução de serviços de conservação, manutenção, melhoramentos para adequação de capacidade e segurança de trânsito, operação, monitoração, assistência aos usuários e outros serviços definidos em contratos, atos de concessão ou de permissão ou em normas oficiais' },
  { codigo: '23.01.01', descricao: 'Serviços de programação e comunicação visual e congêneres' },
  { codigo: '23.01.02', descricao: 'Serviços de desenho industrial e congêneres' },
  { codigo: '24.01.01', descricao: 'Serviços de chaveiros, confecção de carimbos e congêneres' },
  { codigo: '24.01.02', descricao: 'Serviços de placas, sinalização visual, banners, adesivos e congêneres' },
  { codigo: '25.01', descricao: 'Funerais, inclusive fornecimento de caixão, urna ou esquifes; aluguel de capela; transporte do corpo cadavérico; fornecimento de flores, coroas e outros paramentos; desembaraço de certidão de óbito; fornecimento de véu, essa e outros adornos; embalsamento, embelezamento, conservação ou restauração de cadáveres' },
  { codigo: '25.02.01', descricao: 'Translado intramunicipal de corpos e partes de corpos cadavéricos' },
  { codigo: '25.02.02', descricao: 'Cremação de corpos e partes de corpos cadavéricos' },
  { codigo: '25.03', descricao: 'Planos ou convênio funerários' },
  { codigo: '25.04', descricao: 'Manutenção e conservação de jazigos e cemitérios' },
  { codigo: '25.05', descricao: 'Cessão de uso de espaços em cemitérios para sepultamento' },
  { codigo: '26.01.01', descricao: 'Serviços de coleta, remessa ou entrega de correspondências, documentos, objetos, bens ou valores, inclusive pelos correios e suas agências franqueadas' },
  { codigo: '26.01.02', descricao: 'Serviços de courrier e congêneres' },
  { codigo: '27.01', descricao: 'Serviços de assistência social' },
  { codigo: '28.01', descricao: 'Serviços de avaliação de bens e serviços de qualquer natureza' },
  { codigo: '29.01', descricao: 'Serviços de biblioteconomia' },
  { codigo: '30.01.01', descricao: 'Serviços de biologia e biotecnologia' },
  { codigo: '30.01.02', descricao: 'Serviços de química' },
  { codigo: '31.01.01', descricao: 'Serviços técnicos em edificações e congêneres' },
  { codigo: '31.01.02', descricao: 'Serviços técnicos em eletrônica, eletrotécnica e congêneres' },
  { codigo: '31.01.03', descricao: 'Serviços técnicos em mecânica e congêneres' },
  { codigo: '31.01.04', descricao: 'Serviços técnicos em telecomunicações e congêneres' },
  { codigo: '32.01', descricao: 'Serviços de desenhos técnicos' },
  { codigo: '33.01', descricao: 'Serviços de desembaraço aduaneiro, comissários, despachantes e congêneres' },
  { codigo: '34.01', descricao: 'Serviços de investigações particulares, detetives e congêneres' },
  { codigo: '35.01.01', descricao: 'Serviços de reportagem e jornalismo' },
  { codigo: '35.01.02', descricao: 'Serviços de assessoria de imprensa' },
  { codigo: '35.01.03', descricao: 'Serviços de relações públicas' },
  { codigo: '36.01', descricao: 'Serviços de meteorologia' },
  { codigo: '37.01', descricao: 'Serviços de artistas, atletas, modelos e manequins' },
  { codigo: '38.01', descricao: 'Serviços de museologia' },
  { codigo: '39.01', descricao: 'Serviços de ourivesaria e lapidação (quando o material for fornecido pelo tomador do serviço)' },
  { codigo: '40.01', descricao: 'Obras de arte sob encomenda' },
  { codigo: '99.01', descricao: 'Serviços sem a incidência de ISSQN e ICMS' }
];

export const useCodigosNbs = () => {
  const [codigosNbs, setCodigosNbs] = useState<CodigoNbs[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('=== useCodigosNbs Hook - Inicializando ===');
    console.log('Total de códigos na constante CODIGOS_NBS:', CODIGOS_NBS.length);
    console.log('Primeiros 3 códigos da constante:', CODIGOS_NBS.slice(0, 3));
    
    const timer = setTimeout(() => {
      console.log('=== Carregando códigos NBS ===');
      setCodigosNbs(CODIGOS_NBS);
      setLoading(false);
      console.log('✅ Códigos NBS carregados:', CODIGOS_NBS.length, 'códigos');
      console.log('Códigos carregados no estado:', CODIGOS_NBS.length);
      console.log('Primeiros 3 códigos carregados:', CODIGOS_NBS.slice(0, 3));
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const buscarCodigoPorDescricao = (termo: string): CodigoNbs[] => {
    console.log('=== Buscando códigos NBS ===');
    console.log('Termo de busca:', termo);
    console.log('Total de códigos disponíveis:', codigosNbs.length);
    
    if (!termo || termo.trim() === '') {
      console.log('Termo vazio - retornando array vazio');
      return [];
    }
    
    if (codigosNbs.length === 0) {
      console.error('❌ Nenhum código disponível para busca!');
      return [];
    }
    
    const termoLower = termo.toLowerCase().trim();
    console.log('Termo processado:', termoLower);
    
    const resultados = codigosNbs.filter(codigo => {
      const codigoMatch = codigo.codigo.toLowerCase().includes(termoLower);
      const descricaoMatch = codigo.descricao.toLowerCase().includes(termoLower);
      const match = codigoMatch || descricaoMatch;
      
      if (match) {
        console.log('✅ Código encontrado:', codigo.codigo, '-', codigo.descricao.substring(0, 50) + '...');
      }
      
      return match;
    });
    
    console.log(`✅ Resultado da busca: ${resultados.length} códigos encontrados para "${termo}"`);
    if (resultados.length > 0) {
      console.log('Primeiros resultados:', resultados.slice(0, 3).map(r => `${r.codigo} - ${r.descricao.substring(0, 30)}...`));
    }
    
    return resultados;
  };

  const buscarCodigoPorCodigo = (codigo: string): CodigoNbs | undefined => {
    if (!codigo) {
      console.log('Código vazio para busca específica');
      return undefined;
    }
    
    console.log('=== Buscando código específico ===');
    console.log('Código procurado:', codigo);
    
    const resultado = codigosNbs.find(item => item.codigo === codigo);
    console.log('Resultado encontrado:', resultado);
    
    return resultado;
  };

  return {
    codigosNbs,
    loading,
    buscarCodigoPorDescricao,
    buscarCodigoPorCodigo
  };
};