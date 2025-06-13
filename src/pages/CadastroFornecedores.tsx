
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
import { useFornecedores, useFornecedoresManager } from "@/hooks/useFornecedores";
import { useEmpresas } from "@/hooks/useEmpresas";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface FornecedorFormData {
  nome_razao_social: string;
  nome_fantasia: string;
  cpf_cnpj: string;
  tipo_pessoa: 'fisica' | 'juridica';
  inscricao_estadual?: string;
  inscricao_municipal?: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  telefone?: string;
  email?: string;
}

export default function CadastroFornecedores() {
  const { profile } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFornecedor, setEditingFornecedor] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<FornecedorFormData>({
    nome_razao_social: "",
    nome_fantasia: "",
    cpf_cnpj: "",
    tipo_pessoa: "juridica",
    inscricao_estadual: "",
    inscricao_municipal: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    telefone: "",
    email: "",
  });

  const { data: empresas } = useEmpresas();
  const empresaId = profile?.empresa_id || empresas?.[0]?.id;
  const { data: fornecedores, isLoading } = useFornecedores();
  const { createFornecedor, updateFornecedor, deleteFornecedor } = useFornecedoresManager();

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

    const fornecedorData = {
      ...formData,
      empresa_id: empresaId,
      ativo: true,
    };

    try {
      if (editingFornecedor) {
        await updateFornecedor.mutateAsync({
          id: editingFornecedor.id,
          ...fornecedorData
        });
      } else {
        await createFornecedor.mutateAsync(fornecedorData);
      }
      
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erro ao salvar fornecedor:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      nome_razao_social: "",
      nome_fantasia: "",
      cpf_cnpj: "",
      tipo_pessoa: "juridica",
      inscricao_estadual: "",
      inscricao_municipal: "",
      endereco: "",
      cidade: "",
      estado: "",
      cep: "",
      telefone: "",
      email: "",
    });
    setEditingFornecedor(null);
  };

  const handleEdit = (fornecedor: any) => {
    setFormData({
      nome_razao_social: fornecedor.nome_razao_social,
      nome_fantasia: fornecedor.nome_fantasia || "",
      cpf_cnpj: fornecedor.cpf_cnpj,
      tipo_pessoa: fornecedor.tipo_pessoa,
      inscricao_estadual: fornecedor.inscricao_estadual || "",
      inscricao_municipal: fornecedor.inscricao_municipal || "",
      endereco: fornecedor.endereco,
      cidade: fornecedor.cidade,
      estado: fornecedor.estado,
      cep: fornecedor.cep,
      telefone: fornecedor.telefone || "",
      email: fornecedor.email || "",
    });
    setEditingFornecedor(fornecedor);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este fornecedor?")) {
      await deleteFornecedor.mutateAsync(id);
    }
  };

  const filteredFornecedores = fornecedores?.filter(fornecedor =>
    fornecedor.nome_razao_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fornecedor.cpf_cnpj.includes(searchTerm)
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Cadastro de Fornecedores</h1>
          <p className="text-muted-foreground">Gerencie os fornecedores da sua empresa</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Fornecedor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingFornecedor ? "Editar Fornecedor" : "Novo Fornecedor"}
                </DialogTitle>
                <DialogDescription>
                  Preencha os dados do fornecedor
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nome_razao_social">Razão Social</Label>
                  <Input
                    id="nome_razao_social"
                    value={formData.nome_razao_social}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome_razao_social: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nome_fantasia">Nome Fantasia</Label>
                  <Input
                    id="nome_fantasia"
                    value={formData.nome_fantasia}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome_fantasia: e.target.value }))}
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

                <div className="space-y-2">
                  <Label htmlFor="inscricao_municipal">Inscrição Municipal</Label>
                  <Input
                    id="inscricao_municipal"
                    value={formData.inscricao_municipal}
                    onChange={(e) => setFormData(prev => ({ ...prev, inscricao_municipal: e.target.value }))}
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
                <Button type="submit" disabled={createFornecedor.isPending || updateFornecedor.isPending}>
                  {editingFornecedor ? "Atualizar" : "Criar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Fornecedores</CardTitle>
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
                  <TableHead>Razão Social</TableHead>
                  <TableHead>Nome Fantasia</TableHead>
                  <TableHead>CPF/CNPJ</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Cidade/UF</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFornecedores.map((fornecedor) => (
                  <TableRow key={fornecedor.id}>
                    <TableCell className="font-medium">{fornecedor.nome_razao_social}</TableCell>
                    <TableCell>{fornecedor.nome_fantasia || '-'}</TableCell>
                    <TableCell>{fornecedor.cpf_cnpj}</TableCell>
                    <TableCell>
                      <Badge variant={fornecedor.tipo_pessoa === 'fisica' ? 'default' : 'secondary'}>
                        {fornecedor.tipo_pessoa === 'fisica' ? 'PF' : 'PJ'}
                      </Badge>
                    </TableCell>
                    <TableCell>{fornecedor.cidade}/{fornecedor.estado}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(fornecedor)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDelete(fornecedor.id)}
                          disabled={deleteFornecedor.isPending}
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
