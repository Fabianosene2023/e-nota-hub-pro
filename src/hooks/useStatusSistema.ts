
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useStatusSistema = () => {
  const { profile } = useAuth();
  
  return useQuery({
    queryKey: ['status-sistema', profile?.empresa_id],
    queryFn: async () => {
      if (!profile?.empresa_id) {
        throw new Error('Empresa não encontrada');
      }

      // Verificar conexão com SEFAZ através dos logs recentes
      const { data: logsSefaz, error: sefazError } = await supabase
        .from('logs_sefaz')
        .select('status_operacao, created_at')
        .eq('empresa_id', profile.empresa_id)
        .order('created_at', { ascending: false })
        .limit(1);

      // Verificar certificado digital
      const { data: certificados, error: certError } = await supabase
        .from('certificados_digitais')
        .select('validade_fim, ativo')
        .eq('empresa_id', profile.empresa_id)
        .eq('ativo', true)
        .order('validade_fim', { ascending: false })
        .limit(1);

      let statusSefaz = 'Offline';
      if (!sefazError && logsSefaz && logsSefaz.length > 0) {
        const ultimoLog = logsSefaz[0];
        const tempoUltimoLog = new Date(ultimoLog.created_at);
        const agora = new Date();
        const diffHoras = (agora.getTime() - tempoUltimoLog.getTime()) / (1000 * 60 * 60);
        
        if (diffHoras < 24 && ultimoLog.status_operacao === 'sucesso') {
          statusSefaz = 'Online';
        }
      }

      let statusCertificado = 'Inválido';
      if (!certError && certificados && certificados.length > 0) {
        const cert = certificados[0];
        const validadeFim = new Date(cert.validade_fim);
        const agora = new Date();
        
        if (validadeFim > agora && cert.ativo) {
          statusCertificado = 'Válido';
        }
      }

      return {
        sefaz: statusSefaz,
        certificado: statusCertificado,
        bancoDados: 'Conectado' // Sempre conectado se conseguir fazer a query
      };
    },
    enabled: !!profile?.empresa_id,
  });
};
