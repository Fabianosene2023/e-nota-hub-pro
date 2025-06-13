import React, { useState } from 'react';
import { useProdutosManager, useCreateProdutoManager, useUpdateProdutoManager, useDeleteProdutoManager } from '@/hooks/useProdutosManager';
import { useEmpresas } from '@/hooks/useEmpresas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from '@/hooks/use-toast';
import { Pencil, Trash2, Plus, Package } from "lucide-react";

export const CadastroProdutos = () => {
  const { data: empresas } = useEmpresas();
  const [empresaSelecionada, setEmpresaSelecionada] = useState<string>('');
  const { data: produtos } = useProdutosManager(empresaSelecionada);
  const createProduto = useCreateProdutoManager();
  const updateProduto = useUpdateProdutoManager();
  const deleteProduto = useDeleteProdutoManager();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduto, setEditingProduto] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    codigo: '',
    nome: '',
    descricao: '',
    unidade: 'UN',
    preco_unitario: 0,
    ncm: '',
    cfop: '5102',
    cst_icms: '',
    csosn: '',
    icms_aliquota: 0,
    ipi_aliquota: 0,
    pis_aliquota: 0,
    cofins_aliquota: 0,
    estoque_atual: 0,
    estoque_minimo: 0
  });

  const resetForm = () => {
    setFormData({
      codigo: '',
      nome: '',
      descricao: '',
      unidade: 'UN',
      preco_unitario: 0,
      ncm: '',
      cfop: '5102',
      cst_icms: '',
      csosn: '',
      icms_aliquota: 0,
      ipi_aliquota: 0,
      pis_aliquota: 0,
      cofins_aliquota: 0,
      estoque_atual: 0,
      estoque_minimo: 0
    });
    setEditingProduto(null);
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
      const produtoData = {
        ...formData,
        empresa_id: empresaSelecionada
      };

      if (editingProduto) {
        await updateProduto.mutateAsync({
          id: editingProduto.id,
          updates: produtoData
        });
      } else {
        await createProduto.mutateAsync(produtoData);
      }
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    }
  };

  const handleEdit = (produto: any) => {
    setFormData({
      codigo: produto.codigo,
      nome: produto.nome || '',
      descricao: produto.descricao,
      unidade: produto.unidade,
      preco_unitario: produto.preco_unitario,
      ncm: produto.ncm || '',
      cfop: produto.cfop,
      cst_icms: produto.cst_icms || '',
      csosn: produto.csosn || '',
      icms_aliquota: produto.icms_aliquota || 0,
      ipi_aliquota: produto.ipi_aliquota || 0,
      pis_aliquota: produto.pis_aliquota || 0,
      cofins_aliquota: produto.cofins_aliquota || 0,
      estoque_atual: produto.estoque_atual || 0,
      estoque_minimo: produto.estoque_minimo || 0
    });
    setEditingProduto(produto);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await deleteProduto.mutateAsync(id);
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
      }
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Cadastro de Produtos</h2>
          <p className="text-muted-foreground">
            Gerencie o cadastro de produtos da empresa
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Selecionar Empresa</CardTitle>
          <CardDescription>
            Escolha a empresa para gerenciar os produtos
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
                  <Package className="h-5 w-5" />
                  Produtos Cadastrados
                </CardTitle>
                <CardDescription>
                  Lista de todos os produtos cadastrados
                </CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) resetForm();
              }}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Novo Produto
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingProduto ? 'Editar Produto' : 'Novo Produto'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="codigo">Código *</Label>
                        <Input
                          id="codigo"
                          value={formData.codigo}
                          onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="nome">Nome</Label>
                        <Input
                          id="nome"
                          value={formData.nome}
                          onChange={(e) => setFormData({...formData, nome: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="unidade">Unidade *</Label>
                        <Select 
                          value={formData.unidade} 
                          onValueChange={(value) => setFormData({...formData, unidade: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="UN">Unidade</SelectItem>
                            <SelectItem value="KG">Quilograma</SelectItem>
                            <SelectItem value="G">Grama</SelectItem>
                            <SelectItem value="L">Litro</SelectItem>
                            <SelectItem value="ML">Mililitro</SelectItem>
                            <SelectItem value="M">Metro</SelectItem>
                            <SelectItem value="CM">Centímetro</SelectItem>
                            <SelectItem value="PC">Peça</SelectItem>
                            <SelectItem value="CX">Caixa</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="descricao">Descrição *</Label>
                      <Input
                        id="descricao"
                        value={formData.descricao}
                        onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="preco_unitario">Preço Unitário *</Label>
                        <Input
                          id="preco_unitario"
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.preco_unitario}
                          onChange={(e) => setFormData({...formData, preco_unitario: parseFloat(e.target.value) || 0})}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="ncm">NCM</Label>
                        <Input
                          id="ncm"
                          value={formData.ncm}
                          onChange={(e) => setFormData({...formData, ncm: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cfop">CFOP</Label>
                        <Input
                          id="cfop"
                          value={formData.cfop}
                          onChange={(e) => setFormData({...formData, cfop: e.target.value})}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cst_icms">CST ICMS</Label>
                        <Input
                          id="cst_icms"
                          value={formData.cst_icms}
                          onChange={(e) => setFormData({...formData, cst_icms: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-5 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="csosn">CSOSN</Label>
                        <Input
                          id="csosn"
                          value={formData.csosn}
                          onChange={(e) => setFormData({...formData, csosn: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="icms_aliquota">ICMS (%)</Label>
                        <Input
                          id="icms_aliquota"
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          value={formData.icms_aliquota}
                          onChange={(e) => setFormData({...formData, icms_aliquota: parseFloat(e.target.value) || 0})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="ipi_aliquota">IPI (%)</Label>
                        <Input
                          id="ipi_aliquota"
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          value={formData.ipi_aliquota}
                          onChange={(e) => setFormData({...formData, ipi_aliquota: parseFloat(e.target.value) || 0})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="pis_aliquota">PIS (%)</Label>
                        <Input
                          id="pis_aliquota"
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          value={formData.pis_aliquota}
                          onChange={(e) => setFormData({...formData, pis_aliquota: parseFloat(e.target.value) || 0})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cofins_aliquota">COFINS (%)</Label>
                        <Input
                          id="cofins_aliquota"
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          value={formData.cofins_aliquota}
                          onChange={(e) => setFormData({...formData, cofins_aliquota: parseFloat(e.target.value) || 0})}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="estoque_atual">Estoque Atual</Label>
                        <Input
                          id="estoque_atual"
                          type="number"
                          min="0"
                          value={formData.estoque_atual}
                          onChange={(e) => setFormData({...formData, estoque_atual: parseInt(e.target.value) || 0})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="estoque_minimo">Estoque Mínimo</Label>
                        <Input
                          id="estoque_minimo"
                          type="number"
                          min="0"
                          value={formData.estoque_minimo}
                          onChange={(e) => setFormData({...formData, estoque_minimo: parseInt(e.target.value) || 0})}
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
                      <Button type="submit" disabled={createProduto.isPending || updateProduto.isPending}>
                        {editingProduto ? 'Atualizar' : 'Cadastrar'}
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
                  <TableHead>Código</TableHead>
                  <TableHead>Nome/Descrição</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {produtos?.map((produto) => (
                  <TableRow key={produto.id}>
                    <TableCell className="font-medium">{produto.codigo}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{produto.nome || produto.descricao}</div>
                        {produto.nome && produto.nome !== produto.descricao && (
                          <div className="text-sm text-muted-foreground">{produto.descricao}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{produto.unidade}</TableCell>
                    <TableCell>{formatCurrency(produto.preco_unitario)}</TableCell>
                    <TableCell>
                      <span className={produto.estoque_atual <= produto.estoque_minimo ? 'text-red-600' : ''}>
                        {produto.estoque_atual}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(produto)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(produto.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {(!produtos || produtos.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      Nenhum produto cadastrado
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
