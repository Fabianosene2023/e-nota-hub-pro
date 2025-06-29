
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NFSeRequest {
  action: string;
  empresa_id: string;
  tomador_nome: string;
  tomador_cpf_cnpj?: string;
  tomador_email?: string;
  tomador_endereco?: string;
  descricao_servico: string;
  valor_servico: number;
  codigo_servico: string;
  aliquota_iss: number;
  municipio?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, ...requestData } = await req.json() as NFSeRequest;

    if (action === 'emitir_nfse') {
      // Buscar próximo número RPS
      const { data: configData } = await supabaseClient
        .from('configuracoes_nfse')
        .select('proximo_numero_rps, serie_rps')
        .limit(1)
        .single();

      const numeroRps = configData?.proximo_numero_rps || 1;
      const serieRps = configData?.serie_rps || 'RPS';

      // Gerar XML RPS (simulado para desenvolvimento)
      const xmlRps = gerarXmlRPS({
        numero_rps: numeroRps,
        serie_rps: serieRps,
        prestador: {
          cnpj: '12345678000100', // Buscar do prestador
          inscricao_municipal: '123456'
        },
        tomador: {
          nome: requestData.tomador_nome,
          cpf_cnpj: requestData.tomador_cpf_cnpj,
          endereco: requestData.tomador_endereco,
          email: requestData.tomador_email
        },
        servico: {
          codigo_servico: requestData.codigo_servico,
          discriminacao: requestData.descricao_servico,
          valor_servicos: requestData.valor_servico,
          aliquota_iss: requestData.aliquota_iss
        }
      });

      // Simular envio para SEFAZ (em produção, usar integração real)
      const nfseResponse = await simularEnvioNFSe(xmlRps);

      // Salvar na tabela nfse_emitidas
      const { data: nfseData, error } = await supabaseClient
        .from('nfse_emitidas')
        .insert({
          empresa_id: requestData.empresa_id,
          numero_rps: numeroRps,
          serie_rps: serieRps,
          numero_nfse: nfseResponse.numero_nfse,
          codigo_verificacao: nfseResponse.codigo_verificacao,
          protocolo: nfseResponse.protocolo,
          status: 'emitida',
          data_emissao: new Date().toISOString().split('T')[0],
          tomador_nome: requestData.tomador_nome,
          tomador_cpf_cnpj: requestData.tomador_cpf_cnpj,
          valor_servico: requestData.valor_servico,
          descricao_servico: requestData.descricao_servico,
          xml_nfse: nfseResponse.xml_nfse,
          ambiente: 'homologacao'
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao salvar NFSe: ${error.message}`);
      }

      // Atualizar próximo número RPS
      await supabaseClient
        .from('configuracoes_nfse')
        .update({ proximo_numero_rps: numeroRps + 1 })
        .eq('id', configData?.id);

      return new Response(
        JSON.stringify({
          success: true,
          id: nfseData.id,
          numero_rps: numeroRps.toString(),
          numero_nfse: nfseResponse.numero_nfse,
          codigo_verificacao: nfseResponse.codigo_verificacao,
          protocolo: nfseResponse.protocolo,
          status: 'emitida',
          data_emissao: nfseData.data_emissao,
          valor_total: requestData.valor_servico,
          xml_nfse: nfseResponse.xml_nfse
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Ação não suportada' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );

  } catch (error) {
    console.error('Erro na função NFSe:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Erro interno do servidor' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

function gerarXmlRPS(data: any): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
  <soap:Header/>
  <soap:Body>
    <EnviarLoteRpsEnvio>
      <LoteRps>
        <NumeroLote>${Date.now()}</NumeroLote>
        <Cnpj>${data.prestador.cnpj}</Cnpj>
        <InscricaoMunicipal>${data.prestador.inscricao_municipal}</InscricaoMunicipal>
        <QuantidadeRps>1</QuantidadeRps>
        <ListaRps>
          <Rps>
            <InfRps>
              <IdentificacaoRps>
                <Numero>${data.numero_rps}</Numero>
                <Serie>${data.serie_rps}</Serie>
                <Tipo>1</Tipo>
              </IdentificacaoRps>
              <DataEmissao>${new Date().toISOString()}</DataEmissao>
              <Status>1</Status>
              <Servico>
                <Valores>
                  <ValorServicos>${data.servico.valor_servicos.toFixed(2)}</ValorServicos>
                  <Aliquota>${data.servico.aliquota_iss.toFixed(2)}</Aliquota>
                </Valores>
                <ItemListaServico>${data.servico.codigo_servico}</ItemListaServico>
                <Discriminacao>${data.servico.discriminacao}</Discriminacao>
              </Servico>
            </InfRps>
          </Rps>
        </ListaRps>
      </LoteRps>
    </EnviarLoteRpsEnvio>
  </soap:Body>
</soap:Envelope>`;
}

async function simularEnvioNFSe(xmlRps: string): Promise<any> {
  // Simular resposta da SEFAZ para desenvolvimento
  const numeroNfse = Math.floor(Math.random() * 1000000).toString();
  
  return {
    success: true,
    numero_nfse: numeroNfse,
    codigo_verificacao: Math.floor(Math.random() * 1000000).toString(),
    protocolo: `PROT-${Date.now()}`,
    data_emissao: new Date().toISOString().split('T')[0],
    xml_nfse: `<NFSe><Numero>${numeroNfse}</Numero></NFSe>`
  };
}
