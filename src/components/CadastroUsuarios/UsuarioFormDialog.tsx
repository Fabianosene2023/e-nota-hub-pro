
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/common/FormField';
import { useCreateUserProfile } from '@/hooks/useUserProfiles';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface UsuarioFormDialogProps {
  open: boolean;
  onClose: () => void;
  usuario?: any;
}

interface FormData {
  nome: string;
  email: string;
  role: string;
  ativo: boolean;
}

const initialFormData: FormData = {
  nome: '',
  email: '',
  role: 'visualizador',
  ativo: true,
};

const roleOptions = [
  { value: 'admin', label: 'Administrador' },
  { value: 'editor', label: 'Editor' },
  { value: 'visualizador', label: 'Visualizador' },
];

export const UsuarioFormDialog: React.FC<UsuarioFormDialogProps> = ({
  open,
  onClose,
  usuario,
}) => {
  const { profile } = useAuth();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const createUserProfile = useCreateUserProfile();

  console.log('=== USUARIO FORM DIALOG ===');
  console.log('Profile do usuário logado:', profile);
  console.log('Dialog aberto:', open);
  console.log('Usuário para edição:', usuario);

  useEffect(() => {
    if (usuario) {
      console.log('Carregando dados para edição:', usuario);
      setFormData({
        nome: usuario.nome || '',
        email: usuario.email || '',
        role: usuario.role || 'visualizador',
        ativo: usuario.ativo ?? true,
      });
    } else {
      console.log('Resetando formulário para novo usuário');
      setFormData(initialFormData);
    }
    setErrors({});
  }, [usuario, open]);

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
      // Validação de formato de email
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

      // Dados para criação
      const profileData = {
        nome: formData.nome.trim(),
        email: formData.email.trim(),
        role: formData.role,
        ativo: formData.ativo,
        empresa_id: profile?.empresa_id || null, // Explicitamente null se não tiver empresa
      };

      console.log('Enviando dados para criação:', profileData);

      await createUserProfile.mutateAsync(profileData);
      
      console.log('Perfil criado com sucesso, resetando formulário');
      
      // Resetar formulário e fechar
      setFormData(initialFormData);
      setErrors({});
      onClose();
      
    } catch (error) {
      console.error('Erro capturado no handleSubmit:', error);
      // O erro já é tratado pelo onError da mutation
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    console.log(`Campo ${field} alterado para:`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const isLoading = createUserProfile.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {usuario ? 'Editar Usuário' : 'Novo Usuário'}
          </DialogTitle>
          <DialogDescription>
            {usuario 
              ? 'Edite as informações do usuário'
              : 'Preencha as informações para criar um novo usuário'
            }
            {!profile?.empresa_id && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                ⚠️ Usuário será criado sem vínculo específico de empresa
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            type="input"
            label="Nome"
            value={formData.nome}
            onChange={(value) => handleInputChange('nome', value)}
            error={errors.nome}
            required
            placeholder="Digite o nome completo"
            disabled={isLoading}
          />

          <FormField
            type="input"
            inputType="email"
            label="Email"
            value={formData.email}
            onChange={(value) => handleInputChange('email', value)}
            error={errors.email}
            required
            placeholder="Digite o email"
            disabled={isLoading}
          />

          <FormField
            type="select"
            label="Perfil"
            value={formData.role}
            onChange={(value) => handleInputChange('role', value)}
            options={roleOptions}
            error={errors.role}
            required
            disabled={isLoading}
          />

          <FormField
            type="select"
            label="Status"
            value={formData.ativo ? 'true' : 'false'}
            onChange={(value) => handleInputChange('ativo', value === 'true')}
            options={[
              { value: 'true', label: 'Ativo' },
              { value: 'false', label: 'Inativo' },
            ]}
            disabled={isLoading}
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
