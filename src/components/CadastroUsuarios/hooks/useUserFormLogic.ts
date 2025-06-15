
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateUserProfile } from '@/hooks/useUserProfiles';
import { toast } from '@/hooks/use-toast';

interface FormData {
  nome: string;
  email: string;
  role: string;
  ativo: boolean;
  empresa_id: string;
}

const initialFormData: FormData = {
  nome: '',
  email: '',
  role: 'visualizador',
  ativo: true,
  empresa_id: '',
};

export const useUserFormLogic = (usuario: any, open: boolean, onClose: () => void) => {
  const { profile } = useAuth();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const createUserProfile = useCreateUserProfile();

  useEffect(() => {
    if (usuario) {
      console.log('Carregando dados para edição:', usuario);
      setFormData({
        nome: usuario.nome || '',
        email: usuario.email || '',
        role: usuario.role || 'visualizador',
        ativo: usuario.ativo ?? true,
        empresa_id: usuario.empresa_id || '',
      });
    } else {
      console.log('Resetando formulário para novo usuário');
      const initialData = {
        ...initialFormData,
        empresa_id: profile?.empresa_id || '',
      };
      setFormData(initialData);
    }
    setErrors({});
  }, [usuario, open, profile?.empresa_id]);

  const validateForm = () => {
    console.log('Validando formulário:', formData);
    const newErrors: Partial<FormData> = {};
    
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (formData.nome.trim().length < 2) {
      newErrors.nome = 'Nome deve ter pelo menos 2 caracteres';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Formato de email inválido';
      }
    }
    
    if (!formData.role) {
      newErrors.role = 'Perfil é obrigatório';
    }
    
    console.log('Erros de validação encontrados:', newErrors);
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('=== SUBMETENDO FORMULÁRIO ===');
    console.log('Dados do formulário:', formData);
    
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      console.log('Formulário inválido, parando submissão');
      return;
    }

    try {
      if (usuario) {
        console.log('Modo edição - funcionalidade não implementada ainda');
        toast({
          title: "Informação",
          description: "Funcionalidade de edição será implementada em breve",
        });
        return;
      }

      const profileData = {
        nome: formData.nome.trim(),
        email: formData.email.trim(),
        role: formData.role,
        ativo: formData.ativo,
        empresa_id: formData.empresa_id || null,
      };

      console.log('Enviando dados para criação:', profileData);

      await createUserProfile.mutateAsync(profileData);
      
      console.log('Perfil criado com sucesso, resetando formulário');
      
      setFormData({
        ...initialFormData,
        empresa_id: profile?.empresa_id || '',
      });
      setErrors({});
      onClose();
      
    } catch (error) {
      console.error('Erro capturado no handleSubmit:', error);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    console.log(`Campo ${field} alterado para:`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return {
    formData,
    errors,
    isLoading: createUserProfile.isPending,
    handleSubmit,
    handleInputChange,
  };
};
