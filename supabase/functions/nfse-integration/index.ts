
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { NfseIntegrationService } from './services/nfseIntegrationService.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { operation, rps_id, prestador_id } = await req.json()

    if (operation === 'emitir_nfse') {
      // Buscar dados do RPS
      const { data: rps, error: rpsError } = await supabase
        .from('rps_nfse')
        .select(`
          *,
          itens_rps_nfse (*)
        `)
        .eq('id', rps_id)
        .single()

      if (rpsError || !rps) {
        throw new Error('RPS não encontrado')
      }

      // Buscar dados do prestador
      const { data: prestador, error: prestadorError } = await supabase
        .from('prestadores_servico')
        .select(`
          *,
          empresas!inner (*)
        `)
        .eq('id', prestador_id)
        .single()

      if (prestadorError || !prestador) {
        throw new Error('Prestador não encontrado')
      }

      // Buscar configuração NFSe
      const { data: config, error: configError } = await supabase
        .from('configuracoes_nfse')
        .select('*')
        .eq('prestador_id', prestador_id)
        .single()

      if (configError || !config) {
        throw new Error('Configuração NFSe não encontrada')
      }

      // Preparar dados para NFSe
      const dadosNfse = {
        prestador: {
          cnpj: prestador.cnpj.replace(/\D/g, ''),
          inscricao_municipal: prestador.inscricao_municipal || '',
          razao_social: prestador.empresas.razao_social
        },
        tomador: {
          cpf_cnpj: rps.tomador_cnpj_cpf?.replace(/\D/g, ''),
          razao_social: rps.tomador_nome,
          endereco: rps.tomador_endereco,
          email: rps.tomador_email
        },
        servico: {
          codigo_servico: rps.codigo_servico || '1.01',
          descricao: rps.discriminacao,
          valor_servico: Number(rps.valor_servicos),
          aliquota_iss: Number(rps.aliquota_iss)
        },
        numero_rps: rps.numero_rps,
        serie_rps: rps.serie_rps,
        data_emissao: new Date(rps.data_emissao).toISOString().split('T')[0]
      }

      // Emitir NFSe
      const resultado = await NfseIntegrationService.emitirNfseGinfes(
        dadosNfse,
        config.url_webservice,
        config.ambiente as 'homologacao' | 'producao'
      )

      // Atualizar RPS com resultado
      const statusRps = resultado.success ? 'emitida' : 'erro'
      await supabase
        .from('rps_nfse')
        .update({
          status: statusRps,
          numero_nfse: resultado.numero_nfse,
          codigo_verificacao: resultado.codigo_verificacao,
          protocolo: resultado.protocolo,
          xml_nfse: resultado.xml_nfse,
          data_processamento: new Date().toISOString(),
          mensagem_retorno: resultado.erro || 'Processado com sucesso'
        })
        .eq('id', rps_id)

      return new Response(JSON.stringify(resultado), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    return new Response(JSON.stringify({ error: 'Operação não suportada' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })

  } catch (error) {
    console.error('Erro na integração NFSe:', error)
    return new Response(JSON.stringify({ 
      error: error.message || 'Erro interno do servidor' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
