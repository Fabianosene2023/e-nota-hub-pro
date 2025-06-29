
interface UberabaNfseConfig {
  url_webservice: string;
  inscricao_municipal: string;
  cnpj_prestador: string;
  codigo_municipio: string;
  ambiente: 'homologacao' | 'producao';
}

interface RPSData {
  numero_rps: number;
  serie_rps: string;
  prestador: {
    cnpj: string;
    inscricao_municipal: string;
  };
  tomador: {
    nome: string;
    cpf_cnpj?: string;
    endereco?: string;
    email?: string;
  };
  servico: {
    codigo_servico: string;
    discriminacao: string;
    valor_servicos: number;
    aliquota_iss: number;
  };
}

export class UberabaNfseService {
  private config: UberabaNfseConfig;

  constructor(config: UberabaNfseConfig) {
    this.config = config;
  }

  public gerarXmlRps(rpsData: RPSData): string {
    const dataEmissao = new Date().toISOString();
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
               xmlns:nfse="http://www.ginfes.com.br/servico_enviar_lote_rps_envio">
  <soap:Header/>
  <soap:Body>
    <nfse:EnviarLoteRpsEnvio>
      <LoteRps>
        <NumeroLote>${Date.now()}</NumeroLote>
        <Cnpj>${this.config.cnpj_prestador}</Cnpj>
        <InscricaoMunicipal>${this.config.inscricao_municipal}</InscricaoMunicipal>
        <QuantidadeRps>1</QuantidadeRps>
        <ListaRps>
          <Rps>
            <InfRps>
              <IdentificacaoRps>
                <Numero>${rpsData.numero_rps}</Numero>
                <Serie>${rpsData.serie_rps}</Serie>
                <Tipo>1</Tipo>
              </IdentificacaoRps>
              <DataEmissao>${dataEmissao}</DataEmissao>
              <Status>1</Status>
              <Servico>
                <Valores>
                  <ValorServicos>${rpsData.servico.valor_servicos.toFixed(2)}</ValorServicos>
                  <Aliquota>${rpsData.servico.aliquota_iss.toFixed(2)}</Aliquota>
                  <ValorIss>${(rpsData.servico.valor_servicos * rpsData.servico.aliquota_iss / 100).toFixed(2)}</ValorIss>
                  <ValorLiquidoNfse>${rpsData.servico.valor_servicos.toFixed(2)}</ValorLiquidoNfse>
                </Valores>
                <ItemListaServico>${rpsData.servico.codigo_servico}</ItemListaServico>
                <Discriminacao>${rpsData.servico.discriminacao}</Discriminacao>
                <CodigoMunicipio>${this.config.codigo_municipio}</CodigoMunicipio>
              </Servico>
              <Prestador>
                <Cnpj>${rpsData.prestador.cnpj}</Cnpj>
                <InscricaoMunicipal>${rpsData.prestador.inscricao_municipal}</InscricaoMunicipal>
              </Prestador>
              <Tomador>
                <RazaoSocial>${rpsData.tomador.nome}</RazaoSocial>
                ${rpsData.tomador.cpf_cnpj ? `<CpfCnpj>${rpsData.tomador.cpf_cnpj}</CpfCnpj>` : ''}
                ${rpsData.tomador.endereco ? `<Endereco>${rpsData.tomador.endereco}</Endereco>` : ''}
                ${rpsData.tomador.email ? `<Email>${rpsData.tomador.email}</Email>` : ''}
              </Tomador>
            </InfRps>
          </Rps>
        </ListaRps>
      </LoteRps>
    </nfse:EnviarLoteRpsEnvio>
  </soap:Body>
</soap:Envelope>`;
  }

  public async enviarRPS(xmlRps: string): Promise<any> {
    try {
      const response = await fetch(this.config.url_webservice, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/soap+xml; charset=utf-8',
          'SOAPAction': 'http://www.ginfes.com.br/servico_enviar_lote_rps_envio'
        },
        body: xmlRps
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const xmlResponse = await response.text();
      return this.parseXmlResponse(xmlResponse);
    } catch (error) {
      console.error('Erro ao enviar RPS:', error);
      throw error;
    }
  }

  private parseXmlResponse(xmlResponse: string): any {
    // Simular parsing de XML para desenvolvimento
    // Em produção, usar uma biblioteca como xmldom ou xml2js
    console.log('XML Response:', xmlResponse);
    
    return {
      success: true,
      numero_nfse: Math.floor(Math.random() * 1000000).toString(),
      codigo_verificacao: Math.floor(Math.random() * 1000000).toString(),
      protocolo: `PROT-${Date.now()}`,
      data_emissao: new Date().toISOString().split('T')[0],
      xml_nfse: xmlResponse
    };
  }
}
