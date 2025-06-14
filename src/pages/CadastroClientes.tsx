
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus } from "lucide-react";
import { ClienteForm } from "@/components/CadastroClientes/ClienteForm";
import { ClientesTable } from "@/components/CadastroClientes/ClientesTable";
import { useAuth } from "@/contexts/AuthContext";
import { useEmpresas } from "@/hooks/useEmpresas";
import { useCadastroClientesForm } from "@/hooks/useCadastroClientesForm";

export default function CadastroClientes() {
  const { profile } = useAuth();
  const { data: empresas } = useEmpresas();
  const empresaId = profile?.empresa_id || empresas?.[0]?.id;

  const {
    form,
    isDialogOpen,
    setIsDialogOpen,
    editingCliente,
    searchTerm,
    setSearchTerm,
    filteredClientes,
    isLoading,
    buttonState,
    handleSubmit,
    handleEdit,
    handleDelete,
    openDialog,
    deleteLoading,
  } = useCadastroClientesForm({ empresaId });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Cadastro de Clientes</h1>
          <p className="text-muted-foreground">Gerencie os clientes da sua empresa</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) form.reset(); setIsDialogOpen(open); }}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingCliente ? "Editar Cliente" : "Novo Cliente"}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados do cliente
              </DialogDescription>
            </DialogHeader>
            <ClienteForm
              form={form}
              onSubmit={handleSubmit}
              buttonState={buttonState}
              isEdit={!!editingCliente}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <Input
                placeholder="Buscar por nome ou CPF/CNPJ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Carregando...</div>
          ) : (
            <ClientesTable
              clientes={filteredClientes}
              onEdit={handleEdit}
              onDelete={handleDelete}
              deleteLoading={deleteLoading}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
