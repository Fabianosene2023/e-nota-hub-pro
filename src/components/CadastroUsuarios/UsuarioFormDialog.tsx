
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UserBasicInfoFields } from './forms/UserBasicInfoFields';
import { UserCompanyField } from './forms/UserCompanyField';
import { UserRoleAndStatusFields } from './forms/UserRoleAndStatusFields';
import { useUserFormLogic } from './hooks/useUserFormLogic';

interface UsuarioFormDialogProps {
  open: boolean;
  onClose: () => void;
  usuario?: any;
}

export const UsuarioFormDialog: React.FC<UsuarioFormDialogProps> = ({
  open,
  onClose,
  usuario,
}) => {
  const {
    formData,
    errors,
    isLoading,
    handleSubmit,
    handleInputChange,
  } = useUserFormLogic(usuario, open, onClose);

  console.log('=== USUARIO FORM DIALOG ===');
  console.log('Dialog aberto:', open);
  console.log('Usuário para edição:', usuario);

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
          <UserBasicInfoFields
            formData={formData}
            errors={errors}
            isLoading={isLoading}
            onFieldChange={handleInputChange}
          />

          <UserCompanyField
            value={formData.empresa_id}
            isLoading={isLoading}
            onChange={(value) => handleInputChange('empresa_id', value)}
          />

          <UserRoleAndStatusFields
            formData={formData}
            errors={errors}
            isLoading={isLoading}
            onFieldChange={handleInputChange}
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
