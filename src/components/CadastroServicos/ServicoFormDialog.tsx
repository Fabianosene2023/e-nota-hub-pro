
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ServicoBasicFields } from "./ServicoBasicFields";
import { ServicoValuesFields } from "./ServicoValuesFields";
import { ServicoTaxFields } from "./ServicoTaxFields";
import { ServicoLocationFields } from "./ServicoLocationFields";
import { ServicoTributationFields } from "./ServicoTributationFields";
import { ServicoDetailsFields } from "./ServicoDetailsFields";
import { useCreateServicoManager, useUpdateServicoManager } from "@/hooks/useServicosManager";
import { toast } from "@/hooks/use-toast";

interface ServicoFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit?: boolean;
  editingServico?: any;
  onSuccess: () => void;
}

export function ServicoFormDialog({ 
  isOpen, 
  onOpenChange, 
  isEdit = false, 
  editingServico, 
  onSuccess 
}: ServicoFormDialogProps) {
  const [formData, setFormData] = useState(() => {
    if (isEdit && editingServico) {
      console.log('=== Carregando dados do serviço para edição ===');
      console.log('Serviço completo:', editingServico);
      console.log('Código NBS:', editingServico.codigo_tributacao_nacional);
      console.log('Item NBS:', editingServico.item_nbs);
      
      return {
        empresa_id: editingServico.empresa_id || "",
        codigo: editingServico.codigo || "",
        nome: editingServico.nome || "",
        descricao: editingServico.descricao || "",
        preco_unitario: editingServico.preco_unitario?.toString() || "",
        unidade: editingServico.unidade || "UN",
        aliquota_iss: editingServico.aliquota_iss?.toString() || "",
        codigo_servico_municipal: editingServico.codigo_servico_municipal || "",
        local_prestacao: editingServico.local_prestacao || "",
        municipio_prestacao: editingServico.municipio_prestacao || "",
        codigo_tributacao_nacional: editingServico.codigo_tributacao_nacional || "",
        isencao_issqn: editingServico.isencao_issqn || false,
        descricao_servico: editingServico.descricao_servico || "",
        item_nbs: editingServico.item_nbs || "",
        numero_documento_responsabilidade_tecnica: editingServico.numero_documento_responsabilidade_tecnica || "",
        documento_referencia: editingServico.documento_referencia || "",
        informacoes_complementares: editingServico.informacoes_complementares || "",
        valor_servico_prestado: editingServico.valor_servico_prestado?.toString() || "",
        opcao_tributos: editingServico.opcao_tributos?.toString() || "3",
        valor_tributos_federais: editingServico.valor_tributos_federais?.toString() || "",
        valor_tributos_estaduais: editingServico.valor_tributos_estaduais?.toString() || "",
        valor_tributos_municipais: editingServico.valor_tributos_municipais?.toString() || "",
        percentual_tributos_federais: editingServico.percentual_tributos_federais?.toString() || "",
        percentual_tributos_estaduais: editingServico.percentual_tributos_estaduais?.toString() || "",
        percentual_tributos_municipais: editingServico.percentual_tributos_municipais?.toString() || ""
      };
    }
    
    console.log('=== Inicializando novo serviço ===');
    return {
      empresa_id: "",
      codigo: "",
      nome: "",
      descricao: "",
      preco_unitario: "",
      unidade: "UN",
      aliquota_iss: "",
      codigo_servico_municipal: "",
      local_prestacao: "",
      municipio_prestacao: "",
      codigo_tributacao_nacional: "",
      isencao_issqn: false,
      descricao_servico: "",
      item_nbs: "",
      numero_documento_responsabilidade_tecnica: "",
      documento_referencia: "",
      informacoes_complementares: "",
      valor_servico_prestado: "",
      opcao_tributos: "3",
      valor_tributos_federais: "",
      valor_tributos_estaduais: "",
      valor_tributos_municipais: "",
      percentual_tributos_federais: "",
      percentual_tributos_estaduais: "",
      percentual_tributos_municipais: ""
    };
  });

  const createServico = useCreateServicoManager();
  const updateServico = useUpdateServicoManager();

  const handleSubmit = () => {
    console.log('=== INÍCIO DO SUBMIT ===');
    console.log('Dados completos do formulário:', formData);
    console.log('NBS - Código:', formData.codigo_tributacao_nacional);
    console.log('NBS - Item:', formData.item_nbs);
    
    // Validação básica
    if (!formData.empresa_id || !formData.codigo || !formData.nome || !formData.preco_unitario) {
      console.log('=== ERRO DE VALIDAÇÃO ===');
      console.log('Campos obrigatórios faltando:', {
        empresa_id: !!formData.empresa_id,
        codigo: !!formData.codigo,
        nome: !!formData.nome,
        preco_unitario: !!formData.preco_unitario
      });
      
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios: Empresa, Código, Nome e Preço Unitário",
        variant: "destructive",
      });
      return;
    }

    // Preparar dados para salvar - garantindo que os campos NBS sejam preservados
    const servicoData = {
      ...formData,
      preco_unitario: parseFloat(formData.preco_unitario) || 0,
      aliquota_iss: formData.aliquota_iss ? parseFloat(formData.aliquota_iss) : 0,
      valor_servico_prestado: formData.valor_servico_prestado ? parseFloat(formData.valor_servico_prestado) : 0,
      opcao_tributos: parseInt(formData.opcao_tributos) || 3,
      valor_tributos_federais: formData.valor_tributos_federais ? parseFloat(formData.valor_tributos_federais) : 0,
      valor_tributos_estaduais: formData.valor_tributos_estaduais ? parseFloat(formData.valor_tributos_estaduais) : 0,
      valor_tributos_municipais: formData.valor_tributos_municipais ? parseFloat(formData.valor_tributos_municipais) : 0,
      percentual_tributos_federais: formData.percentual_tributos_federais ? parseFloat(formData.percentual_tributos_federais) : 0,
      percentual_tributos_estaduais: formData.percentual_tributos_estaduais ? parseFloat(formData.percentual_tributos_estaduais) : 0,
      percentual_tributos_municipais: formData.percentual_tributos_municipais ? parseFloat(formData.percentual_tributos_municipais) : 0,
      // Campos NBS - garantir que sejam enviados corretamente
      codigo_tributacao_nacional: formData.codigo_tributacao_nacional || null,
      item_nbs: formData.item_nbs || null,
      ativo: true
    };

    console.log('=== DADOS PROCESSADOS PARA SALVAR ===');
    console.log('Dados completos:', servicoData);
    console.log('Campos NBS específicos:', {
      codigo_tributacao_nacional: servicoData.codigo_tributacao_nacional,
      item_nbs: servicoData.item_nbs
    });

    if (isEdit && editingServico) {
      console.log('=== EXECUTANDO UPDATE ===');
      console.log('ID do serviço:', editingServico.id);
      
      updateServico.mutate({
        id: editingServico.id,
        updates: servicoData
      }, {
        onSuccess: (data) => {
          console.log('=== UPDATE SUCESSO ===');
          console.log('Dados retornados:', data);
          toast({
            title: "Sucesso!",
            description: "Serviço atualizado com sucesso",
          });
          onSuccess();
        },
        onError: (error) => {
          console.error('=== ERRO NO UPDATE ===');
          console.error('Erro completo:', error);
          toast({
            title: "Erro",
            description: "Erro ao atualizar serviço. Verifique os dados e tente novamente.",
            variant: "destructive",
          });
        }
      });
    } else {
      console.log('=== EXECUTANDO CREATE ===');
      
      createServico.mutate(servicoData, {
        onSuccess: (data) => {
          console.log('=== CREATE SUCESSO ===');
          console.log('Dados retornados:', data);
          toast({
            title: "Sucesso!",
            description: "Serviço criado com sucesso",
          });
          onSuccess();
        },
        onError: (error) => {
          console.error('=== ERRO NO CREATE ===');
          console.error('Erro completo:', error);
          toast({
            title: "Erro",
            description: "Erro ao criar serviço. Verifique os dados e tente novamente.",
            variant: "destructive",
          });
        }
      });
    }
    console.log('=== FIM DO SUBMIT ===');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar Serviço" : "Cadastrar Novo Serviço"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Atualize os dados do serviço" : "Preencha os dados do serviço"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <ServicoBasicFields formData={formData} setFormData={setFormData} />
          <ServicoValuesFields formData={formData} setFormData={setFormData} />
          <ServicoTaxFields formData={formData} setFormData={setFormData} />
          <ServicoLocationFields formData={formData} setFormData={setFormData} />
          <ServicoTributationFields formData={formData} setFormData={setFormData} />
          <ServicoDetailsFields formData={formData} setFormData={setFormData} />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={createServico.isPending || updateServico.isPending}
          >
            {(createServico.isPending || updateServico.isPending) 
              ? (isEdit ? "Atualizando..." : "Cadastrando...") 
              : (isEdit ? "Atualizar" : "Cadastrar")
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
