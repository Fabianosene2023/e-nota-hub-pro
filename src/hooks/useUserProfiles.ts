import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useUserProfiles = (empresaId?: string) => {
  return useQuery({
    queryKey: ['user-profiles', empresaId],
    queryFn: async () => {
      console.log('Buscando user profiles para empresa:', empresaId);
      
      let query = supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (empresaId) {
        query = query.eq('empresa_id', empresaId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Erro ao buscar user profiles:', error);
        throw error;
      }
      
      console.log('User profiles encontrados:', data);
      return data;
    },
    enabled: !!empresaId,
  });
};

export const useCreateUserProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (profileData: any) => {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert([profileData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profiles'] });
      toast({
        title: "Sucesso!",
        description: "Perfil de usuário criado com sucesso",
      });
    },
    onError: (error) => {
      console.error('Erro ao criar perfil:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar perfil de usuário",
        variant: "destructive",
      });
    },
  });
};
