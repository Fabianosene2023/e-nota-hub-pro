
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
import { useCategorias, useCategoriasManager } from '@/hooks/useCategorias';
import { toast } from '@/hooks/use-toast';
import { CategoriaFormDialog } from './CategoriaFormDialog';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';

export const CategoriasTable: React.FC = () => {
  const { data: categorias, isLoading } = useCategorias();
  const { deleteCategoria } = useCategoriasManager();
  
  const [editingCategoria, setEditingCategoria] = React.useState<any>(null);
  const [deletingCategoria, setDeletingCategoria] = React.useState<any>(null);

  const handleEdit = (categoria: any) => {
    setEditingCategoria(categoria);
  };

  const handleDelete = async () => {
    if (!deletingCategoria) return;
    
    try {
      await deleteCategoria.mutateAsync(deletingCategoria.id);
      setDeletingCategoria(null);
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Carregando categorias...</div>;
  }

  if (!categorias || categorias.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhuma categoria cadastrada
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
          {categorias.map((categoria) => (
            <TableRow key={categoria.id}>
              <TableCell className="font-medium">{categoria.nome}</TableCell>
              <TableCell>{categoria.descricao || '-'}</TableCell>
              <TableCell>
                <Badge variant={categoria.ativo ? 'default' : 'secondary'}>
                  {categoria.ativo ? 'Ativo' : 'Inativo'}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(categoria.created_at).toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(categoria)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeletingCategoria(categoria)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <CategoriaFormDialog
        open={!!editingCategoria}
        onOpenChange={(open) => !open && setEditingCategoria(null)}
        categoria={editingCategoria}
      />

      <ConfirmationDialog
        open={!!deletingCategoria}
        onOpenChange={(open) => !open && setDeletingCategoria(null)}
        onConfirm={handleDelete}
        title="Excluir Categoria"
        description={`Tem certeza que deseja excluir a categoria "${deletingCategoria?.nome}"? Esta ação não pode ser desfeita.`}
      />
    </>
  );
};
