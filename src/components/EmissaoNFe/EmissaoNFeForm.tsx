
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { DadosGeraisSection } from './DadosGeraisSection';
import { DadosClienteCard } from './DadosClienteCard';
import { EnderecosCard } from './EnderecosCard';
import { ItensSection } from './ItensSection';
import { DadosFreteSection } from './DadosFreteSection';
import { ObservacoesSection } from './ObservacoesSection';
import { useNFeSubmit } from './hooks/useNFeSubmit';
import { useFormValidation } from './hooks/useFormValidation';

interface ItemNFe {
  produto_id: string;
  item_nome: string;
  quantidade: number;
  preco_unitario: number;
  valor_unitario: number;
  valor_total: number;
  cfop: string;
  ncm: string;
  tipo: 'produto';
}

export const EmissaoNFeForm = () => {
  // Estados para dados gerais
  const [formData, setFormData] = useState({
    empresa_id: '',
    cliente_id: '',
    numero: '',
    serie: 1,
    natureza_operacao: 'Venda de mercadoria',
    observacoes: '',
    tipo_pessoa: 'juridica' as 'fisica' | 'juridica',
    email_cliente: '',
    telefone_cliente: '',
    cnpj_cpf_entrega: '',
    inscricao_estadual_cliente: '',
    endereco_faturamento: '',
    endereco_entrega: '',
    tipo_nota: 'saida' as 'entrada' | 'saida',
    data_emissao: new Date().toISOString().split('T')[0],
    data_entrega: '',
    data_cancelamento: '',
  });

  // Estados para dados de frete - updated field names
  const [freightMode, setFreightMode] = useState('9');
  const [freightValue, setFreightValue] = useState('');
  const [insuranceValue, setInsuranceValue] = useState('');
  const [volumeQuantity, setVolumeQuantity] = useState('');
  const [weightGross, setWeightGross] = useState('');
  const [weightNet, setWeightNet] = useState('');
  const [transporterId, setTransporterId] = useState('');

  // Estados para itens
  const [itens, setItens] = useState<ItemNFe[]>([]);

  const { submitNFe, isSubmitting } = useNFeSubmit();
  const { validateForm } = useFormValidation();

  const valorTotalNota = itens.reduce((total, item) => total + item.valor_total, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm(formData, itens);
    if (validationError) {
      toast({
        title: "Erro de Validação",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    // Include freight data in payload using new field names
    const nfeData = {
      ...formData,
      freight_mode: freightMode,
      freight_value: parseFloat(freightValue) || 0,
      insurance_value: parseFloat(insuranceValue) || 0,
      volume_quantity: parseInt(volumeQuantity) || 0,
      weight_gross: parseFloat(weightGross) || 0,
      weight_net: parseFloat(weightNet) || 0,
      transporter_id: transporterId || null,
    };

    const success = await submitNFe(nfeData, itens, valorTotalNota);
    
    if (success) {
      // Reset form
      setFormData({
        empresa_id: '',
        cliente_id: '',
        numero: '',
        serie: 1,
        natureza_operacao: 'Venda de mercadoria',
        observacoes: '',
        tipo_pessoa: 'juridica',
        email_cliente: '',
        telefone_cliente: '',
        cnpj_cpf_entrega: '',
        inscricao_estadual_cliente: '',
        endereco_faturamento: '',
        endereco_entrega: '',
        tipo_nota: 'saida',
        data_emissao: new Date().toISOString().split('T')[0],
        data_entrega: '',
        data_cancelamento: '',
      });
      setItens([]);
      setFreightMode('9');
      setFreightValue('');
      setInsuranceValue('');
      setVolumeQuantity('');
      setWeightGross('');
      setWeightNet('');
      setTransporterId('');
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <DadosGeraisSection formData={formData} setFormData={setFormData} />
      
      <DadosClienteCard 
        formData={formData} 
        clientes={[]} 
        loadingClientes={false}
        onInputChange={handleInputChange}
      />
      
      <EnderecosCard 
        formData={formData} 
        onInputChange={handleInputChange}
      />
      
      <ItensSection 
        itens={itens} 
        setItens={setItens} 
        empresaId={formData.empresa_id}
        valorTotalNota={valorTotalNota}
      />

      <DadosFreteSection
        freightMode={freightMode}
        setFreightMode={setFreightMode}
        freightValue={freightValue}
        setFreightValue={setFreightValue}
        insuranceValue={insuranceValue}
        setInsuranceValue={setInsuranceValue}
        volumeQuantity={volumeQuantity}
        setVolumeQuantity={setVolumeQuantity}
        weightGross={weightGross}
        setWeightGross={setWeightGross}
        weightNet={weightNet}
        setWeightNet={setWeightNet}
        transporterId={transporterId}
        setTransporterId={setTransporterId}
      />
      
      <ObservacoesSection 
        observacoes={formData.observacoes}
        setObservacoes={(observacoes) => setFormData({ ...formData, observacoes })}
      />

      <div className="flex justify-end space-x-4">
        <Button
          type="submit"
          disabled={isSubmitting || itens.length === 0}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? 'Emitindo...' : 'Emitir NFe'}
        </Button>
      </div>
    </form>
  );
};
