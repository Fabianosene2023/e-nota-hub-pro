
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, FileText } from "lucide-react";
import { DadosGeraisSection } from './DadosGeraisSection';
import { ItensServicoSection } from './ItensServicoSection';
import { ObservacoesSection } from './ObservacoesSection';
import { useFormValidation } from './hooks/useFormValidation';
import { useNFSeSubmit } from './hooks/useNFSeSubmit';
import { toast } from '@/hooks/use-toast';

interface ItemNFSe {
  servico_id: string;
  item_nome: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  codigo_servico: string;
  aliquota_iss: number;
}

interface FormData {
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
}

export const EmissaoNFSeForm = () => {
  const [formData, setFormData] = useState<FormData>({
    empresa_id: '',
    cliente_id: '',
    numero: '',
    serie: 1,
    natureza_operacao: 'Prestação de serviços',
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
    data_cancelamento: ''
  });
  
  const [itens, setItens] = useState<ItemNFSe[]>([]);
  const { validateForm } = useFormValidation();
  const { submitNFSe, isSubmitting } = useNFSeSubmit();

  const valorTotalNota = itens.reduce((total, item) => total + item.valor_total, 0);

  const resetForm = () => {
    setFormData(prev => ({
      empresa_id: prev.empresa_id, // Manter empresa selecionada
      cliente_id: '',
      numero: '',
      serie: 1,
      natureza_operacao: 'Prestação de serviços',
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
      data_cancelamento: ''
    }));
    setItens([]);
  };

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

    try {
      const success = await submitNFSe(formData, itens, valorTotalNota);
      if (success) {
        resetForm();
      }
    } catch (error) {
      // Error already handled in useNFSeSubmit
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Emissão de NFSe</h2>
          <p className="text-muted-foreground">
            Emita notas fiscais de serviços eletrônicas
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <DadosGeraisSection 
          formData={formData}
          setFormData={setFormData}
        />

        <ItensServicoSection 
          itens={itens}
          setItens={setItens}
          empresaId={formData.empresa_id}
          valorTotalNota={valorTotalNota}
        />

        <ObservacoesSection 
          observacoes={formData.observacoes}
          setObservacoes={(observacoes) => setFormData({...formData, observacoes})}
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
                Emitir NFSe
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
