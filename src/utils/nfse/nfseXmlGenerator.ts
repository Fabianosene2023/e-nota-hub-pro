
export interface DadosNfse {
  prestador: {
    cnpj: string;
    inscricao_municipal: string;
    razao_social: string;
  };
  tomador: {
    cpf_cnpj?: string;
    razao_social: string;
    endereco?: string;
    email?: string;
  };
  servico: {
    codigo_servico: string;
    descricao: string;
    valor_servico: number;
    aliquota_iss: number;
  };
  numero_rps: number;
  serie_rps: string;
  data_emissao: string;
}

export class NfseXmlGenerator {
  static gerarXmlRpsGinfes(dados: DadosNfse): string {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
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

    return xml;
  }

  static gerarXmlConsultaGinfes(numeroNfse: string, cnpjPrestador: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<ConsultarNfseEnvio xmlns="http://www.ginfes.com.br/servico_consultar_nfse_envio_v03.xsd">
  <PrestadorServico>
    <Cnpj>${cnpjPrestador}</Cnpj>
  </PrestadorServico>
  <NumeroNfse>${numeroNfse}</NumeroNfse>
</ConsultarNfseEnvio>`;
  }
}
