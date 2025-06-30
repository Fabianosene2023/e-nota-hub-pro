
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, FileText } from "lucide-react";
import { DadosBasicosCard } from './DadosBasicosCard';
import { DadosClienteCard } from './DadosClienteCard';
import { ItensSection } from './ItensSection';
import { DadosFreteSection } from './DadosFreteSection';
import { ObservacoesSection } from './ObservacoesSection';
import { useFormValidation } from './hooks/useFormValidation';
import { useNFeSubmit } from './hooks/useNFeSubmit';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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

interface FormData {
  empresa_id: string;
  cliente_id: string;
  numero: string;
  serie: number;
  natureza_operacao: string;
  modalidade_frete: string;
  transportadora_id: string;
  peso_bruto: number;
  peso_liquido: number;
  volume_quantidade: number;
  valor_seguro: number;
  valor_frete: number;
  observacoes: string;
  email_cliente: string;
  telefone_cliente: string;
  cnpj_cpf_entrega: string;
  inscricao_estadual_cliente: string;
}

export const EmissaoNFeForm = () => {
  const { profile } = useAuth();
  
  const [formData, setFormData] = useState<FormData>({
    empresa_id: '',
    cliente_id: '',
    numero: '',
    serie: 1,
    natureza_operacao: 'Venda de mercadoria adquirida ou produzida pelo estabelecimento',
    modalidade_frete: 'sem_frete',
    transportadora_id: '',
    peso_bruto: 0,
    peso_liquido: 0,
    volume_quantidade: 0,
    valor_seguro: 0,
    valor_frete: 0,
    observacoes: '',
    email_cliente: '',
    telefone_cliente: '',
    cnpj_cpf_entrega: '',
    inscricao_estadual_cliente: ''
  });
  
  const [itens, setItens] = useState<ItemNFe[]>([]);
  const { validateForm } = useFormValidation();
  const { submitNFe, isSubmitting } = useNFeSubmit();

  // Fetch empresas
  const { data: empresas, isLoading: loadingEmpresas } = useQuery({
    queryKey: ['empresas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .order('razao_social');
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch clientes based on selected empresa
  const { data: clientes, isLoading: loadingClientes } = useQuery({
    queryKey: ['clientes', formData.empresa_id],
    queryFn: async () => {
      if (!formData.empresa_id) return [];
      
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('empresa_id', formData.empresa_id)
        .order('nome_razao_social');
      
      if (error) throw error;
      return data;
    },
    enabled: !!formData.empresa_id,
  });

  // Auto-select empresa if user has only one
  React.useEffect(() => {
    if (empresas && empresas.length === 1 && !formData.empresa_id) {
      handleInputChange('empresa_id', empresas[0].id);
    }
  }, [empresas, formData.empresa_id]);

  const valorTotalNota = itens.reduce((total, item) => total + item.valor_total, 0);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      empresa_id: '',
      cliente_id: '',
      numero: '',
      serie: 1,
      natureza_operacao: 'Venda de mercadoria adquirida ou produzida pelo estabelecimento',
      modalidade_frete: 'sem_frete',
      transportadora_id: '',
      peso_bruto: 0,
      peso_liquido: 0,
      volume_quantidade: 0,
      valor_seguro: 0,
      valor_frete: 0,
      observacoes: '',
      email_cliente: '',
      telefone_cliente: '',
      cnpj_cpf_entrega: '',
      inscricao_estadual_cliente: ''
    });
    setItens([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm(formData, itens);
    if (validationError) {
      return;
    }

    try {
      await submitNFe({
        ...formData,
        itens,
        valor_total: valorTotalNota
      });
      
      resetForm();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Emissão de NFe</h2>
          <p className="text-muted-foreground">
            Emita notas fiscais eletrônicas
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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

        <ItensSection 
          itens={itens}
          setItens={setItens}
          valorTotalNota={valorTotalNota}
          empresaId={formData.empresa_id}
        />

        <DadosFreteSection 
          freightMode={formData.modalidade_frete}
          setFreightMode={(value) => handleInputChange('modalidade_frete', value)}
          freightValue={formData.valor_frete.toString()}
          setFreightValue={(value) => handleInputChange('valor_frete', parseFloat(value) || 0)}
          insuranceValue={formData.valor_seguro.toString()}
          setInsuranceValue={(value) => handleInputChange('valor_seguro', parseFloat(value) || 0)}
          volumeQuantity={formData.volume_quantidade.toString()}
          setVolumeQuantity={(value) => handleInputChange('volume_quantidade', parseInt(value) || 0)}
          weightGross={formData.peso_bruto.toString()}
          setWeightGross={(value) => handleInputChange('peso_bruto', parseFloat(value) || 0)}
          weightNet={formData.peso_liquido.toString()}
          setWeightNet={(value) => handleInputChange('peso_liquido', parseFloat(value) || 0)}
          transporterId={formData.transportadora_id}
          setTransporterId={(value) => handleInputChange('transportadora_id', value)}
        />

        <ObservacoesSection 
          observacoes={formData.observacoes}
          setObservacoes={(observacoes) => handleInputChange('observacoes', observacoes)}
        />

        <div className="flex justify-end gap-4">
          <Button 
            type="submit" 
            disabled={isSubmitting || itens.length === 0}
            className="min-w-[150px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Emitindo...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Emitir NFe
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
