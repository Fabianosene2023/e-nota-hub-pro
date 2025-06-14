
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Search, 
  Settings,
  Edit,
  Trash2
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useServicosManager, useCreateServicoManager, useUpdateServicoManager, useDeleteServicoManager } from "@/hooks/useServicosManager";
import { useEmpresasManager } from "@/hooks/useEmpresasManager";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { toast } from "@/hooks/use-toast";

export function CadastroServicos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingServico, setEditingServico] = useState<any>(null);
  const [deletingServicoId, setDeletingServicoId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    empresa_id: "",
    codigo: "",
    nome: "",
    descricao: "",
    preco_unitario: "",
    unidade: "UN",
    aliquota_iss: "",
    codigo_servico_municipal: ""
  });

  const { data: servicos = [], isLoading } = useServicosManager();
  const { data: empresas = [] } = useEmpresasManager();
  const createServico = useCreateServicoManager();
  const updateServico = useUpdateServicoManager();
  const deleteServico = useDeleteServicoManager();

  const filteredServicos = servicos.filter(servico =>
    servico.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    servico.codigo?.includes(searchTerm) ||
    servico.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      empresa_id: "",
      codigo: "",
      nome: "",
      descricao: "",
      preco_unitario: "",
      unidade: "UN",
      aliquota_iss: "",
      codigo_servico_municipal: ""
    });
  };

  const handleCreate = () => {
    if (!formData.empresa_id || !formData.codigo || !formData.nome || !formData.preco_unitario) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const servicoData = {
      ...formData,
      preco_unitario: parseFloat(formData.preco_unitario),
      aliquota_iss: formData.aliquota_iss ? parseFloat(formData.aliquota_iss) : 0
    };

    createServico.mutate(servicoData, {
      onSuccess: () => {
        setIsDialogOpen(false);
        resetForm();
      }
    });
  };

  const handleEdit = (servico: any) => {
    setEditingServico(servico);
    setFormData({
      empresa_id: servico.empresa_id || "",
      codigo: servico.codigo || "",
      nome: servico.nome || "",
      descricao: servico.descricao || "",
      preco_unitario: servico.preco_unitario?.toString() || "",
      unidade: servico.unidade || "UN",
      aliquota_iss: servico.aliquota_iss?.toString() || "",
      codigo_servico_municipal: servico.codigo_servico_municipal || ""
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!formData.empresa_id || !formData.codigo || !formData.nome || !formData.preco_unitario) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const servicoData = {
      ...formData,
      preco_unitario: parseFloat(formData.preco_unitario),
      aliquota_iss: formData.aliquota_iss ? parseFloat(formData.aliquota_iss) : 0
    };

    updateServico.mutate({
      id: editingServico.id,
      updates: servicoData
    }, {
      onSuccess: () => {
        setIsEditDialogOpen(false);
        setEditingServico(null);
        resetForm();
      }
    });
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

  const getEmpresaNome = (empresaId: string) => {
    const empresa = empresas.find(e => e.id === empresaId);
    return empresa?.razao_social || "Empresa não encontrada";
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Serviço
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Serviço</DialogTitle>
              <DialogDescription>
                Preencha os dados do serviço
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="empresa">Empresa *</Label>
                <Select value={formData.empresa_id} onValueChange={(value) => setFormData({...formData, empresa_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {empresas.map((empresa) => (
                      <SelectItem key={empresa.id} value={empresa.id}>
                        {empresa.razao_social}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="codigo">Código *</Label>
                  <Input 
                    id="codigo" 
                    placeholder="Digite o código"
                    value={formData.codigo}
                    onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome *</Label>
                  <Input 
                    id="nome" 
                    placeholder="Digite o nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea 
                  id="descricao" 
                  placeholder="Digite a descrição"
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preco">Preço Unitário *</Label>
                  <Input 
                    id="preco" 
                    placeholder="0,00"
                    type="number"
                    step="0.01"
                    value={formData.preco_unitario}
                    onChange={(e) => setFormData({...formData, preco_unitario: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unidade">Unidade</Label>
                  <Select value={formData.unidade} onValueChange={(value) => setFormData({...formData, unidade: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a unidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UN">Unidade</SelectItem>
                      <SelectItem value="HR">Hora</SelectItem>
                      <SelectItem value="DIA">Dia</SelectItem>
                      <SelectItem value="MES">Mês</SelectItem>
                      <SelectItem value="ANO">Ano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aliquota">Alíquota ISS (%)</Label>
                  <Input 
                    id="aliquota" 
                    placeholder="0,00"
                    type="number"
                    step="0.01"
                    value={formData.aliquota_iss}
                    onChange={(e) => setFormData({...formData, aliquota_iss: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="codigoMunicipal">Código Serviço Municipal</Label>
                <Input 
                  id="codigoMunicipal" 
                  placeholder="Digite o código municipal"
                  value={formData.codigo_servico_municipal}
                  onChange={(e) => setFormData({...formData, codigo_servico_municipal: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleCreate}
                disabled={createServico.isPending}
              >
                {createServico.isPending ? "Cadastrando..." : "Cadastrar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Serviço</DialogTitle>
            <DialogDescription>
              Atualize os dados do serviço
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editEmpresa">Empresa *</Label>
              <Select value={formData.empresa_id} onValueChange={(value) => setFormData({...formData, empresa_id: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a empresa" />
                </SelectTrigger>
                <SelectContent>
                  {empresas.map((empresa) => (
                    <SelectItem key={empresa.id} value={empresa.id}>
                      {empresa.razao_social}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editCodigo">Código *</Label>
                <Input 
                  id="editCodigo" 
                  placeholder="Digite o código"
                  value={formData.codigo}
                  onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editNome">Nome *</Label>
                <Input 
                  id="editNome" 
                  placeholder="Digite o nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleUpdate}
              disabled={updateServico.isPending}
            >
              {updateServico.isPending ? "Atualizando..." : "Atualizar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
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
      <div className="grid gap-4">
        {filteredServicos.map((servico) => (
          <Card key={servico.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{servico.nome}</CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-1">
                    <span>Código: {servico.codigo}</span>
                    <span>•</span>
                    <span>Empresa: {getEmpresaNome(servico.empresa_id)}</span>
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="fiscal-success">Ativo</Badge>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(servico)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Preço Unitário</p>
                  <p className="font-medium">R$ {Number(servico.preco_unitario).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Unidade</p>
                  <p className="font-medium">{servico.unidade}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Alíquota ISS</p>
                  <p className="font-medium">{Number(servico.aliquota_iss || 0).toFixed(2)}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cód. Municipal</p>
                  <p className="font-medium">{servico.codigo_servico_municipal || 'Não informado'}</p>
                </div>
              </div>
              {servico.descricao && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">Descrição</p>
                  <p className="font-medium">{servico.descricao}</p>
                </div>
              )}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Configurar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDeleteClick(servico.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredServicos.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum serviço encontrado</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "Tente ajustar sua busca" : "Cadastre o primeiro serviço para começar"}
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Cadastrar Serviço
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
