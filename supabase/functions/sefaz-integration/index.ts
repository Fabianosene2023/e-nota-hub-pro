import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'
import { SefazIntegrationService } from './services/sefazIntegrationService.ts'
import { SefazLogger } from './services/sefazLogger.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { operation, data } = await req.json();
    console.log('SEFAZ Operation:', operation, data);

    const startTime = Date.now();
    let result;

    switch (operation) {
      case 'emitir_nfe':
        result = await SefazIntegrationService.emitirNFE(supabase, data);
        break;
      case 'consultar_nfe':
        result = await SefazIntegrationService.consultarNFE(supabase, data);
        break;
      case 'cancelar_nfe':
        result = await SefazIntegrationService.cancelarNFE(supabase, data);
        break;
      case 'testar_conexao':
        // Simulated test connection with Receita/SEFAZ
        result = {
          success: true,
          mensagem: 'Conexão com SEFAZ simulada com sucesso (ambiente de testes)',
          tempo_resposta: Date.now() - startTime
        };
        break;
      default:
        throw new Error(`Operação não suportada: ${operation}`);
    }

    // Log da operação (exceto para testar_conexao)
    if (operation !== 'testar_conexao') {
      const tempoResposta = Date.now() - startTime;
      await SefazLogger.logOperacaoSefaz(supabase, {
        empresa_id: data.empresa_id,
        nota_fiscal_id: data.nota_fiscal_id || null,
        operacao: operation,
        status_operacao: result.success ? 'sucesso' : 'erro',
        codigo_retorno: result.codigo_retorno,
        mensagem_retorno: result.mensagem_retorno,
        chave_acesso: result.chave_acesso,
        protocolo: result.protocolo,
        tempo_resposta_ms: tempoResposta,
        xml_retorno: result.xml_retorno,
        ip_origem: req.headers.get('x-forwarded-for') || 'unknown',
        user_agent: req.headers.get('user-agent') || 'unknown'
      });
    }

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      }
    );
  } catch (error) {
    console.error('Erro na integração SEFAZ:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
