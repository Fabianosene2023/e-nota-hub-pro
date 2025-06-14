
export class SefazValidator {
  static async validateConfigurations(supabase: any, empresaId: string) {
    const { data: configs } = await supabase
      .from('configuracoes_sefaz')
      .select('*')
      .eq('empresa_id', empresaId)
      .single();

    if (!configs) {
      throw new Error('Configurações SEFAZ não encontradas');
    }

    return configs;
  }

  static async validateCertificate(supabase: any, empresaId: string) {
    const { data: certificado } = await supabase
      .from('certificados_digitais')
      .select('*')
      .eq('empresa_id', empresaId)
      .eq('ativo', true)
      .single();

    if (!certificado) {
      throw new Error('Certificado digital não encontrado');
    }

    // Validar validade do certificado
    const agora = new Date();
    const validadeFim = new Date(certificado.validade_fim);
    if (agora > validadeFim) {
      throw new Error('Certificado digital expirado');
    }

    return certificado;
  }
}
