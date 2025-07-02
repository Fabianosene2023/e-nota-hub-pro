
/**
 * SEFAZ Configuration Constants
 */
export const SEFAZ_CONFIG = {
  TIMEOUT_PADRAO: 30000, // 30 segundos
  
  ENDPOINTS_HOMOLOGACAO: {
    'SP': 'https://homologacao.nfe.fazenda.sp.gov.br/ws/nfeautorizacao4.asmx',
    'RJ': 'https://nfe.fazenda.rj.gov.br/service/NfeAutorizacao4.asmx',
    'MG': 'https://hnfe.fazenda.mg.gov.br/nfe2/services/NFeAutorizacao4',
    'RS': 'https://nfe-homologacao.sefazrs.rs.gov.br/ws/NfeAutorizacao/NfeAutorizacao4.asmx',
    'PR': 'https://homologacao.nfe.sefa.pr.gov.br/nfe/NFeAutorizacao4',
    'SC': 'https://homologacao.nfe.sef.sc.gov.br/ws/nfeautorizacao/nfeautorizacao4.asmx',
    'BA': 'https://hnfe.sefaz.ba.gov.br/webservices/NFeAutorizacao4/NFeAutorizacao4.asmx',
    'GO': 'https://homolog.sefaz.go.gov.br/nfe/services/NFeAutorizacao4',
    'MT': 'https://homologacao.sefaz.mt.gov.br/nfews/v2/services/NfeAutorizacao4',
    'MS': 'https://homologacao.nfe.ms.gov.br/ws/NFeAutorizacao4',
    'PE': 'https://nfehomolog.sefaz.pe.gov.br/nfe-service/services/NFeAutorizacao4',
    'AM': 'https://homnfe.sefaz.am.gov.br/services2/services/NfeAutorizacao4',
    'CE': 'https://nfeh.sefaz.ce.gov.br/nfe2/services/NFeAutorizacao4',
    'DF': 'https://dec.fazenda.df.gov.br/nfe2/services/NFeAutorizacao4',
    'ES': 'https://homologacao.nfe.sefaz.es.gov.br/nfe2/services/NFeAutorizacao4'
  },
  
  ENDPOINTS_PRODUCAO: {
    'SP': 'https://nfe.fazenda.sp.gov.br/ws/nfeautorizacao4.asmx',
    'RJ': 'https://nfe.fazenda.rj.gov.br/service/NfeAutorizacao4.asmx',
    'MG': 'https://nfe.fazenda.mg.gov.br/nfe2/services/NFeAutorizacao4',
    'RS': 'https://nfe.sefazrs.rs.gov.br/ws/NfeAutorizacao/NfeAutorizacao4.asmx',
    'PR': 'https://nfe.sefa.pr.gov.br/nfe/NFeAutorizacao4',
    'SC': 'https://nfe.sef.sc.gov.br/ws/nfeautorizacao/nfeautorizacao4.asmx',
    'BA': 'https://nfe.sefaz.ba.gov.br/webservices/NFeAutorizacao4/NFeAutorizacao4.asmx',
    'GO': 'https://nfe.sefaz.go.gov.br/nfe/services/NFeAutorizacao4',
    'MT': 'https://nfe.sefaz.mt.gov.br/nfews/v2/services/NfeAutorizacao4',
    'MS': 'https://nfe.fazenda.ms.gov.br/ws/NFeAutorizacao4',
    'PE': 'https://nfe.sefaz.pe.gov.br/nfe-service/services/NFeAutorizacao4',
    'AM': 'https://nfe.sefaz.am.gov.br/services2/services/NfeAutorizacao4',
    'CE': 'https://nfe.sefaz.ce.gov.br/nfe2/services/NFeAutorizacao4',
    'DF': 'https://dec.fazenda.df.gov.br/nfe2/services/NFeAutorizacao4',
    'ES': 'https://nfe.sefaz.es.gov.br/nfe2/services/NFeAutorizacao4'
  },
  
  CODIGOS_STATUS: {
    '100': 'Autorizado o uso da NF-e',
    '101': 'Cancelamento de NF-e homologado',
    '102': 'Inutilização de número homologado',
    '103': 'Lote recebido com sucesso',
    '104': 'Lote processado',
    '105': 'Lote em processamento',
    '106': 'Lote não localizado',
    '107': 'Serviço em operação',
    '108': 'Serviço paralisado momentaneamente',
    '109': 'Serviço paralisado sem previsão',
    '110': 'Uso denegado',
    '135': 'Evento registrado e vinculado a NF-e',
    '136': 'Evento registrado, mas não vinculado a NF-e',
    '155': 'Cancelamento homologado fora de prazo',
    '999': 'Erro interno do sistema'
  }
};
