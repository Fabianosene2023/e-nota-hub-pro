
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, FileText } from "lucide-react";
import { DadosPrestadorSection } from './DadosPrestadorSection';
import { DadosTomadorSection } from './DadosTomadorSection';
import { ItensServicoSection } from './ItensServicoSection';
import { ObservacoesSection } from './ObservacoesSection';
import { useFormValidation } from './hooks/useFormValidation';
import { useEmitirRpsNfse } from '@/hooks/useRpsNfse';
import { toast } from '@/hooks/use-toast';

interface ItemNFSe {
  servico_id?: string;
  descricao: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  codigo_servico?: string;
  aliquota_iss: number;
}

interface FormData {
  prestador_id: string;
  tomador_nome: string;
  tomador_cnpj_cpf: string;
  tomador_endereco: string;
  tomador_email: string;
  discriminacao: string;
}

export const EmissaoNFSeForm = () => {
  const [formData, setFormData] = useState<FormData>({
    prestador_id: '',
    tomador_nome: '',
    tomador_cnpj_cpf: '',
    tomador_endereco: '',
    tomador_email: '',
    discriminacao: ''
  });
  
  const [itens, setItens] = useState<ItemNFSe[]>([]);
  const { validateForm } = useFormValidation();
  const emitirRps = useEmitirRpsNfse();

  const valorTotalNota = itens.reduce((total, item) => total + item.valor_total, 0);

  const resetForm = () => {
    setFormData({
      prestador_id: '',
      tomador_nome: '',
      tomador_cnpj_cpf: '',
      tomador_endereco: '',
      tomador_email: '',
      discriminacao: ''
    });
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
      await emitirRps.mutateAsync({
        prestador_id: formData.prestador_id,
        tomador_nome: formData.tomador_nome,
        tomador_cnpj_cpf: formData.tomador_cnpj_cpf,
        tomador_endereco: formData.tomador_endereco,
        tomador_email: formData.tomador_email,
        discriminacao: formData.discriminacao,
        itens
      });
      
      resetForm();
    } catch (error) {
      // Error already handled in hook
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
        <DadosPrestadorSection 
          prestadorId={formData.prestador_id}
          setPrestadorId={(id) => setFormData({...formData, prestador_id: id})}
        />

        <DadosTomadorSection 
          formData={formData}
          setFormData={setFormData}
        />

        <ItensServicoSection 
          itens={itens}
          setItens={setItens}
          valorTotalNota={valorTotalNota}
        />

        <ObservacoesSection 
          discriminacao={formData.discriminacao}
          setDiscriminacao={(discriminacao) => setFormData({...formData, discriminacao})}
        />

        <div className="flex justify-end gap-4">
          <Button 
            type="submit" 
            disabled={emitirRps.isPending || itens.length === 0}
            className="min-w-[150px]"
          >
            {emitirRps.isPending ? (
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
