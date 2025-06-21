
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface NaturezaOperacao {
  id: string;
  codigo: string;
  descricao: string;
  cfop_dentro_estado: string;
  cfop_fora_estado: string;
  cfop_exterior: string;
  finalidade: string;
  ativo: boolean;
  empresa_id: string;
  created_at: string;
  updated_at: string;
}

export const useNaturezaOperacao = () => {
  const { profile } = useAuth();
  
  return useQuery({
    queryKey: ['natureza-operacao', profile?.empresa_id],
    queryFn: async () => {
      if (!profile?.empresa_id) {
        throw new Error('Empresa não encontrada');
      }

      // Como não temos uma tabela específica de natureza_operacao, vamos simular com dados das notas fiscais
      const { data: notas, error } = await supabase
        .from('notas_fiscais')
        .select('natureza_operacao')
        .eq('empresa_id', profile.empresa_id);

      if (error) throw error;

      // Extrair naturezas únicas
      const naturezasUnicas = [...new Set(notas?.map(n => n.natureza_operacao).filter(Boolean))];
      
      // Simular dados estruturados
      const naturezaOperacoes = naturezasUnicas.map((natureza, index) => ({
        id: `nat_${index}`,
        codigo: `${5000 + index}`,
        descricao: natureza || 'Operação padrão',
        cfop_dentro_estado: '5102',
        cfop_fora_estado: '6102',
        cfop_exterior: '7102',
        finalidade: 'venda',
        ativo: true,
        empresa_id: profile.empresa_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      return naturezaOperacoes;
    },
    enabled: !!profile?.empresa_id,
  });
};

export const useNaturezaOperacaoStats = () => {
  const { profile } = useAuth();
  
  return useQuery({
    queryKey: ['natureza-operacao-stats', profile?.empresa_id],
    queryFn: async () => {
      if (!profile?.empresa_id) {
        throw new Error('Empresa não encontrada');
      }

      // Buscar dados das notas fiscais para estatísticas
      const { data: notas, error } = await supabase
        .from('notas_fiscais')
        .select('natureza_operacao, created_at')
        .eq('empresa_id', profile.empresa_id);

      if (error) throw error;

      const naturezasUnicas = [...new Set(notas?.map(n => n.natureza_operacao).filter(Boolean))];
      const totalCadastradas = naturezasUnicas.length;

      // Calcular a mais utilizada
      const contadorNaturezas = notas?.reduce((acc: Record<string, number>, nota) => {
        if (nota.natureza_operacao) {
          acc[nota.natureza_operacao] = (acc[nota.natureza_operacao] || 0) + 1;
        }
        return acc;
      }, {}) || {};

      const maisUtilizada = Object.entries(contadorNaturezas).sort(([,a], [,b]) => b - a)[0];
      const maisUtilizadaNome = maisUtilizada ? maisUtilizada[0] : 'Venda';
      const percentualMaisUtilizada = maisUtilizada && notas ? 
        ((maisUtilizada[1] / notas.length) * 100).toFixed(0) : '0';

      // CFOPs vinculados (simulado)
      const cfopsVinculados = totalCadastradas * 3; // 3 CFOPs por natureza (dentro, fora, exterior)

      // Última modificação
      const ultimaModificacao = notas && notas.length > 0 ? 
        Math.max(...notas.map(n => new Date(n.created_at).getTime())) : Date.now();
      
      const diffDias = Math.floor((Date.now() - ultimaModificacao) / (1000 * 60 * 60 * 24));

      return {
        totalCadastradas,
        maisUtilizada: maisUtilizadaNome,
        percentualMaisUtilizada: `${percentualMaisUtilizada}%`,
        cfopsVinculados,
        ultimaModificacao: diffDias === 0 ? 'hoje' : `${diffDias}d`
      };
    },
    enabled: !!profile?.empresa_id,
  });
};
