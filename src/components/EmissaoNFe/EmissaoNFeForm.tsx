
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, FileText } from "lucide-react";
import { DadosGeraisSection } from './DadosGeraisSection';
import { ItensSection } from './ItensSection';
import { ObservacoesSection } from './ObservacoesSection';
import { useCreateNotaFiscalMutation } from '@/hooks/nfe/useNotasFiscaisMutations';
import { useCreateLog } from '@/hooks/useLogsOperacoes';
import { toast } from '@/hooks/use-toast';

interface ItemNFe {
  produto_id?: string;
  servico_id?: string;
  item_nome: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  cfop: string;
  tipo: 'produto' | 'servico';
}

interface FormData {
  empresa_id: string;
  cliente_id: string;
  numero: string;
  serie: number;
  natureza_operacao: string;
  observacoes: string;
  tipo_pessoa: 'fisica' | 'juridica';
}

export const EmissaoNFeForm = () => {
  const [formData, setFormData] = useState<FormData>({
    empresa_id: '',
    cliente_id: '',
    numero: '',
    serie: 1,
    natureza_operacao: 'Venda de mercadoria adquirida ou produzida pelo estabelecimento',
    observacoes: '',
    tipo_pessoa: 'juridica'
  });
  
  const [itens, setItens] = useState<ItemNFe[]>([]);
  const createNotaFiscal = useCreateNotaFiscalMutation();
  const createLog = useCreateLog();

  const valorTotalNota = itens.reduce((total, item) => total + item.valor_total, 0);

  const validateForm = (): string | null => {
    if (!formData.empresa_id) return "Selecione uma empresa";
    if (!formData.cliente_id) return "Selecione um cliente";
    if (!formData.numero) return "Informe o número da nota";
    if (itens.length === 0) return "Adicione pelo menos um item";
    
    // Validar itens
    for (const item of itens) {
      if (item.quantidade <= 0) return "Quantidade deve ser maior que zero";
      if (item.valor_unitario <= 0) return "Valor unitário deve ser maior que zero";
      if (!item.cfop) return "CFOP é obrigatório";
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      toast({
        title: "Erro de Validação",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    try {
      // Preparar dados para emissão
      const dadosNFe = {
        empresa_id: formData.empresa_id,
        cliente_id: formData.cliente_id,
        numero: parseInt(formData.numero),
        serie: formData.serie,
        valor_total: valorTotalNota,
        natureza_operacao: formData.natureza_operacao,
        observacoes: formData.observacoes,
        itens: itens.map(item => ({
          ...(item.produto_id ? { produto_id: item.produto_id } : {}),
          ...(item.servico_id ? { servico_id: item.servico_id } : {}),
          quantidade: item.quantidade,
          valor_unitario: item.valor_unitario,
          valor_total: item.valor_total,
          cfop: item.cfop
        }))
      };

      console.log('Emitindo NFe com dados:', dadosNFe);

      const resultado = await createNotaFiscal.mutateAsync(dadosNFe);
      
      if (resultado?.data) {
        // Registrar log da operação
        await createLog.mutateAsync({
          empresa_id: formData.empresa_id,
          tipo_operacao: 'nfe_emissao',
          descricao: `NFe ${formData.numero} emitida com sucesso`,
          dados_operacao: { 
            numero: formData.numero,
            valor_total: valorTotalNota,
            cliente_id: formData.cliente_id
          }
        });

        // Limpar formulário
        setFormData({
          empresa_id: formData.empresa_id, // Manter empresa selecionada
          cliente_id: '',
          numero: '',
          serie: 1,
          natureza_operacao: 'Venda de mercadoria adquirida ou produzida pelo estabelecimento',
          observacoes: '',
          tipo_pessoa: 'juridica'
        });
        setItens([]);
        
        toast({
          title: "Sucesso!",
          description: "NFe emitida com sucesso",
        });
      }
    } catch (error) {
      console.error('Erro ao emitir NFe:', error);
      
      // Log do erro
      await createLog.mutateAsync({
        empresa_id: formData.empresa_id || 'unknown',
        tipo_operacao: 'nfe_emissao_erro',
        descricao: `Erro ao emitir NFe ${formData.numero}`,
        dados_operacao: { 
          erro: error instanceof Error ? error.message : 'Erro desconhecido',
          numero: formData.numero
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Emissão de NFe</h2>
          <p className="text-muted-foreground">
            Emita notas fiscais eletrônicas com integração SEFAZ
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <DadosGeraisSection 
          formData={formData}
          setFormData={setFormData}
        />

        <ItensSection 
          itens={itens}
          setItens={setItens}
          empresaId={formData.empresa_id}
          valorTotalNota={valorTotalNota}
        />

        <ObservacoesSection 
          observacoes={formData.observacoes}
          setObservacoes={(observacoes) => setFormData({...formData, observacoes})}
        />

        {/* Botões */}
        <div className="flex justify-end gap-4">
          <Button 
            type="submit" 
            disabled={createNotaFiscal.isPending || itens.length === 0}
            className="min-w-[150px]"
          >
            {createNotaFiscal.isPending ? (
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
