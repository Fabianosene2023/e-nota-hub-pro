
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Search, Truck } from "lucide-react";
import { useTransportadoras, useTransportadorasManager } from "@/hooks/useTransportadoras";
import { useEmpresas } from "@/hooks/useEmpresas";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface TransportadoraFormData {
  nome_razao_social: string;
  nome_fantasia: string;
  cpf_cnpj: string;
  tipo_pessoa: 'fisica' | 'juridica';
  inscricao_estadual?: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  telefone?: string;
  email?: string;
  rntrc?: string;
  placa_veiculo?: string;
}

export default function CadastroTransportadoras() {
  const { profile } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransportadora, setEditingTransportadora] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<TransportadoraFormData>({
    nome_razao_social: "",
    nome_fantasia: "",
    cpf_cnpj: "",
    tipo_pessoa: "juridica",
    inscricao_estadual: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    telefone: "",
    email: "",
    rntrc: "",
    placa_veiculo: "",
  });

  const { data: empresas } = useEmpresas();
  const empresaId = profile?.empresa_id || empresas?.[0]?.id;
  const { data: transportadoras, isLoading } = useTransportadoras();
  const { createTransportadora, updateTransportadora, deleteTransportadora } = useTransportadorasManager();

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

    const transportadoraData = {
      ...formData,
      empresa_id: empresaId,
      ativo: true,
    };

    try {
      if (editingTransportadora) {
        await updateTransportadora.mutateAsync({
          id: editingTransportadora.id,
          ...transportadoraData
        });
      } else {
        await createTransportadora.mutateAsync(transportadoraData);
      }
      
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erro ao salvar transportadora:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      nome_razao_social: "",
      nome_fantasia: "",
      cpf_cnpj: "",
      tipo_pessoa: "juridica",
      inscricao_estadual: "",
      endereco: "",
      cidade: "",
      estado: "",
      cep: "",
      telefone: "",
      email: "",
      rntrc: "",
      placa_veiculo: "",
    });
    setEditingTransportadora(null);
  };

  const handleEdit = (transportadora: any) => {
    setFormData({
      nome_razao_social: transportadora.nome_razao_social,
      nome_fantasia: transportadora.nome_fantasia || "",
      cpf_cnpj: transportadora.cpf_cnpj,
      tipo_pessoa: transportadora.tipo_pessoa,
      inscricao_estadual: transportadora.inscricao_estadual || "",
      endereco: transportadora.endereco,
      cidade: transportadora.cidade,
      estado: transportadora.estado,
      cep: transportadora.cep,
      telefone: transportadora.telefone || "",
      email: transportadora.email || "",
      rntrc: transportadora.rntrc || "",
      placa_veiculo: transportadora.placa_veiculo || "",
    });
    setEditingTransportadora(transportadora);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta transportadora?")) {
      await deleteTransportadora.mutateAsync(id);
    }
  };

  const filteredTransportadoras = transportadoras?.filter(transportadora =>
    transportadora.nome_razao_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transportadora.cpf_cnpj.includes(searchTerm) ||
    (transportadora.placa_veiculo && transportadora.placa_veiculo.includes(searchTerm.toUpperCase()))
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Truck className="h-8 w-8" />
            Cadastro de Transportadoras
          </h1>
          <p className="text-muted-foreground">Gerencie as transportadoras para suas NF-e</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Transportadora
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingTransportadora ? "Editar Transportadora" : "Nova Transportadora"}
                </DialogTitle>
                <DialogDescription>
                  Preencha os dados da transportadora
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
                  <Label htmlFor="rntrc">RNTRC</Label>
                  <Input
                    id="rntrc"
                    value={formData.rntrc}
                    onChange={(e) => setFormData(prev => ({ ...prev, rntrc: e.target.value }))}
                    placeholder="Registro Nacional de Transportadores"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="placa_veiculo">Placa do Veículo</Label>
                  <Input
                    id="placa_veiculo"
                    value={formData.placa_veiculo}
                    onChange={(e) => setFormData(prev => ({ ...prev, placa_veiculo: e.target.value.toUpperCase() }))}
                    placeholder="ABC-1234"
                    maxLength={8}
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
                <Button type="submit" disabled={createTransportadora.isPending || updateTransportadora.isPending}>
                  {editingTransportadora ? "Atualizar" : "Criar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Transportadoras</CardTitle>
          <CardDescription>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <Input
                placeholder="Buscar por nome, CNPJ ou placa..."
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
                  <TableHead>CPF/CNPJ</TableHead>
                  <TableHead>Placa</TableHead>
                  <TableHead>RNTRC</TableHead>
                  <TableHead>Cidade/UF</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransportadoras.map((transportadora) => (
                  <TableRow key={transportadora.id}>
                    <TableCell className="font-medium">{transportadora.nome_razao_social}</TableCell>
                    <TableCell>{transportadora.cpf_cnpj}</TableCell>
                    <TableCell>
                      {transportadora.placa_veiculo ? (
                        <Badge variant="outline" className="font-mono">
                          {transportadora.placa_veiculo}
                        </Badge>
                      ) : '-'}
                    </TableCell>
                    <TableCell>{transportadora.rntrc || '-'}</TableCell>
                    <TableCell>{transportadora.cidade}/{transportadora.estado}</TableCell>
                    <TableCell>
                      <Badge variant={transportadora.ativo ? 'default' : 'secondary'}>
                        {transportadora.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(transportadora)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDelete(transportadora.id)}
                          disabled={deleteTransportadora.isPending}
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
