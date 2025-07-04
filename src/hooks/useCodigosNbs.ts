
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
  { codigo: '13.05', descricao: 'Elaboração de anteprojetos, projetos básicos e projetos executivos para trabalhos de engenharia' },
  { codigo: '14.01', descricao: 'Lubrificação, limpeza, lustração e revisão de máquinas, veículos, aparelhos, equipamentos, motores, elevadores ou de qualquer objeto' },
  { codigo: '14.02', descricao: 'Assistência técnica e extensão rural' },
  { codigo: '14.03', descricao: 'Dedetização, desinfecção, desinsetização, imunização, higienização, desratização, pulverização e congêneres' },
  { codigo: '14.04', descricao: 'Coleta, remessa ou entrega de correspondências, documentos, objetos, bens ou valores, inclusive pelos correios e suas agências franqueadas' },
  { codigo: '14.05', descricao: 'Assistência técnica' },
  { codigo: '14.06', descricao: 'Recondicionamento de motores' },
  { codigo: '14.07', descricao: 'Recauchutagem ou regeneração de pneus' },
  { codigo: '14.08', descricao: 'Restauração, recondicionamento, acondicionamento, pintura, beneficiamento, lavagem, secagem, tingimento, galvanoplastia, anodização, corte, recorte, polimento, plasticização e congêneres' },
  { codigo: '14.09', descricao: 'Instalação e montagem de aparelhos, máquinas e equipamentos, inclusive montagem industrial, prestados ao usuário final, exclusivamente com material por ele fornecido' },
  { codigo: '14.10', descricao: 'Florestamento, reflorestamento, semeadura, adubação, reparação de solo, plantio, silagem, colheita, corte e descascamento de árvores, silvicultura, exploração florestal e dos serviços congêneres indissociáveis da formação, manutenção e colheita de florestas, para quaisquer fins e por quaisquer meios' },
  { codigo: '14.11', descricao: 'Escoramento, contenção de encostas e serviços congêneres' },
  { codigo: '14.12', descricao: 'Limpeza e dragagem de rios e canais' },
  { codigo: '14.13', descricao: 'Acompanhamento e fiscalização da execução de obras de engenharia, arquitetura e urbanismo' },
  { codigo: '14.14', descricao: 'Guincho intramunicipal, guindaste e içamento' },
  { codigo: '15.01', descricao: 'Administração de fundos quaisquer, de consórcio, de cartão de crédito ou débito e congêneres, de carteira de clientes, de cheques pré-datados e congêneres' },
  { codigo: '15.02', descricao: 'Abertura de crédito, para quaisquer fins, inclusive para intermediação de pagamentos' },
  { codigo: '15.03', descricao: 'Intermediação e congêneres de operações de câmbio, de seguros, de cartões de crédito, de planos de saúde e de planos de previdência privada' },
  { codigo: '15.04', descricao: 'Corretagem de títulos em geral, valores mobiliários e contratos quaisquer' },
  { codigo: '15.05', descricao: 'Desmaterialização de títulos e contratos para depósito ou registro em sistema eletrônico' },
  { codigo: '15.06', descricao: 'Operações de factoring' },
  { codigo: '15.07', descricao: 'Emissão, reemissão, alteração, cessão, substituição, cancelamento e registro de contratos de crédito; estudo, análise e avaliação de operações de crédito' },
  { codigo: '15.08', descricao: 'Arrendamento mercantil (leasing) de quaisquer bens, inclusive cessão de direitos e obrigações, substituição de garantia, alteração, cancelamento e registro de contrato, e demais serviços relacionados ao arrendamento mercantil (leasing)' },
  { codigo: '15.09', descricao: 'Serviços relacionados a cobranças, recebimentos ou pagamentos em geral, de títulos quaisquer, de contas ou carnês, de câmbio, de tributos e por conta de terceiros, inclusive os efetuados por meio eletrônico, automático ou por máquinas de atendimento' },
  { codigo: '15.10', descricao: 'Serviços relacionados a depósitos bancários, levantamentos, pagamentos, saques, fornecimento de saldo, extrato e demais serviços relacionados à conta corrente' },
  { codigo: '15.11', descricao: 'Fornecimento ou emissão de atestados, certidões e congêneres' },
  { codigo: '15.12', descricao: 'Cadastro, elaboração de ficha cadastral, renovação cadastral e congêneres, inclusão ou exclusão no Cadastro de Proteção ao Crédito (SPC, SERASA e congêneres) e informações e consultas a bancos de dados de qualquer natureza' },
  { codigo: '15.13', descricao: 'Fornecimento de caderneta de cheques, cartões magnéticos ou não, terminais eletrônicos, machine readable e congêneres' },
  { codigo: '15.14', descricao: 'Transmissão, recepção e demais serviços de comunicação' },
  { codigo: '15.15', descricao: 'Custódia em geral, inclusive de títulos e valores mobiliários' },
  { codigo: '15.16', descricao: 'Envio de mensagens eletrônicas' },
  { codigo: '15.17', descricao: 'Agenciamento, corretagem ou intermediação de contratos de arrendamento mercantil (leasing), de franquia (franchising) e de faturização (factoring)' },
  { codigo: '15.18', descricao: 'Demais serviços relacionados à intermediação de negócios e valores mobiliários' },
  { codigo: '16.01', descricao: 'Transporte municipal' },
  { codigo: '17.01', descricao: 'Assessoria ou consultoria de qualquer natureza, não contida em outros itens desta lista, organização, programação, planejamento, assessoria, consultoria, supervisão, fiscalização, coordenação, execução ou estudos, inclusive de viabilidade econômico-financeira, relacionados a quaisquer atividades, negócios, planos, programas ou projetos' },
  { codigo: '17.02', descricao: 'Datilografia, digitação, estenografia, expediente, secretaria em geral, resposta audível, redação, edição, interpretação, revisão, tradução, apoio e infraestrutura administrativa e congêneres' },
  { codigo: '17.03', descricao: 'Planejamento, coordenação, programação ou organização técnica, financeira ou administrativa' },
  { codigo: '17.04', descricao: 'Recrutamento, agenciamento, seleção e colocação de mão de obra' },
  { codigo: '17.05', descricao: 'Fornecimento de mão de obra, mesmo em caráter temporário, inclusive de empregados ou trabalhadores, avulsos ou temporários, contratados pelo prestador de serviço' },
  { codigo: '17.06', descricao: 'Propaganda e publicidade, inclusive promoção de vendas, planejamento de campanhas ou sistemas de publicidade, elaboração de desenhos, textos e demais materiais publicitários' },
  { codigo: '17.07', descricao: 'Franquia (franchising)' },
  { codigo: '17.08', descricao: 'Perícias, laudos, exames técnicos e análises técnicas' },
  { codigo: '17.09', descricao: 'Controle de qualidade' },
  { codigo: '17.10', descricao: 'Controle e tratamento de efluentes de qualquer natureza e de agentes poluentes, inclusive sonoros, visuais, atmosféricos e outros' },
  { codigo: '17.11', descricao: 'Organização de festas e recepções; bufê (exceto o fornecimento de alimentação e bebidas, que fica sujeito ao ICMS)' },
  { codigo: '17.12', descricao: 'Administração em geral, inclusive de bens e negócios de terceiros' },
  { codigo: '17.13', descricao: 'Leilão e congêneres' },
  { codigo: '17.14', descricao: 'Advocacia' },
  { codigo: '17.15', descricao: 'Arbitragem de qualquer espécie, inclusive jurídica' },
  { codigo: '17.16', descricao: 'Auditoria' },
  { codigo: '17.17', descricao: 'Análise de organização e métodos' },
  { codigo: '17.18', descricao: 'Atuária e cálculos técnicos de qualquer natureza' },
  { codigo: '17.19', descricao: 'Contabilidade, inclusive serviços técnicos e auxiliares' },
  { codigo: '17.20', descricao: 'Consultoria e assessoria econômica ou financeira' },
  { codigo: '17.21', descricao: 'Estatística' },
  { codigo: '17.22', descricao: 'Cobrança em geral' },
  { codigo: '17.23', descricao: 'Assessoria, análise, avaliação, atestado, laudo e congêneres' },
  { codigo: '17.24', descricao: 'Domicílio tributário' },
  { codigo: '17.25', descricao: 'Regulação de sinistros vinculados a contratos de seguros; inspeção e avaliação de riscos para cobertura de contratos de seguros, prevenção e gerência de riscos seguráveis e congêneres' },
  { codigo: '18.01', descricao: 'Serviços de regulação de sinistros de seguros, inspeção e avaliação de riscos seguráveis, prevenção e gerência de riscos seguráveis e congêneres' },
  { codigo: '19.01', descricao: 'Serviços de distribuição e venda de bilhetes e demais produtos de loteria, bingos, cartões, pules ou cupons de apostas, sorteios, prêmios, inclusive os decorrentes de títulos de capitalização e congêneres' },
  { codigo: '20.01', descricao: 'Serviços portuários, ferroportuários, utilização de porto, movimentação de passageiros, reboque de embarcações, rebocador escoteiro, atracação, desatracação, serviços de praticagem, capatazia, armazenagem de qualquer natureza, serviços acessórios, movimentação de mercadorias, serviços de apoio marítimo, de movimentação ao largo, serviços de armadores, estiva, conferência, logística e congêneres' },
  { codigo: '20.02', descricao: 'Serviços aeroportuários, utilização de aeroporto, movimentação de passageiros, armazenagem de qualquer natureza, capatazia, movimentação de aeronaves, serviços de apoio aeroportuários, serviços acessórios, movimentação de mercadorias e congêneres' },
  { codigo: '20.03', descricao: 'Serviços de terminais rodoviários, ferroviários, metroviários, movimentação de passageiros, mercadorias, serviços acessórios, movimentação de mercadorias, logística e congêneres' },
  { codigo: '21.01', descricao: 'Registros públicos, cartorários e notariais' },
  { codigo: '22.01', descricao: 'Serviços de exploração de rodovia' },
  { codigo: '23.01', descricao: 'Serviços de programação e comunicação visual, desenho industrial e congêneres' },
  { codigo: '24.01', descricao: 'Serviços de chaveiros, confecção de carimbos, placas, sinalização visual, banners, adesivos e congêneres' },
  { codigo: '25.01', descricao: 'Funerais, inclusive fornecimento de caixão, urna ou esquifes; aluguel de capela; transporte do corpo cadavérico; fornecimento de flores, coroas e outros paramentos; desembaraço de certidão de óbito; fornecimento de véu, essa e outros adornos; embalsamento, embalsamamento, conservação ou restauração de cadáveres' },
  { codigo: '25.02', descricao: 'Translado intramunicipal e cremação de corpos e partes de corpos cadavéricos' },
  { codigo: '25.03', descricao: 'Planos ou convênio funerários' },
  { codigo: '25.04', descricao: 'Manutenção e conservação de jazigos e cemitérios' },
  { codigo: '25.05', descricao: 'Cessão de uso de espaços em cemitérios para sepultamento' },
  { codigo: '26.01', descricao: 'Serviços de coleta, remessa ou entrega de correspondências, documentos, objetos, bens ou valores, inclusive pelos Correios e suas agências franqueadas; courrier e congêneres' },
  { codigo: '27.01', descricao: 'Triggering de qualquer natureza, inclusive medicamentos' },
  { codigo: '28.01', descricao: 'Serviços de access provider, de provimento de acesso à internet, hospedagem de páginas eletrônicas, de informações, de dados e congêneres' },
  { codigo: '29.01', descricao: 'Serviços de instalação, de configuração, de manutenção e de atualização de programas de computação (software), bem como serviços de suporte técnico relacionados a programas de computação' },
  { codigo: '30.01', descricao: 'Serviços técnicos em edificações, relacionados à engenharia de segurança e medicina do trabalho' },
  { codigo: '31.01', descricao: 'Serviços técnicos profissionais especializados em edificações, como serviços técnicos de desenho técnico relacionados à arquitetura e engenharia; serviços técnicos topográficos; serviços técnicos de cálculo estrutural relacionados à engenharia; serviços técnicos de fiscalização relacionados à engenharia; serviços técnicos de perícia relacionados à engenharia ou arquitetura; serviços técnicos de avaliação e vistoria relacionados à engenharia ou arquitetura; serviços técnicos de planejamento relacionados à engenharia ou arquitetura e congêneres' },
  { codigo: '32.01', descricao: 'Serviços de tradução e interpretação' },
  { codigo: '33.01', descricao: 'Serviços de investigação particular, detetives e congêneres' },
  { codigo: '34.01', descricao: 'Serviços de reportagem, assessoria de imprensa, jornalismo e relações públicas' },
  { codigo: '35.01', descricao: 'Serviços de microfilmagem, digitalização de documentos e congêneres' },
  { codigo: '36.01', descricao: 'Serviços de artistas, atletas, modelos e manequins' },
  { codigo: '37.01', descricao: 'Serviços de museologia' },
  { codigo: '38.01', descricao: 'Serviços de ourivesaria e lapidação (quando o material for fornecido pelo tomador do serviço)' },
  { codigo: '39.01', descricao: 'Serviços advocatícios' },
  { codigo: '40.01', descricao: 'Demais serviços não especificados nos demais grupos e não relacionados no §1º do art. 1º' }
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
    console.log('Termo de busca recebido:', termo);
    
    if (!termo || termo.trim() === '') {
      console.log('Termo vazio - retornando array vazio');
      return [];
    }
    
    const termoLower = termo.toLowerCase().trim();
    console.log('Termo processado:', termoLower);
    
    const resultados = codigosNbs.filter(codigo => {
      const codigoMatch = codigo.codigo.toLowerCase().includes(termoLower);
      const descricaoMatch = codigo.descricao.toLowerCase().includes(termoLower);
      const match = codigoMatch || descricaoMatch;
      
      if (match) {
        console.log('Match encontrado:', codigo.codigo, '-', codigo.descricao);
      }
      
      return match;
    });
    
    console.log('Total de resultados encontrados:', resultados.length);
    console.log('Primeiros 3 resultados:', resultados.slice(0, 3));
    
    return resultados;
  };

  const buscarCodigoPorCodigo = (codigo: string): CodigoNbs | undefined => {
    console.log('Buscando código específico:', codigo);
    
    if (!codigo) {
      console.log('Código vazio - retornando undefined');
      return undefined;
    }
    
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
