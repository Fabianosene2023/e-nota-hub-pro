
export class SefazLogger {
  static async logOperacaoSefaz(supabase: any, logData: any) {
    try {
      await supabase
        .from('logs_sefaz')
        .insert([logData]);
    } catch (error) {
      console.error('Erro ao salvar log SEFAZ:', error);
    }
  }
}
