
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
      console.log('=== INICIANDO CRIAÇÃO DE PERFIL ===');
      console.log('Dados recebidos:', profileData);
      
      // Validação básica dos dados obrigatórios
      if (!profileData.nome?.trim()) {
        throw new Error('Nome é obrigatório');
      }
      
      if (!profileData.email?.trim()) {
        throw new Error('Email é obrigatório');
      }
      
      if (!profileData.role) {
        throw new Error('Perfil/Role é obrigatório');
      }
      
      // Validação de formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(profileData.email.trim())) {
        throw new Error('Formato de email inválido');
      }
      
      // Verificar se o email já existe
      console.log('Verificando se email já existe:', profileData.email);
      const { data: existingUser, error: checkError } = await supabase
        .from('user_profiles')
        .select('id, email')
        .eq('email', profileData.email.trim().toLowerCase())
        .maybeSingle();
      
      if (checkError) {
        console.error('Erro ao verificar email existente:', checkError);
        throw new Error('Erro ao verificar email existente');
      }
      
      if (existingUser) {
        console.log('Email já existe:', existingUser);
        throw new Error('Este email já está cadastrado no sistema');
      }
      
      // Verificar se a empresa existe (somente se empresa_id foi fornecido e não é null)
      if (profileData.empresa_id) {
        console.log('Verificando se empresa existe:', profileData.empresa_id);
        const { data: empresa, error: empresaError } = await supabase
          .from('empresas')
          .select('id')
          .eq('id', profileData.empresa_id)
          .maybeSingle();
        
        if (empresaError) {
          console.error('Erro ao verificar empresa:', empresaError);
          throw new Error('Erro ao verificar empresa');
        }
        
        if (!empresa) {
          throw new Error('Empresa não encontrada');
        }
      }

      // Preparar dados finais para inserção
      const finalProfileData = {
        user_id: crypto.randomUUID(),
        nome: profileData.nome.trim(),
        email: profileData.email.trim().toLowerCase(),
        role: profileData.role,
        empresa_id: profileData.empresa_id || null, // Explicitamente null se não fornecido
        ativo: profileData.ativo !== undefined ? profileData.ativo : true,
      };

      console.log('Dados finais para inserção:', finalProfileData);

      // Tentar inserir no banco
      const { data, error } = await supabase
        .from('user_profiles')
        .insert([finalProfileData])
        .select()
        .single();
      
      if (error) {
        console.error('=== ERRO AO INSERIR NO BANCO ===');
        console.error('Erro completo:', error);
        console.error('Código do erro:', error.code);
        console.error('Mensagem:', error.message);
        console.error('Detalhes:', error.details);
        
        // Tratar erros específicos do PostgreSQL
        if (error.code === '23505') {
          if (error.message.includes('email')) {
            throw new Error('Este email já está cadastrado no sistema');
          } else if (error.message.includes('user_id')) {
            throw new Error('ID de usuário já existe (tente novamente)');
          } else {
            throw new Error('Dados duplicados encontrados');
          }
        } else if (error.code === '23502') {
          throw new Error('Campos obrigatórios não preenchidos corretamente');
        } else if (error.code === '23503') {
          throw new Error('Empresa inválida ou não encontrada');
        } else {
          throw new Error(`Erro no banco de dados: ${error.message}`);
        }
      }

      console.log('=== PERFIL CRIADO COM SUCESSO ===');
      console.log('Dados retornados:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('Sucesso na criação do perfil:', data);
      queryClient.invalidateQueries({ queryKey: ['user-profiles'] });
      toast({
        title: "Sucesso!",
        description: `Perfil de usuário "${data.nome}" criado com sucesso`,
      });
    },
    onError: (error: any) => {
      console.error('=== ERRO NA MUTATION ===');
      console.error('Erro:', error);
      
      let errorMessage = "Erro desconhecido ao criar perfil de usuário";
      
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
