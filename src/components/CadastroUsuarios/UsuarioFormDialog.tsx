
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

  useEffect(() => {
    if (usuario) {
      setFormData({
        nome: usuario.nome || '',
        email: usuario.email || '',
        role: usuario.role || 'visualizador',
        ativo: usuario.ativo ?? true,
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [usuario, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Partial<FormData> = {};
    
    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório';
    if (!formData.role) newErrors.role = 'Perfil é obrigatório';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (usuario) {
        // TODO: Implementar atualização quando necessário
        toast({
          title: "Informação",
          description: "Funcionalidade de edição será implementada em breve",
        });
      } else {
        await createUserProfile.mutateAsync({
          ...formData,
          empresa_id: profile?.empresa_id,
          user_id: crypto.randomUUID(), // Placeholder - em produção seria o ID do usuário criado no auth
        });
        onClose();
      }
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

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
          />

          <FormField
            type="input"
            inputType="email"
            label="Email"
            value={formData.email}
            onChange={(value) => handleInputChange('email', value)}
            error={errors.email}
            required
          />

          <FormField
            type="select"
            label="Perfil"
            value={formData.role}
            onChange={(value) => handleInputChange('role', value)}
            options={roleOptions}
            error={errors.role}
            required
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
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={createUserProfile.isPending}
            >
              {createUserProfile.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
