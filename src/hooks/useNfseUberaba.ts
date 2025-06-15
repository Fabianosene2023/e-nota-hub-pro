
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { UberabaNFSeService, DadosNFSe } from '@/utils/nfse/uberabaNfseService';

export const useEmitirNfseUberaba = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (dadosEmissao: {
      empresa_id: string;
      tomador_nome: string;
      tomador_cpf_cnpj?: string;
      tomador_email?: string;
      tomador_endereco?: string;
      descricao_servico: string;
      valor_servico: number;
      codigo_servico?: string;
      aliquota_iss?: number;
    }) => {
      console.log('Iniciando emissão NFSe Uberaba:', dadosEmissao);
      
      // 1. Buscar dados da empresa
      const { data: empresa, error: empresaError } = await supabase
        .from('empresas')
        .select('*')
        .eq('id', dadosEmissao.empresa_id)
        .single();
        
      if (empresaError || !empresa) {
        throw new Error('Empresa não encontrada');
      }

      // 2. Buscar configurações SEFAZ
      const { data: configs, error: configError } = await supabase
        .from('configuracoes_sefaz')
        .select('*')
        .eq('empresa_id', dadosEmissao.empresa_id)
        .single();
        
      if (configError || !configs) {
        throw new Error('Configurações SEFAZ não encontradas');
      }

      // 3. Gerar número do RPS
      const numeroRps = Date.now(); // Em produção, usar sequencial do banco
      
      // 4. Preparar dados para NFSe
      const dadosNFSe: DadosNFSe = {
        prestador: {
          cnpj: empresa.cnpj.replace(/\D/g, ''),
          inscricao_municipal: empresa.inscricao_municipal || '',
          razao_social: empresa.razao_social
        },
        tomador: {
          cpf_cnpj: dadosEmissao.tomador_cpf_cnpj?.replace(/\D/g, '') || '',
          razao_social: dadosEmissao.tomador_nome,
          endereco: dadosEmissao.tomador_endereco,
          email: dadosEmissao.tomador_email
        },
        servico: {
          codigo_servico: dadosEmissao.codigo_servico || '1.01', // Código padrão
          descricao: dadosEmissao.descricao_servico,
          valor_servico: dadosEmissao.valor_servico,
          aliquota_iss: dadosEmissao.aliquota_iss || 5
        },
        numero_rps: numeroRps,
        serie_rps: 'RPS',
        data_emissao: new Date().toISOString().split('T')[0]
      };

      // 5. Emitir NFSe
      const resultado = await UberabaNFSeService.emitirNFSe(
        dadosNFSe,
        configs.ambiente as 'homologacao' | 'producao'
      );

      if (!resultado.success) {
        throw new Error(resultado.erro || 'Erro na emissão da NFSe');
      }

      // 6. Salvar no banco (opcional - para histórico)
      const { data: nfseRecord, error: saveError } = await supabase
        .from('nfse_emitidas')
        .insert([{
          empresa_id: dadosEmissao.empresa_id,
          numero_nfse: resultado.numero_nfse,
          numero_rps: numeroRps,
          serie_rps: 'RPS',
          tomador_nome: dadosEmissao.tomador_nome,
          tomador_cpf_cnpj: dadosEmissao.tomador_cpf_cnpj,
          descricao_servico: dadosEmissao.descricao_servico,
          valor_servico: dadosEmissao.valor_servico,
          codigo_verificacao: resultado.codigo_verificacao,
          data_emissao: resultado.data_emissao,
          xml_nfse: resultado.xml_nfse,
          protocolo: resultado.protocolo,
          ambiente: configs.ambiente,
          status: 'emitida'
        }])
        .select()
        .single();

      if (saveError) {
        console.warn('Erro ao salvar NFSe no banco:', saveError);
        // Não falhar a operação por erro de salvamento
      }

      return {
        success: true,
        numero_nfse: resultado.numero_nfse,
        codigo_verificacao: resultado.codigo_verificacao,
        valor_total: resultado.valor_total,
        data_emissao: resultado.data_emissao,
        nfse_record: nfseRecord
      };
    },
    onSuccess: (data) => {
      toast({
        title: "NFSe Emitida com Sucesso!",
        description: `Número: ${data.numero_nfse} | Código: ${data.codigo_verificacao}`,
      });
      queryClient.invalidateQueries({ queryKey: ['nfse-emitidas'] });
    },
    onError: (error) => {
      console.error('Erro na emissão NFSe:', error);
      toast({
        title: "Erro na Emissão NFSe",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    },
  });
};

export const useConsultarNfseUberaba = () => {
  return useMutation({
    mutationFn: async (dados: {
      numero_nfse: string;
      empresa_id: string;
    }) => {
      // Buscar dados da empresa para CNPJ
      const { data: empresa } = await supabase
        .from('empresas')
        .select('cnpj')
        .eq('id', dados.empresa_id)
        .single();
        
      if (!empresa) {
        throw new Error('Empresa não encontrada');
      }

      // Buscar ambiente das configurações
      const { data: configs } = await supabase
        .from('configuracoes_sefaz')
        .select('ambiente')
        .eq('empresa_id', dados.empresa_id)
        .single();

      const resultado = await UberabaNFSeService.consultarNFSe(
        dados.numero_nfse,
        empresa.cnpj.replace(/\D/g, ''),
        configs?.ambiente as 'homologacao' | 'producao' || 'homologacao'
      );

      if (!resultado.success) {
        throw new Error(resultado.erro || 'Erro na consulta da NFSe');
      }

      return resultado;
    },
    onSuccess: (data) => {
      toast({
        title: "Consulta Realizada",
        description: `NFSe ${data.numero_nfse} encontrada`,
      });
    },
    onError: (error) => {
      toast({
        title: "Erro na Consulta",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    },
  });
};
