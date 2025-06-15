
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useDeleteUserProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userId: string) => {
      console.log('=== INICIANDO EXCLUSÃO DE PERFIL ===');
      console.log('ID do usuário para exclusão:', userId);
      
      if (!userId) {
        throw new Error('ID do usuário é obrigatório para exclusão');
      }
      
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId);
      
      if (error) {
        console.error('=== ERRO AO EXCLUIR PERFIL ===');
        console.error('Erro completo:', error);
        console.error('Código do erro:', error.code);
        console.error('Mensagem:', error.message);
        
        throw new Error(`Erro ao excluir usuário: ${error.message}`);
      }

      console.log('=== PERFIL EXCLUÍDO COM SUCESSO ===');
      return userId;
    },
    onSuccess: () => {
      console.log('Sucesso na exclusão do perfil');
      queryClient.invalidateQueries({ queryKey: ['user-profiles'] });
      toast({
        title: "Sucesso!",
        description: "Usuário excluído com sucesso",
      });
    },
    onError: (error: any) => {
      console.error('=== ERRO NA MUTATION DE EXCLUSÃO ===');
      console.error('Erro:', error);
      
      let errorMessage = "Erro desconhecido ao excluir usuário";
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};
