
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoriasTable } from '@/components/CadastroCategorias/CategoriasTable';
import { CategoriaFormDialog } from '@/components/CadastroCategorias/CategoriaFormDialog';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CadastroCategorias() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Cadastro de Categorias</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Categoria
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Categorias Cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoriasTable />
        </CardContent>
      </Card>

      <CategoriaFormDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}
