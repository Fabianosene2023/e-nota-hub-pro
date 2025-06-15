
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
      
      // Se empresaId for fornecido, filtra por empresa
      // Se não, busca todos os usuários (para casos onde o usuário é admin geral)
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
    // Sempre executa a query, mesmo sem empresa_id
    enabled: true,
  });
};

export const useCreateUserProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (profileData: any) => {
      console.log('Tentando criar perfil com dados:', profileData);
      
      // Validação básica dos dados obrigatórios
      if (!profileData.nome || !profileData.email || !profileData.role) {
        throw new Error('Dados obrigatórios não fornecidos');
      }

      // Gerar um user_id único se não fornecido
      const finalProfileData = {
        ...profileData,
        user_id: profileData.user_id || crypto.randomUUID(),
        ativo: profileData.ativo !== undefined ? profileData.ativo : true,
      };

      console.log('Dados finais para inserção:', finalProfileData);

      const { data, error } = await supabase
        .from('user_profiles')
        .insert([finalProfileData])
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao inserir no banco:', error);
        throw error;
      }

      console.log('Perfil criado com sucesso:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('Sucesso na criação:', data);
      queryClient.invalidateQueries({ queryKey: ['user-profiles'] });
      toast({
        title: "Sucesso!",
        description: "Perfil de usuário criado com sucesso",
      });
    },
    onError: (error: any) => {
      console.error('Erro ao criar perfil:', error);
      
      let errorMessage = "Erro ao criar perfil de usuário";
      
      // Mensagens de erro mais específicas
      if (error.code === '23505') {
        errorMessage = "Este email já está cadastrado no sistema";
      } else if (error.code === '23502') {
        errorMessage = "Campos obrigatórios não preenchidos";
      } else if (error.message) {
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
