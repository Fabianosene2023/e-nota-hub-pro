
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useProdutosManager, useCreateProdutoManager, useUpdateProdutoManager, useDeleteProdutoManager } from "@/hooks/useProdutosManager";
import { useUnidadesMedida } from "@/hooks/useUnidadesMedida";
import { useCategorias } from "@/hooks/useCategorias";
import { useMarcas } from "@/hooks/useMarcas";
import { useFornecedores } from "@/hooks/useFornecedores";
import { useEmpresas } from "@/hooks/useEmpresas";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface ProdutoFormData {
  codigo: string;
  nome: string;
  descricao: string;
  codigo_interno?: string;
  ean?: string;
  ncm?: string;
  cfop: string;
  unidade: string;
  preco_unitario: number;
  categoria_id?: string;
  marca_id?: string;
  fornecedor_id?: string;
  estoque_atual: number;
  estoque_minimo: number;
  cst_icms?: string;
  csosn?: string;
  icms_aliquota: number;
  ipi_aliquota: number;
  pis_aliquota: number;
  cofins_aliquota: number;
}

export default function CadastroProdutos() {
  const { profile } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduto, setEditingProduto] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<ProdutoFormData>({
    codigo: "",
    nome: "",
    descricao: "",
    codigo_interno: "",
    ean: "",
    ncm: "",
    cfop: "5102",
    unidade: "UN",
    preco_unitario: 0,
    categoria_id: "",
    marca_id: "",
    fornecedor_id: "",
    estoque_atual: 0,
    estoque_minimo: 0,
    cst_icms: "",
    csosn: "",
    icms_aliquota: 0,
    ipi_aliquota: 0,
    pis_aliquota: 0,
    cofins_aliquota: 0,
  });

  const { data: empresas } = useEmpresas();
  const empresaId = profile?.empresa_id || empresas?.[0]?.id;
  const { data: produtos, isLoading } = useProdutosManager(empresaId);
  const { data: unidades } = useUnidadesMedida();
  const { data: categorias } = useCategorias();
  const { data: marcas } = useMarcas();
  const { data: fornecedores } = useFornecedores();
  const createMutation = useCreateProdutoManager();
  const updateMutation = useUpdateProdutoManager();
  const deleteMutation = useDeleteProdutoManager();

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

    const produtoData = {
      ...formData,
      empresa_id: empresaId,
      categoria_id: formData.categoria_id || null,
      marca_id: formData.marca_id || null,
      fornecedor_id: formData.fornecedor_id || null,
    };

    try {
      if (editingProduto) {
        await updateMutation.mutateAsync({
          id: editingProduto.id,
          updates: produtoData
        });
      } else {
        await createMutation.mutateAsync(produtoData);
      }
      
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      codigo: "",
      nome: "",
      descricao: "",
      codigo_interno: "",
      ean: "",
      ncm: "",
      cfop: "5102",
      unidade: "UN",
      preco_unitario: 0,
      categoria_id: "",
      marca_id: "",
      fornecedor_id: "",
      estoque_atual: 0,
      estoque_minimo: 0,
      cst_icms: "",
      csosn: "",
      icms_aliquota: 0,
      ipi_aliquota: 0,
      pis_aliquota: 0,
      cofins_aliquota: 0,
    });
    setEditingProduto(null);
  };

  const handleEdit = (produto: any) => {
    setFormData({
      codigo: produto.codigo,
      nome: produto.nome || "",
      descricao: produto.descricao,
      codigo_interno: produto.codigo_interno || "",
      ean: produto.ean || "",
      ncm: produto.ncm || "",
      cfop: produto.cfop,
      unidade: produto.unidade,
      preco_unitario: Number(produto.preco_unitario),
      categoria_id: produto.categoria_id || "",
      marca_id: produto.marca_id || "",
      fornecedor_id: produto.fornecedor_id || "",
      estoque_atual: produto.estoque_atual || 0,
      estoque_minimo: produto.estoque_minimo || 0,
      cst_icms: produto.cst_icms || "",
      csosn: produto.csosn || "",
      icms_aliquota: Number(produto.icms_aliquota) || 0,
      ipi_aliquota: Number(produto.ipi_aliquota) || 0,
      pis_aliquota: Number(produto.pis_aliquota) || 0,
      cofins_aliquota: Number(produto.cofins_aliquota) || 0,
    });
    setEditingProduto(produto);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const filteredProdutos = produtos?.filter(produto =>
    produto.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.codigo.includes(searchTerm)
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Cadastro de Produtos</h1>
          <p className="text-muted-foreground">Gerencie o catálogo de produtos</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingProduto ? "Editar Produto" : "Novo Produto"}
                </DialogTitle>
                <DialogDescription>
                  Preencha os dados do produto
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-3 gap-4 py-4">
                {/* Dados básicos */}
                <div className="space-y-2">
                  <Label htmlFor="codigo">Código *</Label>
                  <Input
                    id="codigo"
                    value={formData.codigo}
                    onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  />
                </div>

                <div className="col-span-3 space-y-2">
                  <Label htmlFor="descricao">Descrição *</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="codigo_interno">Código Interno</Label>
                  <Input
                    id="codigo_interno"
                    value={formData.codigo_interno}
                    onChange={(e) => setFormData(prev => ({ ...prev, codigo_interno: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ean">EAN</Label>
                  <Input
                    id="ean"
                    value={formData.ean}
                    onChange={(e) => setFormData(prev => ({ ...prev, ean: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ncm">NCM</Label>
                  <Input
                    id="ncm"
                    value={formData.ncm}
                    onChange={(e) => setFormData(prev => ({ ...prev, ncm: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cfop">CFOP</Label>
                  <Input
                    id="cfop"
                    value={formData.cfop}
                    onChange={(e) => setFormData(prev => ({ ...prev, cfop: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unidade">Unidade</Label>
                  <Select
                    value={formData.unidade}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, unidade: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {unidades?.map((unidade) => (
                        <SelectItem key={unidade.id} value={unidade.codigo}>
                          {unidade.codigo} - {unidade.descricao}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preco_unitario">Preço Unitário</Label>
                  <Input
                    id="preco_unitario"
                    type="number"
                    step="0.01"
                    value={formData.preco_unitario}
                    onChange={(e) => setFormData(prev => ({ ...prev, preco_unitario: Number(e.target.value) }))}
                    required
                  />
                </div>

                {/* Relacionamentos */}
                <div className="space-y-2">
                  <Label htmlFor="categoria_id">Categoria</Label>
                  <Select
                    value={formData.categoria_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, categoria_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias?.map((categoria) => (
                        <SelectItem key={categoria.id} value={categoria.id}>
                          {categoria.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="marca_id">Marca</Label>
                  <Select
                    value={formData.marca_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, marca_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma marca" />
                    </SelectTrigger>
                    <SelectContent>
                      {marcas?.map((marca) => (
                        <SelectItem key={marca.id} value={marca.id}>
                          {marca.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fornecedor_id">Fornecedor</Label>
                  <Select
                    value={formData.fornecedor_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, fornecedor_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um fornecedor" />
                    </SelectTrigger>
                    <SelectContent>
                      {fornecedores?.map((fornecedor) => (
                        <SelectItem key={fornecedor.id} value={fornecedor.id}>
                          {fornecedor.nome_razao_social}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Estoque */}
                <div className="space-y-2">
                  <Label htmlFor="estoque_atual">Estoque Atual</Label>
                  <Input
                    id="estoque_atual"
                    type="number"
                    value={formData.estoque_atual}
                    onChange={(e) => setFormData(prev => ({ ...prev, estoque_atual: Number(e.target.value) }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estoque_minimo">Estoque Mínimo</Label>
                  <Input
                    id="estoque_minimo"
                    type="number"
                    value={formData.estoque_minimo}
                    onChange={(e) => setFormData(prev => ({ ...prev, estoque_minimo: Number(e.target.value) }))}
                  />
                </div>

                {/* Dados fiscais */}
                <div className="space-y-2">
                  <Label htmlFor="cst_icms">CST ICMS</Label>
                  <Input
                    id="cst_icms"
                    value={formData.cst_icms}
                    onChange={(e) => setFormData(prev => ({ ...prev, cst_icms: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="csosn">CSOSN</Label>
                  <Input
                    id="csosn"
                    value={formData.csosn}
                    onChange={(e) => setFormData(prev => ({ ...prev, csosn: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icms_aliquota">Alíquota ICMS (%)</Label>
                  <Input
                    id="icms_aliquota"
                    type="number"
                    step="0.01"
                    value={formData.icms_aliquota}
                    onChange={(e) => setFormData(prev => ({ ...prev, icms_aliquota: Number(e.target.value) }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ipi_aliquota">Alíquota IPI (%)</Label>
                  <Input
                    id="ipi_aliquota"
                    type="number"
                    step="0.01"
                    value={formData.ipi_aliquota}
                    onChange={(e) => setFormData(prev => ({ ...prev, ipi_aliquota: Number(e.target.value) }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pis_aliquota">Alíquota PIS (%)</Label>
                  <Input
                    id="pis_aliquota"
                    type="number"
                    step="0.01"
                    value={formData.pis_aliquota}
                    onChange={(e) => setFormData(prev => ({ ...prev, pis_aliquota: Number(e.target.value) }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cofins_aliquota">Alíquota COFINS (%)</Label>
                  <Input
                    id="cofins_aliquota"
                    type="number"
                    step="0.01"
                    value={formData.cofins_aliquota}
                    onChange={(e) => setFormData(prev => ({ ...prev, cofins_aliquota: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingProduto ? "Atualizar" : "Criar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Produtos</CardTitle>
          <CardDescription>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <Input
                placeholder="Buscar por descrição ou código..."
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
                  <TableHead>Código</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProdutos.map((produto) => (
                  <TableRow key={produto.id}>
                    <TableCell className="font-medium">{produto.codigo}</TableCell>
                    <TableCell>{produto.descricao}</TableCell>
                    <TableCell>{produto.unidade}</TableCell>
                    <TableCell>R$ {Number(produto.preco_unitario).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={produto.estoque_atual <= produto.estoque_minimo ? 'destructive' : 'default'}>
                        {produto.estoque_atual}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(produto)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDelete(produto.id)}
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
