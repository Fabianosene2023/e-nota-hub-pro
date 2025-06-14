
/**
 * SEFAZ Configuration and Constants
 */
export const SEFAZ_CONFIG = {
  TIMEOUT_PADRAO: 30000,
  CODIGO_RETORNO_SUCESSO: ['100', '135', '150'],
  ENDPOINTS_HOMOLOGACAO: {
    'AC': 'https://hom.sefaznet.ac.gov.br/nfeweb/services/NfeAutorizacao4',
    'AL': 'https://hom.nfe.sefaz.al.gov.br/ws/NfeAutorizacao4.asmx',
    'AP': 'https://hom.sefaznet.ap.gov.br/nfeweb/services/NfeAutorizacao4',
    'AM': 'https://homnfe.sefaz.am.gov.br/services2/services/NfeAutorizacao4',
    'BA': 'https://hnfe.sefaz.ba.gov.br/webservices/NfeAutorizacao4/NfeAutorizacao4.asmx',
    'CE': 'https://nfeh.sefaz.ce.gov.br/nfe4/services/NFeAutorizacao4',
    'DF': 'https://dec.fazenda.df.gov.br/NFEWEB/services/NfeAutorizacao4',
    'ES': 'https://hom-nfe.sefaz.es.gov.br/services/NfeAutorizacao4',
    'GO': 'https://hom-nfe.sefaz.go.gov.br/nfe/services/NFeAutorizacao4',
    'MA': 'https://hom.nfe.sefaz.ma.gov.br/wsnfe/services/NfeAutorizacao4',
    'MT': 'https://hom-nfe.sefaz.mt.gov.br/nfews/v2/services/NfeAutorizacao4',
    'MS': 'https://hom-nfe.sefaz.ms.gov.br/ws/NfeAutorizacao4.asmx',
    'MG': 'https://hnfe.fazenda.mg.gov.br/nfe2/services/NFeAutorizacao4',
    'PA': 'https://appnf.sefa.pa.gov.br/services-hom/NfeAutorizacao4',
    'PB': 'https://nfe.sefaz.pb.gov.br/nfe/services/NfeAutorizacao4',
    'PR': 'https://homologacao.nfe.sefa.pr.gov.br/nfe/NFeAutorizacao4',
    'PE': 'https://nfehomolog.sefaz.pe.gov.br/nfe-service/services/NfeAutorizacao4',
    'PI': 'https://hom.nfe.sefaz.pi.gov.br/nfe/services/NfeAutorizacao4',
    'RJ': 'https://nfe.fazenda.rj.gov.br/service/NfeAutorizacao4.asmx',
    'RN': 'https://hom.nfe.set.rn.gov.br/nfe4/services/NFeAutorizacao4',
    'RS': 'https://nfe-homologacao.sefazrs.rs.gov.br/ws/NfeAutorizacao/NfeAutorizacao4.asmx',
    'RO': 'https://hom.nfe.sefin.ro.gov.br/ws/NfeAutorizacao4.asmx',
    'RR': 'https://hom.nfe.sefaz.rr.gov.br/nfe4/services/NFeAutorizacao4',
    'SC': 'https://hom.nfe.fazenda.sc.gov.br/ws/recepcaoevento/recepcaoevento4.asmx',
    'SP': 'https://homologacao.nfe.fazenda.sp.gov.br/ws/nfeautorizacao4.asmx',
    'SE': 'https://hom.nfe.sefaz.se.gov.br/nfe/services/NfeAutorizacao4',
    'TO': 'https://hom.nfe.sefaz.to.gov.br/Arquivos/sped/schemes/NFe/v4_00/wsdl/NFeAutorizacao4/NFeAutorizacao4.asmx'
  },
  ENDPOINTS_PRODUCAO: {
    'AC': 'https://sefaznet.ac.gov.br/nfeweb/services/NfeAutorizacao4',
    'AL': 'https://www.sefaz.al.gov.br/ws/NfeAutorizacao4.asmx',
    'AP': 'https://sefaznet.ap.gov.br/nfeweb/services/NfeAutorizacao4',
    'AM': 'https://nfe.sefaz.am.gov.br/services2/services/NfeAutorizacao4',
    'BA': 'https://nfe.sefaz.ba.gov.br/webservices/NfeAutorizacao4/NfeAutorizacao4.asmx',
    'CE': 'https://nfe.sefaz.ce.gov.br/nfe4/services/NFeAutorizacao4',
    'DF': 'https://dec.fazenda.df.gov.br/NFEWEB/services/NfeAutorizacao4',
    'ES': 'https://nfe.sefaz.es.gov.br/services/NfeAutorizacao4',
    'GO': 'https://nfe.sefaz.go.gov.br/nfe/services/NFeAutorizacao4',
    'MA': 'https://www.nfe.sefaz.ma.gov.br/wsnfe/services/NfeAutorizacao4',
    'MT': 'https://nfe.sefaz.mt.gov.br/nfews/v2/services/NfeAutorizacao4',
    'MS': 'https://nfe.sefaz.ms.gov.br/ws/NfeAutorizacao4.asmx',
    'MG': 'https://nfe.fazenda.mg.gov.br/nfe2/services/NFeAutorizacao4',
    'PA': 'https://appnf.sefa.pa.gov.br/services/NfeAutorizacao4',
    'PB': 'https://nfe.sefaz.pb.gov.br/nfe/services/NfeAutorizacao4',
    'PR': 'https://nfe.sefa.pr.gov.br/nfe/NFeAutorizacao4',
    'PE': 'https://nfe.sefaz.pe.gov.br/nfe-service/services/NfeAutorizacao4',
    'PI': 'https://nfe.sefaz.pi.gov.br/nfe/services/NfeAutorizacao4',
    'RJ': 'https://nfe.fazenda.rj.gov.br/service/NfeAutorizacao4.asmx',
    'RN': 'https://nfe.set.rn.gov.br/nfe4/services/NFeAutorizacao4',
    'RS': 'https://nfe.sefazrs.rs.gov.br/ws/NfeAutorizacao/NfeAutorizacao4.asmx',
    'RO': 'https://nfe.sefin.ro.gov.br/ws/NfeAutorizacao4.asmx',
    'RR': 'https://nfe.sefaz.rr.gov.br/nfe4/services/NFeAutorizacao4',
    'SC': 'https://nfe.fazenda.sc.gov.br/ws/recepcaoevento/recepcaoevento4.asmx',
    'SP': 'https://nfe.fazenda.sp.gov.br/ws/nfeautorizacao4.asmx',
    'SE': 'https://nfe.sefaz.se.gov.br/nfe/services/NfeAutorizacao4',
    'TO': 'https://nfe.sefaz.to.gov.br/Arquivos/sped/schemes/NFe/v4_00/wsdl/NFeAutorizacao4/NFeAutorizacao4.asmx'
  }
} as const;

export const ERROS_SEFAZ = {
  '101': 'Cancelamento de NFe fora de prazo',
  '135': 'Evento registrado e vinculado à NFe',
  '206': 'NFe já está inutilizada na Base de dados da SEFAZ',
  '539': 'Rejeição: CNPJ do emitente inválido',
  '540': 'Rejeição: CPF do emitente inválido',
  '999': 'Erro interno do sistema SEFAZ'
} as const;
