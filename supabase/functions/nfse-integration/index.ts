
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NFSeRequest {
  operation: string;
  prestador_id?: string;
  rps_id?: string;
  data?: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { operation, prestador_id, rps_id, data }: NFSeRequest = await req.json();

    console.log('NFSe Integration - Operation:', operation);

    switch (operation) {
      case 'emitir_nfse':
        return await emitirNFSe(supabase, rps_id!, prestador_id!);
      
      case 'consultar_nfse':
        return await consultarNFSe(supabase, data.numero_nfse);
      
      default:
        throw new Error(`Operação não suportada: ${operation}`);
    }

  } catch (error) {
    console.error('Erro na integração NFSe:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Erro interno do servidor' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function emitirNFSe(supabase: any, rpsId: string, prestadorId: string) {
  // Buscar dados do RPS
  const { data: rps, error: rpsError } = await supabase
    .from('rps_nfse')
    .select(`
      *,
      itens_rps_nfse (*)
    `)
    .eq('id', rpsId)
    .single();

  if (rpsError) throw new Error(`Erro ao buscar RPS: ${rpsError.message}`);

  // Buscar dados do prestador
  const { data: prestador, error: prestadorError } = await supabase
    .from('empresas')
    .select('*')
    .eq('id', prestadorId)
    .single();

  if (prestadorError) throw new Error(`Erro ao buscar prestador: ${prestadorError.message}`);

  // Gerar XML do RPS (simulado - em produção usar biblioteca específica)
  const xmlRps = gerarXmlRps(rps, prestador);
  console.log('XML RPS gerado:', xmlRps);

  // Simular envio para SEFAZ (em produção, fazer requisição SOAP real)
  const numeroNfse = `NFSe-${Date.now()}`;
  const codigoVerificacao = Math.random().toString(36).substring(2, 15);
  const protocolo = `PROT-${Date.now()}`;

  // Atualizar RPS com dados da NFSe
  const { error: updateError } = await supabase
    .from('rps_nfse')
    .update({
      status: 'processado',
      numero_nfse: numeroNfse,
      codigo_verificacao: codigoVerificacao,
      protocolo,
      xml_rps: xmlRps,
      data_processamento: new Date().toISOString()
    })
    .eq('id', rpsId);

  if (updateError) throw new Error(`Erro ao atualizar RPS: ${updateError.message}`);

  return new Response(
    JSON.stringify({
      success: true,
      numero_nfse: numeroNfse,
      codigo_verificacao: codigoVerificacao,
      protocolo,
      valor_total: rps.valor_servicos,
      data_emissao: rps.data_emissao
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function consultarNFSe(supabase: any, numeroNfse: string) {
  const { data: nfse, error } = await supabase
    .from('rps_nfse')
    .select('*')
    .eq('numero_nfse', numeroNfse)
    .single();

  if (error) throw new Error(`NFSe não encontrada: ${error.message}`);

  return new Response(
    JSON.stringify({
      success: true,
      nfse
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

function gerarXmlRps(rps: any, prestador: any): string {
  const dataEmissao = new Date(rps.data_emissao).toISOString();
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
  <soap:Body>
    <EnviarLoteRpsEnvio>
      <LoteRps>
        <NumeroLote>${rps.numero_rps}</NumeroLote>
        <Cnpj>${prestador.cnpj}</Cnpj>
        <InscricaoMunicipal>${prestador.inscricao_municipal}</InscricaoMunicipal>
        <QuantidadeRps>1</QuantidadeRps>
        <ListaRps>
          <Rps>
            <InfRps>
              <IdentificacaoRps>
                <Numero>${rps.numero_rps}</Numero>
                <Serie>${rps.serie_rps}</Serie>
                <Tipo>1</Tipo>
              </IdentificacaoRps>
              <DataEmissao>${dataEmissao}</DataEmissao>
              <Status>1</Status>
              <Servico>
                <Valores>
                  <ValorServicos>${rps.valor_servicos.toFixed(2)}</ValorServicos>
                  <Aliquota>${rps.aliquota_iss.toFixed(2)}</Aliquota>
                  <ValorIss>${rps.valor_iss.toFixed(2)}</ValorIss>
                  <ValorLiquidoNfse>${rps.valor_liquido.toFixed(2)}</ValorLiquidoNfse>
                </Valores>
                <Discriminacao>${rps.discriminacao}</Discriminacao>
              </Servico>
              <Prestador>
                <Cnpj>${prestador.cnpj}</Cnpj>
                <InscricaoMunicipal>${prestador.inscricao_municipal}</InscricaoMunicipal>
              </Prestador>
              <Tomador>
                <RazaoSocial>${rps.tomador_nome}</RazaoSocial>
                ${rps.tomador_cnpj_cpf ? `<CpfCnpj>${rps.tomador_cnpj_cpf}</CpfCnpj>` : ''}
                ${rps.tomador_endereco ? `<Endereco>${rps.tomador_endereco}</Endereco>` : ''}
                ${rps.tomador_email ? `<Email>${rps.tomador_email}</Email>` : ''}
              </Tomador>
            </InfRps>
          </Rps>
        </ListaRps>
      </LoteRps>
    </EnviarLoteRpsEnvio>
  </soap:Body>
</soap:Envelope>`;
}
