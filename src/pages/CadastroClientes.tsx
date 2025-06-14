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
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { maskCpfCnpj, maskCep } from "@/utils/maskUtils";
import { Loader2, Check, AlertCircle } from "lucide-react";

const clienteSchema = z.object({
  nome_razao_social: z.string().min(1, "Nome/Razão Social é obrigatório"),
  cpf_cnpj: z.string().min(11, "CPF/CNPJ é obrigatório"),
  tipo_pessoa: z.enum(["fisica", "juridica"]),
  inscricao_estadual: z.string().optional(),
  endereco: z.string().min(1, "Endereço é obrigatório"),
  cidade: z.string().min(1, "Cidade é obrigatória"),
  estado: z.string().min(2, "Estado é obrigatório"),
  cep: z.string().min(8, "CEP é obrigatório"),
  telefone: z.string().optional(),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
});

type ClienteFormDataSchema = z.infer<typeof clienteSchema>;

export default function CadastroClientes() {
  const { profile } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<ClienteFormDataSchema>({
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

  // Adapte o formulário para usar RHF + Zod
  const form = useForm<ClienteFormDataSchema>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
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
    }
  });

  const [buttonState, setButtonState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const { data: empresas } = useEmpresas();
  const empresaId = profile?.empresa_id || empresas?.[0]?.id;
  const { data: clientes, isLoading } = useClientesManager(empresaId);
  const createMutation = useCreateClienteManager();
  const updateMutation = useUpdateClienteManager();
  const deleteMutation = useDeleteClienteManager();

  const handleSubmit = async (data: ClienteFormDataSchema) => {
    if (!empresaId) {
      toast({
        title: "Erro",
        description: "Empresa não encontrada",
        variant: "destructive",
      });
      return;
    }

    setButtonState('loading');
    console.debug("Salvando cliente:", data);

    try {
      const clienteData = {
        ...data,
        empresa_id: empresaId,
      };
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
      setButtonState('success');
      toast({
        title: "Sucesso",
        description: "Cliente salvo com sucesso!",
        variant: "default",
      });
    } catch (error) {
      setButtonState('error');
      toast({
        title: "Erro ao salvar",
        description: "Verifique os campos e tente novamente.",
        variant: "destructive",
      });
      if (process.env.NODE_ENV === "development") {
        console.error('Erro ao salvar cliente:', error);
      }
    } finally {
      setTimeout(() => setButtonState('idle'), 2000);
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

  // Novo handler para abrir o diálogo
  const openDialog = (cliente?: any) => {
    if (cliente) {
      form.reset({
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
    } else {
      form.reset();
      setEditingCliente(null);
    }
    setIsDialogOpen(true);
  };

  const filteredClientes = clientes?.filter(cliente =>
    cliente.nome_razao_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.cpf_cnpj.includes(searchTerm)
  ) || [];

  return (
    <div className="space-y-6">
      {/* ... cabeçalho ... */}
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
            <form onSubmit={form.handleSubmit(handleSubmit)}>
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
                  <Label htmlFor="nome_razao_social">Razão Social/Nome *</Label>
                  <Input
                    id="nome_razao_social"
                    {...form.register("nome_razao_social")}
                  />
                  <span className="text-xs text-red-600">{form.formState.errors.nome_razao_social?.message}</span>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo_pessoa">Tipo Pessoa *</Label>
                  <Select
                    value={form.watch('tipo_pessoa')}
                    onValueChange={(value: 'fisica' | 'juridica') => form.setValue("tipo_pessoa", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fisica">Pessoa Física</SelectItem>
                      <SelectItem value="juridica">Pessoa Jurídica</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-xs text-red-600">{form.formState.errors.tipo_pessoa?.message}</span>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpf_cnpj">{form.watch('tipo_pessoa') === 'fisica' ? 'CPF *' : 'CNPJ *'}</Label>
                  <Input
                    id="cpf_cnpj"
                    {...form.register("cpf_cnpj")}
                    value={maskCpfCnpj(form.watch('cpf_cnpj'))}
                    onChange={e => form.setValue('cpf_cnpj', e.target.value.replace(/\D/g, ""))}
                  />
                  <span className="text-xs text-red-600">{form.formState.errors.cpf_cnpj?.message}</span>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inscricao_estadual">Inscrição Estadual</Label>
                  <Input
                    id="inscricao_estadual"
                    {...form.register("inscricao_estadual")}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="endereco">Endereço *</Label>
                  <Input
                    id="endereco"
                    {...form.register("endereco")}
                  />
                  <span className="text-xs text-red-600">{form.formState.errors.endereco?.message}</span>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade *</Label>
                  <Input
                    id="cidade"
                    {...form.register("cidade")}
                  />
                  <span className="text-xs text-red-600">{form.formState.errors.cidade?.message}</span>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado *</Label>
                  <Input
                    id="estado"
                    {...form.register("estado")}
                    maxLength={2}
                  />
                  <span className="text-xs text-red-600">{form.formState.errors.estado?.message}</span>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP *</Label>
                  <Input
                    id="cep"
                    {...form.register("cep")}
                    value={maskCep(form.watch('cep'))}
                    onChange={e => form.setValue('cep', e.target.value.replace(/\D/g, ""))}
                  />
                  <span className="text-xs text-red-600">{form.formState.errors.cep?.message}</span>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    {...form.register("telefone")}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register("email")}
                  />
                  <span className="text-xs text-red-600">{form.formState.errors.email?.message}</span>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={buttonState === 'loading' || createMutation.isPending || updateMutation.isPending}
                  className={
                    buttonState === 'loading' ? "cursor-wait" : buttonState === "success" ? "bg-green-600" : buttonState === "error" ? "bg-destructive" : ""
                  }
                >
                  {buttonState === 'loading' && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  {buttonState === 'success' && (
                    <Check className="w-4 h-4 mr-2" />
                  )}
                  {buttonState === 'error' && (
                    <AlertCircle className="w-4 h-4 mr-2" />
                  )}
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
