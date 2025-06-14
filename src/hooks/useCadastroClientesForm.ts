
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { useClientesManager, useCreateClienteManager, useUpdateClienteManager, useDeleteClienteManager } from "@/hooks/useClientesManager";
import { checkClienteDuplicado } from "@/hooks/useCheckClienteDuplicado";
import { useFiltroClientes } from "./useFiltroClientes";
import { useDialogCliente } from "./useDialogCliente";

export const clienteSchema = z.object({
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

export type ClienteFormDataSchema = z.infer<typeof clienteSchema>;

export function useCadastroClientesForm({ empresaId, onSuccess }: { empresaId?: string, onSuccess?: () => void }) {
  const [searchTerm, setSearchTerm] = useState("");

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

  const { isDialogOpen, setIsDialogOpen, editingCliente, setEditingCliente, openDialog, closeDialog } = useDialogCliente(form);
  const [buttonState, setButtonState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

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

      // Validação duplicidade de CPF/CNPJ
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
      if (onSuccess) onSuccess();
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
    form.reset();
    setEditingCliente(null);
  };

  const handleEdit = (cliente: any) => {
    openDialog(cliente);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const filteredClientes = useFiltroClientes(clientes || [], searchTerm);

  return {
    form,
    isDialogOpen,
    setIsDialogOpen,
    editingCliente,
    setEditingCliente,
    searchTerm,
    setSearchTerm,
    filteredClientes,
    isLoading,
    buttonState,
    handleSubmit,
    handleEdit,
    handleDelete,
    openDialog,
    deleteLoading: deleteMutation.isPending,
  };
}
