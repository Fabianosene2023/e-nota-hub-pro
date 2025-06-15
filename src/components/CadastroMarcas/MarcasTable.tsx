
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
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { useMarcas, useMarcasManager } from '@/hooks/useMarcas';
import { toast } from '@/hooks/use-toast';
import { MarcaFormDialog } from './MarcaFormDialog';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';

export const MarcasTable: React.FC = () => {
  const { data: marcas, isLoading } = useMarcas();
  const { deleteMarca } = useMarcasManager();
  
  const [editingMarca, setEditingMarca] = React.useState<any>(null);
  const [deletingMarca, setDeletingMarca] = React.useState<any>(null);

  const handleEdit = (marca: any) => {
    setEditingMarca(marca);
  };

  const handleDelete = async () => {
    if (!deletingMarca) return;
    
    try {
      await deleteMarca.mutateAsync(deletingMarca.id);
      setDeletingMarca(null);
    } catch (error) {
      console.error('Erro ao deletar marca:', error);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Carregando marcas...</div>;
  }

  if (!marcas || marcas.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhuma marca cadastrada
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data de Criação</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {marcas.map((marca) => (
            <TableRow key={marca.id}>
              <TableCell className="font-medium">{marca.nome}</TableCell>
              <TableCell>{marca.descricao || '-'}</TableCell>
              <TableCell>
                <Badge variant={marca.ativo ? 'default' : 'secondary'}>
                  {marca.ativo ? 'Ativo' : 'Inativo'}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(marca.created_at).toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(marca)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeletingMarca(marca)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <MarcaFormDialog
        open={!!editingMarca}
        onOpenChange={(open) => !open && setEditingMarca(null)}
        marca={editingMarca}
      />

      <ConfirmationDialog
        open={!!deletingMarca}
        onOpenChange={(open) => !open && setDeletingMarca(null)}
        onConfirm={handleDelete}
        title="Excluir Marca"
        description={`Tem certeza que deseja excluir a marca "${deletingMarca?.nome}"? Esta ação não pode ser desfeita.`}
      />
    </>
  );
};
