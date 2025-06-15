
import React from 'react';
import { FormField } from '@/components/common/FormField';

interface UserBasicInfoFieldsProps {
  formData: {
    nome: string;
    email: string;
  };
  errors: {
    nome?: string;
    email?: string;
  };
  isLoading: boolean;
  onFieldChange: (field: string, value: string) => void;
}

export const UserBasicInfoFields: React.FC<UserBasicInfoFieldsProps> = ({
  formData,
  errors,
  isLoading,
  onFieldChange,
}) => {
  return (
    <>
      <FormField
        type="input"
        label="Nome"
        value={formData.nome}
        onChange={(value) => onFieldChange('nome', value)}
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
        onChange={(value) => onFieldChange('email', value)}
        error={errors.email}
        required
        placeholder="Digite o email"
        disabled={isLoading}
      />
    </>
  );
};
