
import React from 'react';
import { FormField } from '@/components/common/FormField';
import { useEmpresas } from '@/hooks/useEmpresas';

interface UserCompanyFieldProps {
  value: string;
  isLoading: boolean;
  onChange: (value: string) => void;
}

export const UserCompanyField: React.FC<UserCompanyFieldProps> = ({
  value,
  isLoading,
  onChange,
}) => {
  const { data: empresas, isLoading: loadingEmpresas } = useEmpresas();

  // Fix: Use "none" instead of empty string to avoid Radix UI Select error
  const empresaOptions = [
    { value: 'none', label: 'Sem vínculo específico' },
    ...(empresas?.map(empresa => ({
      value: empresa.id,
      label: empresa.nome_fantasia || empresa.razao_social
    })) || [])
  ];

  const handleChange = (selectedValue: string) => {
    // Convert "none" back to empty string for our form logic
    onChange(selectedValue === 'none' ? '' : selectedValue);
  };

  const displayValue = value === '' ? 'none' : value;

  return (
    <FormField
      type="select"
      label="Empresa"
      value={displayValue}
      onChange={handleChange}
      options={empresaOptions}
      disabled={isLoading || loadingEmpresas}
      placeholder={loadingEmpresas ? "Carregando empresas..." : "Selecione uma empresa"}
    />
  );
};
