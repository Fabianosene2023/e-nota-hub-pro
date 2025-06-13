
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useClientesManager, useCreateClienteManager, useUpdateClienteManager, useDeleteClienteManager } from "@/hooks/useClientesManager";
import { useEmpresas } from "@/hooks/useEmpresas";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface ClienteFormData {
  nome_razao_social: string;
  cpf_cnpj: string;
  tipo_pessoa: 'fisica' | 'juridica';
  inscricao_estadual?: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  telefone?: string;
  email?: string;
}

export default function CadastroClientes() {
  const { profile } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<ClienteFormData>({
    nome_razao_social: "",
    cpf_cnpj: "",
    tipo_pessoa: "juridica",
    inscricao_estadual: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    telefone: "",
    email: "",
  });

  const { data: empresas } = useEmpresas();
  const empresaId = profile?.empresa_id || empresas?.[0]?.id;
  const { data: clientes, isLoading } = useClientesManager(empresaId);
  const createMutation = useCreateClienteManager();
  const updateMutation = useUpdateClienteManager();
  const deleteMutation = useDeleteClienteManager();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!empresaId) {
      toast({
        title: "Erro",
        description: "Empresa não encontrada",
        variant: "destructive",
      });
      return;
    }

    const clienteData = {
      ...formData,
      empresa_id: empresaId,
    };

    try {
      if (editingCliente) {
        await updateMutation.mutateAsync({
          id: editingCliente.id,
          updates: clienteData
        });
      } else {
        await createMutation.mutateAsync(clienteData);
      }
      
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      nome_razao_social: "",
      cpf_cnpj: "",
      tipo_pessoa: "juridica",
      inscricao_estadual: "",
      endereco: "",
      cidade: "",
      estado: "",
      cep: "",
      telefone: "",
      email: "",
    });
    setEditingCliente(null);
  };

  const handleEdit = (cliente: any) => {
    setFormData({
      nome_razao_social: cliente.nome_razao_social,
      cpf_cnpj: cliente.cpf_cnpj,
      tipo_pessoa: cliente.tipo_pessoa,
      inscricao_estadual: cliente.inscricao_estadual || "",
      endereco: cliente.endereco,
      cidade: cliente.cidade,
      estado: cliente.estado,
      cep: cliente.cep,
      telefone: cliente.telefone || "",
      email: cliente.email || "",
    });
    setEditingCliente(cliente);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const filteredClientes = clientes?.filter(cliente =>
    cliente.nome_razao_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.cpf_cnpj.includes(searchTerm)
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Cadastro de Clientes</h1>
          <p className="text-muted-foreground">Gerencie os clientes da sua empresa</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingCliente ? "Editar Cliente" : "Novo Cliente"}
                </DialogTitle>
                <DialogDescription>
                  Preencha os dados do cliente
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nome_razao_social">Razão Social/Nome</Label>
                  <Input
                    id="nome_razao_social"
                    value={formData.nome_razao_social}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome_razao_social: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tipo_pessoa">Tipo Pessoa</Label>
                  <Select
                    value={formData.tipo_pessoa}
                    onValueChange={(value: 'fisica' | 'juridica') => 
                      setFormData(prev => ({ ...prev, tipo_pessoa: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fisica">Pessoa Física</SelectItem>
                      <SelectItem value="juridica">Pessoa Jurídica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpf_cnpj">
                    {formData.tipo_pessoa === 'fisica' ? 'CPF' : 'CNPJ'}
                  </Label>
                  <Input
                    id="cpf_cnpj"
                    value={formData.cpf_cnpj}
                    onChange={(e) => setFormData(prev => ({ ...prev, cpf_cnpj: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inscricao_estadual">Inscrição Estadual</Label>
                  <Input
                    id="inscricao_estadual"
                    value={formData.inscricao_estadual}
                    onChange={(e) => setFormData(prev => ({ ...prev, inscricao_estadual: e.target.value }))}
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    value={formData.endereco}
                    onChange={(e) => setFormData(prev => ({ ...prev, endereco: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    value={formData.cidade}
                    onChange={(e) => setFormData(prev => ({ ...prev, cidade: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Input
                    id="estado"
                    value={formData.estado}
                    onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value }))}
                    required
                    maxLength={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cep">CEP</Label>
                  <Input
                    id="cep"
                    value={formData.cep}
                    onChange={(e) => setFormData(prev => ({ ...prev, cep: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingCliente ? "Atualizar" : "Criar"}
                </Button>
              </DialogFooter>
            </form>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome/Razão Social</TableHead>
                  <TableHead>CPF/CNPJ</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Cidade</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClientes.map((cliente) => (
                  <TableRow key={cliente.id}>
                    <TableCell className="font-medium">{cliente.nome_razao_social}</TableCell>
                    <TableCell>{cliente.cpf_cnpj}</TableCell>
                    <TableCell>
                      <Badge variant={cliente.tipo_pessoa === 'fisica' ? 'default' : 'secondary'}>
                        {cliente.tipo_pessoa === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                      </Badge>
                    </TableCell>
                    <TableCell>{cliente.cidade}</TableCell>
                    <TableCell>{cliente.estado}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(cliente)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDelete(cliente.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
