
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MarcasTable } from '@/components/CadastroMarcas/MarcasTable';
import { MarcaFormDialog } from '@/components/CadastroMarcas/MarcaFormDialog';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CadastroMarcas() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Cadastro de Marcas</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Marca
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Marcas Cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          <MarcasTable />
        </CardContent>
      </Card>

      <MarcaFormDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}
