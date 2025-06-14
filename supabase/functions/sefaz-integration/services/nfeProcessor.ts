
import { XMLGenerator } from './xmlGenerator.ts';
import { SefazSimulator } from './sefazSimulator.ts';

export class NFEProcessor {
  static async processNFE(supabase: any, data: any, configs: any, certificado: any) {
    // 1. Gerar número sequencial
    const numeroNFE = configs.proximo_numero_nfe;
    
    // 2. Buscar dados completos
    const dadosCompletos = await this.getDadosCompletos(supabase, data);
    
    // 3. Gerar XML da NFE
    const xmlNFE = await XMLGenerator.gerarXMLNFE(dadosCompletos, configs, numeroNFE);
    
    // 4. Assinar XML com certificado
    const xmlAssinado = await this.assinarXML(xmlNFE, certificado);
    
    // 5. Enviar para SEFAZ (simulação)
    const sefazResponse = await SefazSimulator.enviarParaSefaz(xmlAssinado, configs);
    
    // 6. Atualizar número sequencial
    await this.updateSequentialNumber(supabase, data.empresa_id, numeroNFE);

    return sefazResponse;
  }

  private static async getDadosCompletos(supabase: any, data: any) {
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
      .in('id', data.itens.map((item: any) => item.produto_id));

    return { empresa, cliente, itens: data.itens };
  }

  private static async assinarXML(xml: string, certificado: any): Promise<string> {
    // Em produção, aqui seria feita a assinatura digital real com o certificado
    console.log('Assinando XML com certificado:', certificado.nome_arquivo);
    return xml;
  }

  private static async updateSequentialNumber(supabase: any, empresaId: string, numeroNFE: number) {
    await supabase
      .from('configuracoes_sefaz')
      .update({ 
        proximo_numero_nfe: numeroNFE + 1,
        updated_at: new Date().toISOString()
      })
      .eq('empresa_id', empresaId);
  }
}
