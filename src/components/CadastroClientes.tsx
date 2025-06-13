import React, { useState } from 'react';
import { useClientesManager, useCreateClienteManager, useUpdateClienteManager, useDeleteClienteManager } from '@/hooks/useClientesManager';
import { useEmpresas } from '@/hooks/useEmpresas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from '@/hooks/use-toast';
import { Pencil, Trash2, Plus, Users } from "lucide-react";

export const CadastroClientes = () => {
  const { data: empresas } = useEmpresas();
  const [empresaSelecionada, setEmpresaSelecionada] = useState<string>('');
  const { data: clientes } = useClientesManager(empresaSelecionada);
  const createCliente = useCreateClienteManager();
  const updateCliente = useUpdateClienteManager();
  const deleteCliente = useDeleteClienteManager();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    nome_razao_social: '',
    cpf_cnpj: '',
    tipo_pessoa: 'fisica',
    inscricao_estadual: '',
    email: '',
    telefone: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: ''
  });

  const resetForm = () => {
    setFormData({
      nome_razao_social: '',
      cpf_cnpj: '',
      tipo_pessoa: 'fisica',
      inscricao_estadual: '',
      email: '',
      telefone: '',
      endereco: '',
      cidade: '',
      estado: '',
      cep: ''
    });
    setEditingCliente(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!empresaSelecionada) {
      toast({
        title: "Erro",
        description: "Selecione uma empresa primeiro",
        variant: "destructive",
      });
      return;
    }

    try {
      const clienteData = {
        ...formData,
        empresa_id: empresaSelecionada
      };

      if (editingCliente) {
        await updateCliente.mutateAsync({
          id: editingCliente.id,
          updates: clienteData
        });
      } else {
        await createCliente.mutateAsync(clienteData);
      }
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
    }
  };

  const handleEdit = (cliente: any) => {
    setFormData({
      nome_razao_social: cliente.nome_razao_social,
      cpf_cnpj: cliente.cpf_cnpj,
      tipo_pessoa: cliente.tipo_pessoa,
      inscricao_estadual: cliente.inscricao_estadual || '',
      email: cliente.email || '',
      telefone: cliente.telefone || '',
      endereco: cliente.endereco,
      cidade: cliente.cidade,
      estado: cliente.estado,
      cep: cliente.cep
    });
    setEditingCliente(cliente);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await deleteCliente.mutateAsync(id);
      } catch (error) {
        console.error('Erro ao excluir cliente:', error);
      }
    }
  };

  const formatCpfCnpj = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 11) {
      return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const formatCep = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Cadastro de Clientes</h2>
          <p className="text-muted-foreground">
            Gerencie o cadastro de clientes da empresa
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Selecionar Empresa</CardTitle>
          <CardDescription>
            Escolha a empresa para gerenciar os clientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={empresaSelecionada} onValueChange={setEmpresaSelecionada}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione uma empresa" />
            </SelectTrigger>
            <SelectContent>
              {empresas?.map((empresa) => (
                <SelectItem key={empresa.id} value={empresa.id}>
                  {empresa.nome_fantasia || empresa.razao_social}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {empresaSelecionada && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Clientes Cadastrados
                </CardTitle>
                <CardDescription>
                  Lista de todos os clientes cadastrados
                </CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) resetForm();
              }}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Novo Cliente
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingCliente ? 'Editar Cliente' : 'Novo Cliente'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nome_razao_social">Nome/Razão Social *</Label>
                        <Input
                          id="nome_razao_social"
                          value={formData.nome_razao_social}
                          onChange={(e) => setFormData({...formData, nome_razao_social: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="tipo_pessoa">Tipo de Pessoa *</Label>
                        <Select 
                          value={formData.tipo_pessoa} 
                          onValueChange={(value) => setFormData({...formData, tipo_pessoa: value})}
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
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cpf_cnpj">CPF/CNPJ *</Label>
                        <Input
                          id="cpf_cnpj"
                          value={formatCpfCnpj(formData.cpf_cnpj)}
                          onChange={(e) => setFormData({...formData, cpf_cnpj: e.target.value.replace(/\D/g, '')})}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="inscricao_estadual">Inscrição Estadual</Label>
                        <Input
                          id="inscricao_estadual"
                          value={formData.inscricao_estadual}
                          onChange={(e) => setFormData({...formData, inscricao_estadual: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="telefone">Telefone</Label>
                        <Input
                          id="telefone"
                          value={formData.telefone}
                          onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endereco">Endereço *</Label>
                      <Input
                        id="endereco"
                        value={formData.endereco}
                        onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cidade">Cidade *</Label>
                        <Input
                          id="cidade"
                          value={formData.cidade}
                          onChange={(e) => setFormData({...formData, cidade: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="estado">Estado *</Label>
                        <Input
                          id="estado"
                          value={formData.estado}
                          onChange={(e) => setFormData({...formData, estado: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cep">CEP *</Label>
                        <Input
                          id="cep"
                          value={formatCep(formData.cep)}
                          onChange={(e) => setFormData({...formData, cep: e.target.value.replace(/\D/g, '')})}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={createCliente.isPending || updateCliente.isPending}>
                        {editingCliente ? 'Atualizar' : 'Cadastrar'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome/Razão Social</TableHead>
                  <TableHead>CPF/CNPJ</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Cidade/UF</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientes?.map((cliente) => (
                  <TableRow key={cliente.id}>
                    <TableCell className="font-medium">{cliente.nome_razao_social}</TableCell>
                    <TableCell>{formatCpfCnpj(cliente.cpf_cnpj)}</TableCell>
                    <TableCell>{cliente.tipo_pessoa === 'fisica' ? 'PF' : 'PJ'}</TableCell>
                    <TableCell>{cliente.cidade}/{cliente.estado}</TableCell>
                    <TableCell>{cliente.telefone || cliente.email || '-'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(cliente)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(cliente.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {(!clientes || clientes.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      Nenhum cliente cadastrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
