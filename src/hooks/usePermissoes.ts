
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Simulação de permissões do usuário (em produção, viria do banco)
const mockUserPermissions: Record<string, Record<string, boolean>> = {};

export const useUserPermissions = (userId: string) => {
  return useQuery({
    queryKey: ['user-permissions', userId],
    queryFn: async () => {
      // Em produção, buscar do banco de dados
      // const { data, error } = await supabase
      //   .from('user_permissions')
      //   .select('*')
      //   .eq('user_id', userId);
      
      // if (error) throw error;
      
      // Por enquanto, retornar mock data
      return mockUserPermissions[userId] || {};
    },
    enabled: !!userId,
  });
};

export const useUpdateUserPermission = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      userId, 
      permissionId, 
      granted 
    }: { 
      userId: string; 
      permissionId: string; 
      granted: boolean;
    }) => {
      // Em produção, salvar no banco de dados
      // const { data, error } = await supabase
      //   .from('user_permissions')
      //   .upsert([{
      //     user_id: userId,
      //     permission_id: permissionId,
      //     granted: granted,
      //     granted_by: currentUserId,
      //     granted_at: new Date().toISOString()
      //   }])
      //   .select()
      //   .single();
      
      // if (error) throw error;
      
      // Por enquanto, atualizar mock data
      if (!mockUserPermissions[userId]) {
        mockUserPermissions[userId] = {};
      }
      mockUserPermissions[userId][permissionId] = granted;
      
      return { userId, permissionId, granted };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-permissions', variables.userId] });
      toast({
        title: "Sucesso!",
        description: "Permissão atualizada com sucesso",
      });
    },
    onError: (error) => {
      console.error('Erro ao atualizar permissão:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar permissão",
        variant: "destructive",
      });
    },
  });
};
