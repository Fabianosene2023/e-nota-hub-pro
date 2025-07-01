
export interface DadosPrestador {
  cnpj: string;
  inscricao_municipal: string;
  razao_social: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
}

export interface DadosTomador {
  cpf_cnpj?: string;
  razao_social: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  email?: string;
}

export interface DadosServico {
  codigo_servico: string;
  descricao: string;
  valor_servico: number;
  aliquota_iss: number;
  valor_liquido?: number;
  retencoes?: {
    ir?: number;
    inss?: number;
    csll?: number;
    cofins?: number;
    pis?: number;
  };
}

export interface DadosNfse {
  numero_rps: number;
  serie_rps: string;
  data_emissao: string;
  prestador: DadosPrestador;
  tomador: DadosTomador;
  servico: DadosServico;
}

export class NfseXmlGenerator {
  
  public static gerarXMLRPS(dados: DadosNfse): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<GerarNfseEnvio xmlns="http://www.ginfes.com.br/servico_enviar_lote_rps_envio_v03.xsd">
  <LoteRps Id="lote1">
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
          <Status>1</Status>
          <Servico>
            <Valores>
              <ValorServicos>${dados.servico.valor_servico.toFixed(2)}</ValorServicos>
              <Aliquota>${(dados.servico.aliquota_iss / 100).toFixed(4)}</Aliquota>
              <ValorIss>${(dados.servico.valor_servico * dados.servico.aliquota_iss / 100).toFixed(2)}</ValorIss>
              <ValorLiquidoNfse>${(dados.servico.valor_liquido || dados.servico.valor_servico).toFixed(2)}</ValorLiquidoNfse>
            </Valores>
            <ItemListaServico>${dados.servico.codigo_servico}</ItemListaServico>
            <Discriminacao>${this.escaparXML(dados.servico.descricao)}</Discriminacao>
            <CodigoMunicipio>3550308</CodigoMunicipio>
          </Servico>
          <Prestador>
            <Cnpj>${dados.prestador.cnpj}</Cnpj>
            <InscricaoMunicipal>${dados.prestador.inscricao_municipal}</InscricaoMunicipal>
          </Prestador>
          <Tomador>
            <IdentificacaoTomador>
              <CpfCnpj>
                ${dados.tomador.cpf_cnpj?.length === 11 ? 
                  `<Cpf>${dados.tomador.cpf_cnpj}</Cpf>` : 
                  `<Cnpj>${dados.tomador.cpf_cnpj}</Cnpj>`
                }
              </CpfCnpj>
            </IdentificacaoTomador>
            <RazaoSocial>${this.escaparXML(dados.tomador.razao_social)}</RazaoSocial>
            ${dados.tomador.endereco ? `
            <Endereco>
              <Endereco>${this.escaparXML(dados.tomador.endereco)}</Endereco>
              <Numero>S/N</Numero>
              <Bairro>Centro</Bairro>
              <CodigoMunicipio>3550308</CodigoMunicipio>
              <Uf>${dados.tomador.estado || 'SP'}</Uf>
              <Cep>${dados.tomador.cep?.replace(/\D/g, '') || '01000000'}</Cep>
            </Endereco>
            ` : ''}
            ${dados.tomador.email ? `<Email>${dados.tomador.email}</Email>` : ''}
          </Tomador>
        </InfRps>
      </Rps>
    </ListaRps>
  </LoteRps>
</GerarNfseEnvio>`;
  }

  private static escaparXML(texto: string): string {
    if (!texto) return '';
    return texto
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
