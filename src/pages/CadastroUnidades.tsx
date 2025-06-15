
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UnidadesTable } from '@/components/CadastroUnidades/UnidadesTable';
import { UnidadeFormDialog } from '@/components/CadastroUnidades/UnidadeFormDialog';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CadastroUnidades() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Cadastro de Unidades de Medida</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Unidade
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Unidades de Medida Cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          <UnidadesTable />
        </CardContent>
      </Card>

      <UnidadeFormDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}
