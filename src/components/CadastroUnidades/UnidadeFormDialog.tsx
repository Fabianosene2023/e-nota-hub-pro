
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/common/FormField';
import { useUnidadesMedidaManager } from '@/hooks/useUnidadesMedida';
import { toast } from '@/hooks/use-toast';

interface UnidadeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unidade?: {
    id: string;
    codigo: string;
    descricao: string;
    created_at: string;
  } | null;
}

export const UnidadeFormDialog: React.FC<UnidadeFormDialogProps> = ({
  open,
  onOpenChange,
  unidade,
}) => {
  const { createUnidade, updateUnidade } = useUnidadesMedidaManager();
  const isEditing = !!unidade;

  const [formData, setFormData] = React.useState({
    codigo: '',
    descricao: '',
  });

  React.useEffect(() => {
    if (open) {
      if (unidade) {
        console.log('Preenchendo formulário para edição:', unidade);
        setFormData({
          codigo: unidade.codigo || '',
          descricao: unidade.descricao || '',
        });
      } else {
        console.log('Limpando formulário para nova unidade');
        setFormData({
          codigo: '',
          descricao: '',
        });
      }
    }
  }, [unidade, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.codigo.trim() || !formData.descricao.trim()) {
      toast({
        title: "Erro",
        description: "Código e descrição são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isEditing && unidade) {
        console.log('Atualizando unidade:', { id: unidade.id, ...formData });
        await updateUnidade.mutateAsync({
          id: unidade.id,
          ...formData,
        });
        toast({
          title: "Sucesso",
          description: "Unidade de medida atualizada com sucesso",
        });
      } else {
        console.log('Criando nova unidade:', formData);
        await createUnidade.mutateAsync(formData);
        toast({
          title: "Sucesso",
          description: "Unidade de medida criada com sucesso",
        });
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao salvar unidade:', error);
      toast({
        title: "Erro",
        description: `Erro ao ${isEditing ? 'atualizar' : 'criar'} unidade de medida`,
        variant: "destructive",
      });
    }
  };

  const isLoading = createUnidade.isPending || updateUnidade.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Unidade de Medida' : 'Nova Unidade de Medida'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            type="input"
            label="Código"
            value={formData.codigo}
            onChange={(value) => setFormData(prev => ({ ...prev, codigo: value }))}
            required
            placeholder="Digite o código da unidade (ex: UN, KG, MT)"
          />

          <FormField
            type="input"
            label="Descrição"
            value={formData.descricao}
            onChange={(value) => setFormData(prev => ({ ...prev, descricao: value }))}
            required
            placeholder="Digite a descrição da unidade"
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading 
                ? (isEditing ? 'Atualizando...' : 'Criando...') 
                : (isEditing ? 'Atualizar' : 'Criar')
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
