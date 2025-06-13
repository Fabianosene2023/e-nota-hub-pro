
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NFEData {
  empresa_id: string;
  cliente_id: string;
  itens: Array<{
    produto_id: string;
    quantidade: number;
    valor_unitario: number;
  }>;
  natureza_operacao?: string;
  modalidade_frete?: string;
  observacoes?: string;
}

interface SefazResponse {
  success: boolean;
  chave_acesso?: string;
  protocolo?: string;
  xml_retorno?: string;
  codigo_retorno?: string;
  mensagem_retorno?: string;
  error?: string;
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
    let result: SefazResponse;

    switch (operation) {
      case 'emitir_nfe':
        result = await emitirNFE(supabase, data);
        break;
      case 'consultar_nfe':
        result = await consultarNFE(supabase, data);
        break;
      case 'cancelar_nfe':
        result = await cancelarNFE(supabase, data);
        break;
      default:
        throw new Error(`Operação não suportada: ${operation}`);
    }

    // Log da operação
    const tempoResposta = Date.now() - startTime;
    await logOperacaoSefaz(supabase, {
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

async function emitirNFE(supabase: any, data: NFEData): Promise<SefazResponse> {
  try {
    // 1. Buscar configurações da empresa
    const { data: configs } = await supabase
      .from('configuracoes_sefaz')
      .select('*')
      .eq('empresa_id', data.empresa_id)
      .single();

    if (!configs) {
      throw new Error('Configurações SEFAZ não encontradas');
    }

    // 2. Buscar certificado ativo
    const { data: certificado } = await supabase
      .from('certificados_digitais')
      .select('*')
      .eq('empresa_id', data.empresa_id)
      .eq('ativo', true)
      .single();

    if (!certificado) {
      throw new Error('Certificado digital não encontrado');
    }

    // 3. Validar validade do certificado
    const agora = new Date();
    const validadeFim = new Date(certificado.validade_fim);
    if (agora > validadeFim) {
      throw new Error('Certificado digital expirado');
    }

    // 4. Gerar número sequencial
    const numeroNFE = configs.proximo_numero_nfe;
    
    // 5. Gerar XML da NFE (implementação simplificada)
    const xmlNFE = await gerarXMLNFE(supabase, data, configs, numeroNFE);
    
    // 6. Assinar XML com certificado
    const xmlAssinado = await assinarXML(xmlNFE, certificado);
    
    // 7. Enviar para SEFAZ (simulação para ambiente de desenvolvimento)
    const sefazResponse = await enviarParaSefaz(xmlAssinado, configs);
    
    // 8. Atualizar número sequencial
    await supabase
      .from('configuracoes_sefaz')
      .update({ 
        proximo_numero_nfe: numeroNFE + 1,
        updated_at: new Date().toISOString()
      })
      .eq('empresa_id', data.empresa_id);

    return {
      success: true,
      chave_acesso: sefazResponse.chave_acesso,
      protocolo: sefazResponse.protocolo,
      xml_retorno: sefazResponse.xml_retorno,
      codigo_retorno: sefazResponse.codigo_retorno,
      mensagem_retorno: sefazResponse.mensagem_retorno
    };

  } catch (error) {
    console.error('Erro ao emitir NFE:', error);
    return {
      success: false,
      error: error.message,
      codigo_retorno: '999',
      mensagem_retorno: error.message
    };
  }
}

async function consultarNFE(supabase: any, data: { chave_acesso: string; empresa_id: string }): Promise<SefazResponse> {
  try {
    // Simulação de consulta SEFAZ
    console.log('Consultando NFE:', data.chave_acesso);
    
    // Em produção, aqui seria feita a consulta real na SEFAZ
    return {
      success: true,
      chave_acesso: data.chave_acesso,
      codigo_retorno: '100',
      mensagem_retorno: 'Autorizado o uso da NF-e',
      xml_retorno: `<consultaResponse><status>100</status><chave>${data.chave_acesso}</chave></consultaResponse>`
    };

  } catch (error) {
    return {
      success: false,
      error: error.message,
      codigo_retorno: '999',
      mensagem_retorno: error.message
    };
  }
}

async function cancelarNFE(supabase: any, data: { 
  chave_acesso: string; 
  empresa_id: string; 
  justificativa: string;
  nota_fiscal_id: string;
}): Promise<SefazResponse> {
  try {
    if (!data.justificativa || data.justificativa.length < 15) {
      throw new Error('Justificativa deve ter pelo menos 15 caracteres');
    }

    // Simulação de cancelamento SEFAZ
    console.log('Cancelando NFE:', data.chave_acesso, data.justificativa);
    
    // Em produção, aqui seria feito o cancelamento real na SEFAZ
    return {
      success: true,
      chave_acesso: data.chave_acesso,
      codigo_retorno: '135',
      mensagem_retorno: 'Evento registrado e vinculado a NF-e',
      xml_retorno: `<cancelamentoResponse><status>135</status><chave>${data.chave_acesso}</chave></cancelamentoResponse>`
    };

  } catch (error) {
    return {
      success: false,
      error: error.message,
      codigo_retorno: '999',
      mensagem_retorno: error.message
    };
  }
}

async function gerarXMLNFE(supabase: any, data: NFEData, configs: any, numero: number): Promise<string> {
  // Buscar dados da empresa
  const { data: empresa } = await supabase
    .from('empresas')
    .select('*')
    .eq('id', data.empresa_id)
    .single();

  // Buscar dados do cliente
  const { data: cliente } = await supabase
    .from('clientes')
    .select('*')
    .eq('id', data.cliente_id)
    .single();

  // Buscar itens da nota
  const { data: itens } = await supabase
    .from('produtos')
    .select('*')
    .in('id', data.itens.map(item => item.produto_id));

  // Gerar chave de acesso (44 dígitos)
  const agora = new Date();
  const uf = '35'; // SP - seria dinâmico baseado na empresa
  const aamm = agora.getFullYear().toString().substr(2) + (agora.getMonth() + 1).toString().padStart(2, '0');
  const cnpj = empresa.cnpj.replace(/\D/g, '');
  const mod = '55'; // NFE
  const serie = configs.serie_nfe.toString().padStart(3, '0');
  const numeroStr = numero.toString().padStart(9, '0');
  const tpEmis = '1'; // Normal
  const cNF = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
  
  const chaveBase = uf + aamm + cnpj + mod + serie + numeroStr + tpEmis + cNF;
  const dv = calcularDVChaveAcesso(chaveBase);
  const chaveAcesso = chaveBase + dv;

  // XML simplificado (em produção seria muito mais complexo)
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe${chaveAcesso}">
    <ide>
      <cUF>${uf}</cUF>
      <cNF>${cNF}</cNF>
      <natOp>${data.natureza_operacao || 'Venda'}</natOp>
      <mod>${mod}</mod>
      <serie>${configs.serie_nfe}</serie>
      <nNF>${numero}</nNF>
      <dhEmi>${agora.toISOString()}</dhEmi>
      <tpNF>1</tpNF>
      <idDest>1</idDest>
      <cMunFG>${empresa.cidade}</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>${tpEmis}</tpEmis>
      <cDV>${dv}</cDV>
      <tpAmb>${configs.ambiente === 'producao' ? '1' : '2'}</tpAmb>
      <finNFe>1</finNFe>
      <indFinal>1</indFinal>
      <indPres>1</indPres>
    </ide>
    <emit>
      <CNPJ>${empresa.cnpj.replace(/\D/g, '')}</CNPJ>
      <xNome>${empresa.razao_social}</xNome>
      <xFant>${empresa.nome_fantasia || empresa.razao_social}</xFant>
      <enderEmit>
        <xLgr>${empresa.endereco}</xLgr>
        <xMun>${empresa.cidade}</xMun>
        <UF>${empresa.estado}</UF>
        <CEP>${empresa.cep.replace(/\D/g, '')}</CEP>
      </enderEmit>
      <IE>${empresa.inscricao_estadual || ''}</IE>
      <CRT>1</CRT>
    </emit>
    <dest>
      <CNPJ>${cliente.cpf_cnpj.replace(/\D/g, '')}</CNPJ>
      <xNome>${cliente.nome_razao_social}</xNome>
      <enderDest>
        <xLgr>${cliente.endereco}</xLgr>
        <xMun>${cliente.cidade}</xMun>
        <UF>${cliente.estado}</UF>
        <CEP>${cliente.cep.replace(/\D/g, '')}</CEP>
      </enderDest>
    </dest>
  </infNFe>
</NFe>`;

  return xml;
}

async function assinarXML(xml: string, certificado: any): Promise<string> {
  // Em produção, aqui seria feita a assinatura digital real com o certificado
  console.log('Assinando XML com certificado:', certificado.nome_arquivo);
  
  // Por enquanto, retorna o XML sem assinatura (simulação)
  return xml;
}

async function enviarParaSefaz(xmlAssinado: string, configs: any): Promise<any> {
  // Simulação de envio para SEFAZ
  console.log('Enviando para SEFAZ - Ambiente:', configs.ambiente);
  
  // Em produção, aqui seria feita a comunicação real com os webservices da SEFAZ
  const chaveAcesso = '35240812345678000190550010000000011123456789';
  
  return {
    chave_acesso: chaveAcesso,
    protocolo: '135240000000001',
    codigo_retorno: '100',
    mensagem_retorno: 'Autorizado o uso da NF-e',
    xml_retorno: `<retEnviNFe><infRec><nRec>123456789012345</nRec><dhRecbto>2024-01-01T10:00:00-03:00</dhRecbto><tMed>1</tMed></infRec></retEnviNFe>`
  };
}

function calcularDVChaveAcesso(chave: string): string {
  const sequence = '4329876543298765432987654329876543298765432';
  let sum = 0;
  
  for (let i = 0; i < chave.length; i++) {
    sum += parseInt(chave[i]) * parseInt(sequence[i]);
  }
  
  const remainder = sum % 11;
  return remainder < 2 ? '0' : (11 - remainder).toString();
}

async function logOperacaoSefaz(supabase: any, logData: any) {
  try {
    await supabase
      .from('logs_sefaz')
      .insert([logData]);
  } catch (error) {
    console.error('Erro ao salvar log SEFAZ:', error);
  }
}
