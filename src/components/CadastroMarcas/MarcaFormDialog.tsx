
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/common/FormField';
import { useMarcasManager } from '@/hooks/useMarcas';
import { toast } from '@/hooks/use-toast';

interface MarcaFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  marca?: any;
}

export const MarcaFormDialog: React.FC<MarcaFormDialogProps> = ({
  open,
  onOpenChange,
  marca,
}) => {
  const { createMarca, updateMarca } = useMarcasManager();
  const isEditing = !!marca;

  const [formData, setFormData] = React.useState({
    nome: '',
    descricao: '',
    ativo: true,
  });

  React.useEffect(() => {
    if (marca) {
      setFormData({
        nome: marca.nome || '',
        descricao: marca.descricao || '',
        ativo: marca.ativo ?? true,
      });
    } else {
      setFormData({
        nome: '',
        descricao: '',
        ativo: true,
      });
    }
  }, [marca]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome.trim()) {
      toast({
        title: "Erro",
        description: "Nome da marca é obrigatório",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isEditing) {
        await updateMarca.mutateAsync({
          id: marca.id,
          ...formData,
        });
      } else {
        await createMarca.mutateAsync(formData);
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao salvar marca:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Marca' : 'Nova Marca'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            type="input"
            label="Nome"
            value={formData.nome}
            onChange={(value) => setFormData(prev => ({ ...prev, nome: value }))}
            required
            placeholder="Digite o nome da marca"
          />

          <FormField
            type="textarea"
            label="Descrição"
            value={formData.descricao}
            onChange={(value) => setFormData(prev => ({ ...prev, descricao: value }))}
            placeholder="Digite uma descrição para a marca (opcional)"
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
              disabled={createMarca.isPending || updateMarca.isPending}
            >
              {isEditing ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
