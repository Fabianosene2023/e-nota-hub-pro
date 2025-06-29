
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

  // Estados para dados de frete
  const [modalidadeFrete, setModalidadeFrete] = useState('9');
  const [valorFrete, setValorFrete] = useState('');
  const [valorSeguro, setValorSeguro] = useState('');
  const [quantidadeVolumes, setQuantidadeVolumes] = useState('');
  const [pesoBruto, setPesoBruto] = useState('');
  const [pesoLiquido, setPesoLiquido] = useState('');
  const [transportadoraId, setTransportadoraId] = useState('');

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

    // Incluir dados de frete no payload
    const nfeData = {
      ...formData,
      modalidade_frete: parseInt(modalidadeFrete),
      valor_frete: parseFloat(valorFrete) || 0,
      valor_seguro: parseFloat(valorSeguro) || 0,
      quantidade_volumes: parseInt(quantidadeVolumes) || 0,
      peso_bruto: parseFloat(pesoBruto) || 0,
      peso_liquido: parseFloat(pesoLiquido) || 0,
      transportadora_id: transportadoraId || null,
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
      setModalidadeFrete('9');
      setValorFrete('');
      setValorSeguro('');
      setQuantidadeVolumes('');
      setPesoBruto('');
      setPesoLiquido('');
      setTransportadoraId('');
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
        modalidadeFrete={modalidadeFrete}
        setModalidadeFrete={setModalidadeFrete}
        valorFrete={valorFrete}
        setValorFrete={setValorFrete}
        valorSeguro={valorSeguro}
        setValorSeguro={setValorSeguro}
        quantidadeVolumes={quantidadeVolumes}
        setQuantidadeVolumes={setQuantidadeVolumes}
        pesoBruto={pesoBruto}
        setPesoBruto={setPesoBruto}
        pesoLiquido={pesoLiquido}
        setPesoLiquido={setPesoLiquido}
        transportadoraId={transportadoraId}
        setTransportadoraId={setTransportadoraId}
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
