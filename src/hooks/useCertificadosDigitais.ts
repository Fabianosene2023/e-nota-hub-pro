
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import CryptoJS from 'crypto-js';

interface CertificadoDigital {
  id: string;
  empresa_id: string;
  nome_arquivo: string;
  conteudo_criptografado: string;
  senha_hash: string;
  validade_inicio: string;
  validade_fim: string;
  tipo_certificado: 'A1' | 'A3';
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export const useCertificadosDigitais = (empresaId: string) => {
  return useQuery({
    queryKey: ['certificados-digitais', empresaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('certificados_digitais')
        .select('*')
        .eq('empresa_id', empresaId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as CertificadoDigital[];
    },
    enabled: !!empresaId,
  });
};

export const useUploadCertificado = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (certificadoData: {
      empresa_id: string;
      arquivo: File;
      senha: string;
      validade_inicio: string;
      validade_fim: string;
      tipo_certificado: 'A1' | 'A3';
    }) => {
      // Ler arquivo como ArrayBuffer
      const arrayBuffer = await certificadoData.arquivo.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      
      // Converter para base64
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64 = btoa(binary);
      
      // Criptografar conteúdo do certificado
      const chaveEncriptacao = CryptoJS.lib.WordArray.random(256/8).toString();
      const conteudoCriptografado = CryptoJS.AES.encrypt(base64, chaveEncriptacao).toString();
      
      // Hash da senha
      const senhaHash = CryptoJS.SHA256(certificadoData.senha).toString();
      
      // Desativar certificado anterior se existir
      await supabase
        .from('certificados_digitais')
        .update({ ativo: false })
        .eq('empresa_id', certificadoData.empresa_id)
        .eq('ativo', true);
      
      // Inserir novo certificado
      const { data, error } = await supabase
        .from('certificados_digitais')
        .insert([{
          empresa_id: certificadoData.empresa_id,
          nome_arquivo: certificadoData.arquivo.name,
          conteudo_criptografado: conteudoCriptografado,
          senha_hash: senhaHash,
          validade_inicio: certificadoData.validade_inicio,
          validade_fim: certificadoData.validade_fim,
          tipo_certificado: certificadoData.tipo_certificado,
          ativo: true
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      // Armazenar chave de criptografia de forma segura (em produção usar Supabase Vault)
      localStorage.setItem(`cert_key_${data.id}`, chaveEncriptacao);
      
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['certificados-digitais', variables.empresa_id] });
      toast({
        title: "Sucesso!",
        description: "Certificado digital carregado com sucesso",
      });
    },
    onError: (error) => {
      console.error('Erro ao fazer upload do certificado:', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer upload do certificado",
        variant: "destructive",
      });
    },
  });
};

export const useValidarCertificado = () => {
  return useMutation({
    mutationFn: async (certificadoData: {
      arquivo: File;
      senha: string;
    }): Promise<{
      valido: boolean;
      validade_inicio?: string;
      validade_fim?: string;
      proprietario?: string;
      erro?: string;
    }> => {
      try {
        // Em produção, aqui seria feita a validação real do certificado
        // Por enquanto, simulação básica
        
        const arrayBuffer = await certificadoData.arquivo.arrayBuffer();
        
        // Verificar se é um arquivo .p12 ou .pfx
        if (!certificadoData.arquivo.name.match(/\.(p12|pfx)$/i)) {
          throw new Error('Arquivo deve ser .p12 ou .pfx');
        }
        
        // Verificar tamanho mínimo
        if (arrayBuffer.byteLength < 1000) {
          throw new Error('Arquivo de certificado muito pequeno');
        }
        
        // Simulação de validação - em produção usar biblioteca específica
        const agora = new Date();
        const validadeInicio = new Date(agora.getTime() - 365 * 24 * 60 * 60 * 1000);
        const validadeFim = new Date(agora.getTime() + 365 * 24 * 60 * 60 * 1000);
        
        return {
          valido: true,
          validade_inicio: validadeInicio.toISOString(),
          validade_fim: validadeFim.toISOString(),
          proprietario: 'Certificado Simulado'
        };
        
      } catch (error) {
        return {
          valido: false,
          erro: error instanceof Error ? error.message : 'Erro desconhecido'
        };
      }
    },
  });
};
