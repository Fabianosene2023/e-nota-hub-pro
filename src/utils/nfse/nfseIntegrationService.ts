
import { DadosNfse } from './nfseXmlGenerator';

export interface NfseResponse {
  success: boolean;
  numero_nfse?: string;
  codigo_verificacao?: string;
  protocolo?: string;
  data_emissao?: string;
  valor_total?: number;
  xml_nfse?: string;
  pdf_url?: string;
  erro?: string;
}

export class NfseIntegrationService {
  
  /**
   * Emite NFSe via integração
   */
  public static async emitirNFSe(
    dados: DadosNfse,
    urlWebservice: string,
    ambiente: 'homologacao' | 'producao'
  ): Promise<NfseResponse> {
    try {
      const xmlRps = this.gerarXmlRpsGinfes(dados);
      
      // Simular resposta para homologação
      if (ambiente === 'homologacao') {
        return {
          success: true,
          numero_nfse: `${Date.now()}`,
          codigo_verificacao: `${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          protocolo: `PROT${Date.now()}`,
          data_emissao: new Date().toISOString().split('T')[0],
          valor_total: dados.servico.valor_servico,
          xml_nfse: xmlRps
        };
      }

      // Integração real com webservice
      const response = await fetch(urlWebservice, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/soap+xml; charset=utf-8',
          'SOAPAction': 'http://www.ginfes.com.br/servico_enviar_lote_rps_envio'
        },
        body: `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
  <soap:Body>
    ${xmlRps}
  </soap:Body>
</soap:Envelope>`
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const xmlResponse = await response.text();
      
      // Parse simplificado da resposta XML
      const numeroNfseMatch = xmlResponse.match(/<Numero>(\d+)<\/Numero>/);
      const codigoVerificacaoMatch = xmlResponse.match(/<CodigoVerificacao>([^<]+)<\/CodigoVerificacao>/);
      
      if (numeroNfseMatch && codigoVerificacaoMatch) {
        return {
          success: true,
          numero_nfse: numeroNfseMatch[1],
          codigo_verificacao: codigoVerificacaoMatch[1],
          xml_nfse: xmlResponse,
          valor_total: dados.servico.valor_servico
        };
      } else {
        return {
          success: false,
          erro: 'Erro na resposta do webservice'
        };
      }
    } catch (error) {
      console.error('Erro na integração NFSe:', error);
      return {
        success: false,
        erro: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  /**
   * Consulta NFSe emitida
   */
  public static async consultarNFSe(
    numeroNfse: string,
    cnpjPrestador: string,
    urlWebservice: string
  ): Promise<NfseResponse> {
    try {
      console.log(`Consultando NFSe ${numeroNfse} para CNPJ ${cnpjPrestador}`);
      
      // Simular consulta
      return {
        success: true,
        numero_nfse: numeroNfse,
        codigo_verificacao: Math.random().toString(36).substr(2, 9).toUpperCase(),
        protocolo: `PROT${Date.now()}`,
        data_emissao: new Date().toISOString().split('T')[0],
        valor_total: 100.00
      };
    } catch (error) {
      return {
        success: false,
        erro: error instanceof Error ? error.message : 'Erro na consulta'
      };
    }
  }

  private static gerarXmlRpsGinfes(dados: DadosNfse): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<EnviarLoteRpsEnvio xmlns="http://www.ginfes.com.br/servico_enviar_lote_rps_envio_v03.xsd">
  <LoteRps Id="lote1" versao="1.00">
    <NumeroLote>1</NumeroLote>
    <Cnpj>${dados.prestador.cnpj}</Cnpj>
    <InscricaoMunicipal>${dados.prestador.inscricao_municipal}</InscricaoMunicipal>
    <QuantidadeRps>1</QuantidadeRps>
    <ListaRps>
      <Rps>
        <InfRps Id="rps${dados.numero_rps}">
          <IdentificacaoRps>
            <Numero>${dados.numero_rps}</Numero>
            <Serie>${dados.serie_rps}</Serie>
            <Tipo>1</Tipo>
          </IdentificacaoRps>
          <DataEmissao>${dados.data_emissao}</DataEmissao>
          <NaturezaOperacao>1</NaturezaOperacao>
          <RegimeEspecialTributacao>1</RegimeEspecialTributacao>
          <OptanteSimplesNacional>1</OptanteSimplesNacional>
          <IncentivadorCultural>2</IncentivadorCultural>
          <Status>1</Status>
          <Servico>
            <Valores>
              <ValorServicos>${dados.servico.valor_servico.toFixed(2)}</ValorServicos>
              <ValorIss>${(dados.servico.valor_servico * dados.servico.aliquota_iss / 100).toFixed(2)}</ValorIss>
              <Aliquota>${(dados.servico.aliquota_iss / 100).toFixed(4)}</Aliquota>
              <ValorLiquidoNfse>${(dados.servico.valor_servico - (dados.servico.valor_servico * dados.servico.aliquota_iss / 100)).toFixed(2)}</ValorLiquidoNfse>
            </Valores>
            <ItemListaServico>${dados.servico.codigo_servico}</ItemListaServico>
            <Discriminacao>${dados.servico.descricao}</Discriminacao>
            <MunicipioIncidencia>3550308</MunicipioIncidencia>
          </Servico>
          <Prestador>
            <Cnpj>${dados.prestador.cnpj}</Cnpj>
            <InscricaoMunicipal>${dados.prestador.inscricao_municipal}</InscricaoMunicipal>
          </Prestador>
          ${dados.tomador.cpf_cnpj ? `
          <Tomador>
            <IdentificacaoTomador>
              ${dados.tomador.cpf_cnpj.length === 11 ? 
                `<CpfCnpj><Cpf>${dados.tomador.cpf_cnpj}</Cpf></CpfCnpj>` : 
                `<CpfCnpj><Cnpj>${dados.tomador.cpf_cnpj}</Cnpj></CpfCnpj>`
              }
            </IdentificacaoTomador>
            <RazaoSocial>${dados.tomador.razao_social}</RazaoSocial>
            ${dados.tomador.endereco ? `
            <Endereco>
              <Endereco>${dados.tomador.endereco}</Endereco>
              <Numero>S/N</Numero>
              <Bairro>Centro</Bairro>
              <CodigoMunicipio>3550308</CodigoMunicipio>
              <Uf>SP</Uf>
              <Cep>01000000</Cep>
            </Endereco>
            ` : ''}
            ${dados.tomador.email ? `
            <Contato>
              <Email>${dados.tomador.email}</Email>
            </Contato>
            ` : ''}
          </Tomador>
          ` : ''}
        </InfRps>
      </Rps>
    </ListaRps>
  </LoteRps>
</EnviarLoteRpsEnvio>`;
  }
}
