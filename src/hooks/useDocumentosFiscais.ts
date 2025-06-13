
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useDocumentosFiscais = (notaFiscalId?: string) => {
  return useQuery({
    queryKey: ['documentos-fiscais', notaFiscalId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documentos_fiscais')
        .select('*')
        .eq('nota_fiscal_id', notaFiscalId!)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!notaFiscalId,
  });
};

export const useCreateDocumento = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (documentoData: {
      nota_fiscal_id: string;
      tipo_documento: string;
      nome_arquivo: string;
      url_arquivo?: string;
      conteudo_base64?: string;
      tamanho_bytes?: number;
    }) => {
      const { data, error } = await supabase
        .from('documentos_fiscais')
        .insert([documentoData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documentos-fiscais', variables.nota_fiscal_id] });
      toast({
        title: "Sucesso!",
        description: "Documento fiscal armazenado com sucesso",
      });
    },
    onError: (error) => {
      console.error('Erro ao salvar documento:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar documento fiscal",
        variant: "destructive",
      });
    },
  });
};
