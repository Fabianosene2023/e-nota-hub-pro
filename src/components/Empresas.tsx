
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Building, 
  FileText, 
  Settings,
  Edit,
  Trash2
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEmpresasManager, useCreateEmpresaManager, useUpdateEmpresaManager, useDeleteEmpresaManager } from "@/hooks/useEmpresasManager";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { toast } from "@/hooks/use-toast";

export function Empresas() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingEmpresa, setEditingEmpresa] = useState<any>(null);
  const [deletingEmpresaId, setDeletingEmpresaId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    razao_social: "",
    nome_fantasia: "",
    cnpj: "",
    inscricao_estadual: "",
    regime_tributario: "simples_nacional",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    telefone: "",
    email: "",
    municipio_codigo: "",
    municipio_nome: ""
  });

  const { data: empresas = [], isLoading } = useEmpresasManager();
  const createEmpresa = useCreateEmpresaManager();
  const updateEmpresa = useUpdateEmpresaManager();
  const deleteEmpresa = useDeleteEmpresaManager();

  const filteredEmpresas = empresas.filter(empresa =>
    empresa.razao_social?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empresa.cnpj?.includes(searchTerm) ||
    empresa.nome_fantasia?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      razao_social: "",
      nome_fantasia: "",
      cnpj: "",
      inscricao_estadual: "",
      regime_tributario: "simples_nacional",
      endereco: "",
      cidade: "",
      estado: "",
      cep: "",
      telefone: "",
      email: "",
      municipio_codigo: "",
      municipio_nome: ""
    });
  };

  const handleCreate = () => {
    if (!formData.razao_social || !formData.cnpj || !formData.endereco || !formData.cidade || !formData.estado || !formData.cep) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    createEmpresa.mutate(formData, {
      onSuccess: () => {
        setIsDialogOpen(false);
        resetForm();
      }
    });
  };

  const handleEdit = (empresa: any) => {
    setEditingEmpresa(empresa);
    setFormData({
      razao_social: empresa.razao_social || "",
      nome_fantasia: empresa.nome_fantasia || "",
      cnpj: empresa.cnpj || "",
      inscricao_estadual: empresa.inscricao_estadual || "",
      regime_tributario: empresa.regime_tributario || "simples_nacional",
      endereco: empresa.endereco || "",
      cidade: empresa.cidade || "",
      estado: empresa.estado || "",
      cep: empresa.cep || "",
      telefone: empresa.telefone || "",
      email: empresa.email || "",
      municipio_codigo: empresa.municipio_codigo || "",
      municipio_nome: empresa.municipio_nome || ""
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!formData.razao_social || !formData.cnpj || !formData.endereco || !formData.cidade || !formData.estado || !formData.cep) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    updateEmpresa.mutate({
      id: editingEmpresa.id,
      updates: formData
    }, {
      onSuccess: () => {
        setIsEditDialogOpen(false);
        setEditingEmpresa(null);
        resetForm();
      }
    });
  };

  const handleDeleteClick = (empresaId: string) => {
    setDeletingEmpresaId(empresaId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingEmpresaId) {
      deleteEmpresa.mutate(deletingEmpresaId, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setDeletingEmpresaId(null);
        }
      });
    }
  };

  const getStatusBadge = (empresa: any) => {
    return <Badge className="fiscal-success">Ativa</Badge>;
  };

  const getCertificadoBadge = (empresa: any) => {
    if (empresa.certificado_digital) {
      return <Badge className="fiscal-success">Válido</Badge>;
    }
    return <Badge className="fiscal-error">Não configurado</Badge>;
  };

  if (isLoading) {
    return <div>Carregando empresas...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Empresas</h1>
          <p className="text-muted-foreground">
            Gerencie as empresas emitentes cadastradas
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Empresa
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Cadastrar Nova Empresa</DialogTitle>
              <DialogDescription>
                Preencha os dados da empresa emitente
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="razaoSocial">Razão Social *</Label>
                  <Input 
                    id="razaoSocial" 
                    placeholder="Digite a razão social"
                    value={formData.razao_social}
                    onChange={(e) => setFormData({...formData, razao_social: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
                  <Input 
                    id="nomeFantasia" 
                    placeholder="Digite o nome fantasia"
                    value={formData.nome_fantasia}
                    onChange={(e) => setFormData({...formData, nome_fantasia: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ *</Label>
                  <Input 
                    id="cnpj" 
                    placeholder="00.000.000/0000-00"
                    value={formData.cnpj}
                    onChange={(e) => setFormData({...formData, cnpj: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ie">Inscrição Estadual</Label>
                  <Input 
                    id="ie" 
                    placeholder="000.000.000.000"
                    value={formData.inscricao_estadual}
                    onChange={(e) => setFormData({...formData, inscricao_estadual: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço *</Label>
                  <Input 
                    id="endereco" 
                    placeholder="Rua, número, bairro"
                    value={formData.endereco}
                    onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade *</Label>
                  <Input 
                    id="cidade" 
                    placeholder="Nome da cidade"
                    value={formData.cidade}
                    onChange={(e) => setFormData({...formData, cidade: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado *</Label>
                  <Input 
                    id="estado" 
                    placeholder="UF"
                    value={formData.estado}
                    onChange={(e) => setFormData({...formData, estado: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP *</Label>
                  <Input 
                    id="cep" 
                    placeholder="00000-000"
                    value={formData.cep}
                    onChange={(e) => setFormData({...formData, cep: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input 
                    id="telefone" 
                    placeholder="(00) 00000-0000"
                    value={formData.telefone}
                    onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="municipio_nome">Município</Label>
                  <Input 
                    id="municipio_nome" 
                    placeholder="Nome do município"
                    value={formData.municipio_nome}
                    onChange={(e) => setFormData({...formData, municipio_nome: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="municipio_codigo">Código IBGE</Label>
                  <Input 
                    id="municipio_codigo" 
                    placeholder="Código IBGE do município"
                    value={formData.municipio_codigo}
                    onChange={(e) => setFormData({...formData, municipio_codigo: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input 
                    id="email" 
                    placeholder="empresa@exemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regime">Regime Tributário</Label>
                  <Select value={formData.regime_tributario} onValueChange={(value) => setFormData({...formData, regime_tributario: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o regime tributário" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simples_nacional">Simples Nacional</SelectItem>
                      <SelectItem value="lucro_presumido">Lucro Presumido</SelectItem>
                      <SelectItem value="lucro_real">Lucro Real</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleCreate}
                disabled={createEmpresa.isPending}
              >
                {createEmpresa.isPending ? "Cadastrando..." : "Cadastrar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Empresa</DialogTitle>
            <DialogDescription>
              Atualize os dados da empresa
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editRazaoSocial">Razão Social *</Label>
                <Input 
                  id="editRazaoSocial" 
                  placeholder="Digite a razão social"
                  value={formData.razao_social}
                  onChange={(e) => setFormData({...formData, razao_social: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editNomeFantasia">Nome Fantasia</Label>
                <Input 
                  id="editNomeFantasia" 
                  placeholder="Digite o nome fantasia"
                  value={formData.nome_fantasia}
                  onChange={(e) => setFormData({...formData, nome_fantasia: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editCnpj">CNPJ *</Label>
                <Input 
                  id="editCnpj" 
                  placeholder="00.000.000/0000-00"
                  value={formData.cnpj}
                  onChange={(e) => setFormData({...formData, cnpj: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editIe">Inscrição Estadual</Label>
                <Input 
                  id="editIe" 
                  placeholder="000.000.000.000"
                  value={formData.inscricao_estadual}
                  onChange={(e) => setFormData({...formData, inscricao_estadual: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editEndereco">Endereço *</Label>
                <Input 
                  id="editEndereco" 
                  placeholder="Rua, número, bairro"
                  value={formData.endereco}
                  onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editCidade">Cidade *</Label>
                <Input 
                  id="editCidade" 
                  placeholder="Nome da cidade"
                  value={formData.cidade}
                  onChange={(e) => setFormData({...formData, cidade: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editEstado">Estado *</Label>
                <Input 
                  id="editEstado" 
                  placeholder="UF"
                  value={formData.estado}
                  onChange={(e) => setFormData({...formData, estado: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editCep">CEP *</Label>
                <Input 
                  id="editCep" 
                  placeholder="00000-000"
                  value={formData.cep}
                  onChange={(e) => setFormData({...formData, cep: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editTelefone">Telefone</Label>
                <Input 
                  id="editTelefone" 
                  placeholder="(00) 00000-0000"
                  value={formData.telefone}
                  onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editMunicipioNome">Município</Label>
                <Input 
                  id="editMunicipioNome" 
                  placeholder="Nome do município"
                  value={formData.municipio_nome}
                  onChange={(e) => setFormData({...formData, municipio_nome: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editMunicipioCodigo">Código IBGE</Label>
                <Input 
                  id="editMunicipioCodigo" 
                  placeholder="Código IBGE do município"
                  value={formData.municipio_codigo}
                  onChange={(e) => setFormData({...formData, municipio_codigo: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editEmail">E-mail</Label>
                <Input 
                  id="editEmail" 
                  placeholder="empresa@exemplo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editRegime">Regime Tributário</Label>
                <Select value={formData.regime_tributario} onValueChange={(value) => setFormData({...formData, regime_tributario: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o regime tributário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simples_nacional">Simples Nacional</SelectItem>
                    <SelectItem value="lucro_presumido">Lucro Presumido</SelectItem>
                    <SelectItem value="lucro_real">Lucro Real</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleUpdate}
              disabled={updateEmpresa.isPending}
            >
              {updateEmpresa.isPending ? "Atualizando..." : "Atualizar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Excluir Empresa"
        description="Tem certeza que deseja excluir esta empresa? Esta ação não pode ser desfeita e pode afetar notas fiscais associadas."
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
              placeholder="Buscar por razão social, CNPJ ou nome fantasia..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Companies List */}
      <div className="grid gap-4">
        {filteredEmpresas.map((empresa) => (
          <Card key={empresa.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{empresa.razao_social}</CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-1">
                      <span>{empresa.nome_fantasia || 'Sem nome fantasia'}</span>
                      <span>•</span>
                      <span>{empresa.cnpj}</span>
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(empresa)}
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(empresa)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Inscrição Estadual</p>
                  <p className="font-medium">{empresa.inscricao_estadual || 'Não informado'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Regime Tributário</p>
                  <p className="font-medium">{empresa.regime_tributario || 'Não informado'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Certificado Digital</p>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      {empresa.certificado_digital ? 'Configurado' : 'Não configurado'}
                    </span>
                    {getCertificadoBadge(empresa)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                <Button variant="outline" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Ver Notas
                </Button>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Configurar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteClick(empresa.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEmpresas.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhuma empresa encontrada</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "Tente ajustar sua busca" : "Cadastre a primeira empresa para começar"}
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Cadastrar Empresa
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
