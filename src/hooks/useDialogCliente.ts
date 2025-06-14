
import { useState } from "react";

export function useDialogCliente(form: any) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<any>(null);

  function openDialog(cliente?: any) {
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
  }

  function closeDialog() {
    setIsDialogOpen(false);
    setEditingCliente(null);
    form.reset();
  }

  return { isDialogOpen, setIsDialogOpen, editingCliente, setEditingCliente, openDialog, closeDialog };
}
