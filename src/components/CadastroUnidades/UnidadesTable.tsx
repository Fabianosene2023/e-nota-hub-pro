
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { useUnidadesMedida, useUnidadesMedidaManager } from '@/hooks/useUnidadesMedida';
import { UnidadeFormDialog } from './UnidadeFormDialog';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';
import { toast } from '@/hooks/use-toast';

interface Unidade {
  id: string;
  codigo: string;
  descricao: string;
  created_at: string;
}

export const UnidadesTable: React.FC = () => {
  const { data: unidades, isLoading, error } = useUnidadesMedida();
  const { deleteUnidade } = useUnidadesMedidaManager();
  
  const [editingUnidade, setEditingUnidade] = React.useState<Unidade | null>(null);
  const [deletingUnidade, setDeletingUnidade] = React.useState<Unidade | null>(null);

  const handleEdit = (unidade: Unidade) => {
    console.log('Editando unidade:', unidade);
    setEditingUnidade(unidade);
  };

  const handleDeleteClick = (unidade: Unidade) => {
    console.log('Solicitando exclusão da unidade:', unidade);
    setDeletingUnidade(unidade);
  };

  const handleConfirmDelete = async () => {
    if (!deletingUnidade) return;
    
    console.log('Confirmando exclusão da unidade:', deletingUnidade);
    try {
      await deleteUnidade.mutateAsync(deletingUnidade.id);
      setDeletingUnidade(null);
      toast({
        title: "Sucesso",
        description: "Unidade de medida removida com sucesso",
      });
    } catch (error) {
      console.error('Erro ao deletar unidade:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover unidade de medida",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Carregando unidades...</div>;
  }

  if (error) {
    console.error('Erro ao carregar unidades:', error);
    return (
      <div className="text-center py-8 text-red-500">
        Erro ao carregar unidades de medida
      </div>
    );
  }

  if (!unidades || unidades.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhuma unidade de medida cadastrada
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Data de Criação</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {unidades.map((unidade) => (
            <TableRow key={unidade.id}>
              <TableCell className="font-medium">{unidade.codigo}</TableCell>
              <TableCell>{unidade.descricao}</TableCell>
              <TableCell>
                {new Date(unidade.created_at).toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(unidade)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteClick(unidade)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <UnidadeFormDialog
        open={!!editingUnidade}
        onOpenChange={(open) => !open && setEditingUnidade(null)}
        unidade={editingUnidade}
      />

      <ConfirmationDialog
        open={!!deletingUnidade}
        onOpenChange={(open) => !open && setDeletingUnidade(null)}
        onConfirm={handleConfirmDelete}
        title="Excluir Unidade de Medida"
        description={`Tem certeza que deseja excluir a unidade "${deletingUnidade?.codigo} - ${deletingUnidade?.descricao}"? Esta ação não pode ser desfeita.`}
        variant="destructive"
      />
    </>
  );
};
