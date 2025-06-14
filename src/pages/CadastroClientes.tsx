import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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

import { ClienteForm } from "@/components/CadastroClientes/ClienteForm";
import { ClientesTable } from "@/components/CadastroClientes/ClientesTable";
import { checkClienteDuplicado } from "@/hooks/useCheckClienteDuplicado";

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
        empresa_id: empresaId as string,
        nome_razao_social: data.nome_razao_social,
        cpf_cnpj: data.cpf_cnpj,
        tipo_pessoa: data.tipo_pessoa,
        inscricao_estadual: data.inscricao_estadual || "",
        endereco: data.endereco,
        cidade: data.cidade,
        estado: data.estado,
        cep: data.cep,
        telefone: data.telefone || "",
        email: data.email || "",
      };

      // === Validação extra de duplicidade de CPF/CNPJ ===
      const isDuplicado = await checkClienteDuplicado({
        empresaId: clienteData.empresa_id,
        cpfCnpj: clienteData.cpf_cnpj,
        ignoreClienteId: editingCliente?.id ?? undefined,
      });
      if (isDuplicado) {
        setButtonState('error');
        toast({
          title: "CPF/CNPJ já cadastrado",
          description: "Já existe um cliente com este CPF ou CNPJ para esta empresa.",
          variant: "destructive",
        });
        setTimeout(() => setButtonState('idle'), 2000);
        return;
      }
      // === Fim validação duplicidade ===

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
              deleteLoading={deleteMutation.isPending}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
