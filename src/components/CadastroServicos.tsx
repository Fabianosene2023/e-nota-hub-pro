
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { ServicoFormDialog } from "./CadastroServicos/ServicoFormDialog";
import { ServicosList } from "./CadastroServicos/ServicosList";
import { useServicosManager, useDeleteServicoManager } from "@/hooks/useServicosManager";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";

export function CadastroServicos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingServico, setEditingServico] = useState<any>(null);
  const [deletingServicoId, setDeletingServicoId] = useState<string | null>(null);

  const { data: servicos = [], isLoading } = useServicosManager();
  const deleteServico = useDeleteServicoManager();

  const filteredServicos = servicos.filter(servico =>
    servico.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    servico.codigo?.includes(searchTerm) ||
    servico.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (servico: any) => {
    setEditingServico(servico);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (servicoId: string) => {
    setDeletingServicoId(servicoId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingServicoId) {
      deleteServico.mutate(deletingServicoId, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setDeletingServicoId(null);
        }
      });
    }
  };

  const handleDialogSuccess = () => {
    setIsDialogOpen(false);
    setIsEditDialogOpen(false);
    setEditingServico(null);
  };

  if (isLoading) {
    return <div>Carregando serviços...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cadastro de Serviços</h1>
          <p className="text-muted-foreground">
            Gerencie os serviços cadastrados
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Serviço
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome, código ou descrição..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Services List */}
      <ServicosList
        servicos={filteredServicos}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onNewService={() => setIsDialogOpen(true)}
      />

      {/* Dialogs */}
      <ServicoFormDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={handleDialogSuccess}
      />

      <ServicoFormDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        isEdit={true}
        editingServico={editingServico}
        onSuccess={handleDialogSuccess}
      />

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Excluir Serviço"
        description="Tem certeza que deseja excluir este serviço? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={handleDeleteConfirm}
        variant="destructive"
      />
    </div>
  );
}
