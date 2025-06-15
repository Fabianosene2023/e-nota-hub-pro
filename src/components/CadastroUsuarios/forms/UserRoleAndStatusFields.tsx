
import React from 'react';
import { FormField } from '@/components/common/FormField';

const roleOptions = [
  { value: 'admin', label: 'Administrador' },
  { value: 'editor', label: 'Editor' },
  { value: 'visualizador', label: 'Visualizador' },
];

interface UserRoleAndStatusFieldsProps {
  formData: {
    role: string;
    ativo: boolean;
  };
  errors: {
    role?: string;
  };
  isLoading: boolean;
  onFieldChange: (field: string, value: string | boolean) => void;
}

export const UserRoleAndStatusFields: React.FC<UserRoleAndStatusFieldsProps> = ({
  formData,
  errors,
  isLoading,
  onFieldChange,
}) => {
  return (
    <>
      <FormField
        type="select"
        label="Perfil"
        value={formData.role}
        onChange={(value) => onFieldChange('role', value)}
        options={roleOptions}
        error={errors.role}
        required
        disabled={isLoading}
      />

      <FormField
        type="select"
        label="Status"
        value={formData.ativo ? 'true' : 'false'}
        onChange={(value) => onFieldChange('ativo', value === 'true')}
        options={[
          { value: 'true', label: 'Ativo' },
          { value: 'false', label: 'Inativo' },
        ]}
        disabled={isLoading}
      />
    </>
  );
};
