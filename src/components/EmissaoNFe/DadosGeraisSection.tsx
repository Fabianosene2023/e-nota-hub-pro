
import React from 'react';
import { useEmpresas } from '@/hooks/useEmpresas';
import { useClientesManager } from '@/hooks/useClientesManager';
import { DadosBasicosCard } from './DadosBasicosCard';
import { DadosClienteCard } from './DadosClienteCard';
import { EnderecosCard } from './EnderecosCard';
import { useClienteAutoFill } from './hooks/useClienteAutoFill';

interface DadosGeraisProps {
  formData: {
    empresa_id: string;
    cliente_id: string;
    numero: string;
    serie: number;
    natureza_operacao: string;
    observacoes: string;
    tipo_pessoa: 'fisica' | 'juridica';
    email_cliente: string;
    telefone_cliente: string;
    cnpj_cpf_entrega: string;
    inscricao_estadual_cliente: string;
    endereco_faturamento: string;
    endereco_entrega: string;
    tipo_nota: 'entrada' | 'saida';
    data_emissao: string;
    data_entrega: string;
    data_cancelamento: string;
  };
  setFormData: (data: any) => void;
}

export const DadosGeraisSection = ({ formData, setFormData }: DadosGeraisProps) => {
  const { data: empresas, isLoading: loadingEmpresas } = useEmpresas();
  const { data: clientes, isLoading: loadingClientes } = useClientesManager(formData.empresa_id);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const clienteSelecionado = clientes?.find(c => c.id === formData.cliente_id);
  
  // Auto-preencher dados do cliente quando selecionado
  useClienteAutoFill(clienteSelecionado, setFormData);

  return (
    <div className="space-y-6">
      <DadosBasicosCard 
        formData={formData}
        empresas={empresas || []}
        loadingEmpresas={loadingEmpresas}
        onInputChange={handleInputChange}
      />

      <DadosClienteCard 
        formData={formData}
        clientes={clientes || []}
        loadingClientes={loadingClientes}
        onInputChange={handleInputChange}
      />

      <EnderecosCard 
        formData={formData}
        onInputChange={handleInputChange}
      />
    </div>
  );
};
