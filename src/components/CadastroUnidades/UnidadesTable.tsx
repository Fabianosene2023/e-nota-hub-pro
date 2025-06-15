
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

export const UnidadesTable: React.FC = () => {
  const { data: unidades, isLoading } = useUnidadesMedida();
  const { deleteUnidade } = useUnidadesMedidaManager();
  
  const [editingUnidade, setEditingUnidade] = React.useState<any>(null);
  const [deletingUnidade, setDeletingUnidade] = React.useState<any>(null);

  const handleEdit = (unidade: any) => {
    setEditingUnidade(unidade);
  };

  const handleDelete = async () => {
    if (!deletingUnidade) return;
    
    try {
      await deleteUnidade.mutateAsync(deletingUnidade.id);
      setDeletingUnidade(null);
    } catch (error) {
      console.error('Erro ao deletar unidade:', error);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Carregando unidades...</div>;
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
                    onClick={() => setDeletingUnidade(unidade)}
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
        onConfirm={handleDelete}
        title="Excluir Unidade de Medida"
        description={`Tem certeza que deseja excluir a unidade "${deletingUnidade?.codigo} - ${deletingUnidade?.descricao}"? Esta ação não pode ser desfeita.`}
        variant="destructive"
      />
    </>
  );
};
