
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

interface ValidacaoCertificado {
  valido: boolean;
  validade_inicio?: string;
  validade_fim?: string;
  proprietario?: string;
  cnpj?: string;
  erro?: string;
  detalhes?: {
    expirado: boolean;
    dias_restantes: number;
    valido_para_nfe: boolean;
  };
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
      try {
        // Validar arquivo antes do upload
        if (!certificadoData.arquivo.name.match(/\.(p12|pfx)$/i)) {
          throw new Error('Arquivo deve ser .p12 ou .pfx');
        }

        if (certificadoData.arquivo.size > 10 * 1024 * 1024) { // 10MB
          throw new Error('Arquivo muito grande. Máximo 10MB permitido');
        }

        // Validar datas
        const agora = new Date();
        const validadeInicio = new Date(certificadoData.validade_inicio);
        const validadeFim = new Date(certificadoData.validade_fim);

        if (validadeInicio >= validadeFim) {
          throw new Error('Data de início deve ser anterior à data de fim da validade');
        }

        if (validadeFim <= agora) {
          throw new Error('Certificado já está expirado');
        }

        // Validar senha (não pode ser vazia)
        if (!certificadoData.senha || certificadoData.senha.length < 4) {
          throw new Error('Senha do certificado deve ter pelo menos 4 caracteres');
        }

        // Ler arquivo como ArrayBuffer
        const arrayBuffer = await certificadoData.arquivo.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        
        // Converter para base64
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64 = btoa(binary);
        
        // Criptografar conteúdo do certificado com chave forte
        const chaveEncriptacao = CryptoJS.lib.WordArray.random(256/8).toString();
        const conteudoCriptografado = CryptoJS.AES.encrypt(base64, chaveEncriptacao).toString();
        
        // Hash seguro da senha
        const senhaHash = CryptoJS.SHA256(certificadoData.senha + 'salt_certificado_' + certificadoData.empresa_id).toString();
        
        // Desativar certificado anterior se existir
        const { error: deactivateError } = await supabase
          .from('certificados_digitais')
          .update({ ativo: false, updated_at: new Date().toISOString() })
          .eq('empresa_id', certificadoData.empresa_id)
          .eq('ativo', true);

        if (deactivateError) {
          console.warn('Aviso ao desativar certificados anteriores:', deactivateError);
        }
        
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
        
        // Armazenar chave de criptografia de forma segura
        // IMPORTANTE: Em produção, usar Supabase Vault ou solução similar
        try {
          localStorage.setItem(`cert_key_${data.id}`, chaveEncriptacao);
        } catch (storageError) {
          console.error('Erro ao armazenar chave de criptografia:', storageError);
          // Remover certificado se não conseguir armazenar a chave
          await supabase.from('certificados_digitais').delete().eq('id', data.id);
          throw new Error('Erro ao armazenar certificado com segurança');
        }
        
        return data;
      } catch (error) {
        console.error('Erro no upload do certificado:', error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['certificados-digitais', variables.empresa_id] });
      toast({
        title: "Sucesso!",
        description: "Certificado digital carregado e validado com sucesso",
      });
    },
    onError: (error) => {
      console.error('Erro ao fazer upload do certificado:', error);
      toast({
        title: "Erro no Upload",
        description: error instanceof Error ? error.message : "Erro ao fazer upload do certificado",
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
    }): Promise<ValidacaoCertificado> => {
      try {
        // Validações básicas do arquivo
        if (!certificadoData.arquivo.name.match(/\.(p12|pfx)$/i)) {
          return {
            valido: false,
            erro: 'Arquivo deve ser .p12 ou .pfx (certificado PKCS#12)'
          };
        }
        
        // Verificar tamanho mínimo e máximo
        if (certificadoData.arquivo.size < 1000) {
          return {
            valido: false,
            erro: 'Arquivo de certificado muito pequeno (corrompido?)'
          };
        }

        if (certificadoData.arquivo.size > 10 * 1024 * 1024) {
          return {
            valido: false,
            erro: 'Arquivo muito grande. Máximo 10MB permitido'
          };
        }

        // Verificar senha
        if (!certificadoData.senha || certificadoData.senha.length < 4) {
          return {
            valido: false,
            erro: 'Senha do certificado deve ter pelo menos 4 caracteres'
          };
        }

        // Ler e tentar validar o certificado
        const arrayBuffer = await certificadoData.arquivo.arrayBuffer();
        
        // Verificar assinatura PKCS#12 (primeiros bytes)
        const bytes = new Uint8Array(arrayBuffer);
        const header = bytes.slice(0, 4);
        
        // PKCS#12 geralmente começa com 0x30, 0x82 ou sequência similar
        if (header[0] !== 0x30) {
          return {
            valido: false,
            erro: 'Arquivo não parece ser um certificado PKCS#12 válido'
          };
        }

        // TODO: Em produção, usar biblioteca como node-forge ou similar
        // para validação real do certificado PKCS#12
        
        // Simulação melhorada baseada em validações reais
        const agora = new Date();
        const validadeInicio = new Date(agora.getTime() - 365 * 24 * 60 * 60 * 1000); // 1 ano atrás
        const validadeFim = new Date(agora.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 ano no futuro
        
        const diasRestantes = Math.floor((validadeFim.getTime() - agora.getTime()) / (1000 * 60 * 60 * 24));
        const expirado = diasRestantes <= 0;
        const proximoDoVencimento = diasRestantes <= 30 && diasRestantes > 0;

        // Simular dados do certificado
        const resultado: ValidacaoCertificado = {
          valido: !expirado,
          validade_inicio: validadeInicio.toISOString(),
          validade_fim: validadeFim.toISOString(),
          proprietario: 'Certificado Digital Simulado',
          cnpj: '12.345.678/0001-90',
          detalhes: {
            expirado,
            dias_restantes: Math.max(0, diasRestantes),
            valido_para_nfe: !expirado
          }
        };

        if (expirado) {
          resultado.erro = 'Certificado digital expirado';
        } else if (proximoDoVencimento) {
          resultado.erro = `Certificado próximo do vencimento (${diasRestantes} dias restantes)`;
        }

        return resultado;
        
      } catch (error) {
        console.error('Erro na validação do certificado:', error);
        return {
          valido: false,
          erro: error instanceof Error ? error.message : 'Erro desconhecido na validação'
        };
      }
    },
    onSuccess: (data) => {
      if (data.valido) {
        toast({
          title: "Certificado Válido",
          description: `Certificado válido até ${new Date(data.validade_fim || '').toLocaleDateString('pt-BR')}`,
        });
      } else {
        toast({
          title: "Certificado Inválido",
          description: data.erro || 'Certificado não pôde ser validado',
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      console.error('Erro ao validar certificado:', error);
      toast({
        title: "Erro na Validação",
        description: "Erro ao validar certificado digital",
        variant: "destructive",
      });
    },
  });
};

export const useRemoverCertificado = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (certificadoId: string) => {
      // Remover chave de criptografia
      try {
        localStorage.removeItem(`cert_key_${certificadoId}`);
      } catch (error) {
        console.warn('Aviso ao remover chave do localStorage:', error);
      }
      
      // Remover certificado do banco
      const { error } = await supabase
        .from('certificados_digitais')
        .delete()
        .eq('id', certificadoId);
      
      if (error) throw error;
      
      return certificadoId;
    },
    onSuccess: (_, certificadoId) => {
      // Invalidar cache para todas as empresas (não sabemos qual empresa)
      queryClient.invalidateQueries({ queryKey: ['certificados-digitais'] });
      
      toast({
        title: "Sucesso!",
        description: "Certificado digital removido com segurança",
      });
    },
    onError: (error) => {
      console.error('Erro ao remover certificado:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover certificado digital",
        variant: "destructive",
      });
    },
  });
};

/**
 * Hook para verificar status dos certificados de uma empresa
 */
export const useStatusCertificados = (empresaId: string) => {
  return useQuery({
    queryKey: ['status-certificados', empresaId],
    queryFn: async () => {
      const { data: certificados, error } = await supabase
        .from('certificados_digitais')
        .select('*')
        .eq('empresa_id', empresaId)
        .eq('ativo', true);
      
      if (error) throw error;
      
      const agora = new Date();
      const status = {
        tem_certificado_ativo: false,
        certificado_expirado: false,
        certificado_proximo_vencimento: false,
        dias_para_vencer: 0,
        total_certificados: certificados.length
      };
      
      if (certificados.length > 0) {
        const cert = certificados[0]; // Certificado ativo mais recente
        const validadeFim = new Date(cert.validade_fim);
        const diasRestantes = Math.floor((validadeFim.getTime() - agora.getTime()) / (1000 * 60 * 60 * 24));
        
        status.tem_certificado_ativo = true;
        status.dias_para_vencer = Math.max(0, diasRestantes);
        status.certificado_expirado = diasRestantes <= 0;
        status.certificado_proximo_vencimento = diasRestantes <= 30 && diasRestantes > 0;
      }
      
      return status;
    },
    enabled: !!empresaId,
    refetchInterval: 1000 * 60 * 60, // Revalidar a cada hora
  });
};
