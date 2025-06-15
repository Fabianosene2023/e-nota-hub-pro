
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/common/FormField';
import { useCategoriasManager } from '@/hooks/useCategorias';
import { toast } from '@/hooks/use-toast';

interface CategoriaFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoria?: any;
}

export const CategoriaFormDialog: React.FC<CategoriaFormDialogProps> = ({
  open,
  onOpenChange,
  categoria,
}) => {
  const { createCategoria, updateCategoria } = useCategoriasManager();
  const isEditing = !!categoria;

  const [formData, setFormData] = React.useState({
    nome: '',
    descricao: '',
    ativo: true,
  });

  React.useEffect(() => {
    if (categoria) {
      setFormData({
        nome: categoria.nome || '',
        descricao: categoria.descricao || '',
        ativo: categoria.ativo ?? true,
      });
    } else {
      setFormData({
        nome: '',
        descricao: '',
        ativo: true,
      });
    }
  }, [categoria]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome.trim()) {
      toast({
        title: "Erro",
        description: "Nome da categoria é obrigatório",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isEditing) {
        await updateCategoria.mutateAsync({
          id: categoria.id,
          ...formData,
        });
      } else {
        await createCategoria.mutateAsync(formData);
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Categoria' : 'Nova Categoria'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            type="input"
            label="Nome"
            value={formData.nome}
            onChange={(value) => setFormData(prev => ({ ...prev, nome: value }))}
            required
            placeholder="Digite o nome da categoria"
          />

          <FormField
            type="textarea"
            label="Descrição"
            value={formData.descricao}
            onChange={(value) => setFormData(prev => ({ ...prev, descricao: value }))}
            placeholder="Digite uma descrição para a categoria (opcional)"
            rows={3}
          />

          <FormField
            type="select"
            label="Status"
            value={formData.ativo ? 'true' : 'false'}
            onChange={(value) => setFormData(prev => ({ ...prev, ativo: value === 'true' }))}
            options={[
              { value: 'true', label: 'Ativo' },
              { value: 'false', label: 'Inativo' },
            ]}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createCategoria.isPending || updateCategoria.isPending}
            >
              {isEditing ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
