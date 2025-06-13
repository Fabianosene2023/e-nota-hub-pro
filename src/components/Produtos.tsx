
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProdutos, useCreateProduto } from "@/hooks/useProdutos";
import { useEmpresas } from "@/hooks/useEmpresas";
import { Plus, Search, Edit, Trash2, AlertTriangle } from "lucide-react";

export const Produtos = () => {
  const { data: produtos, isLoading } = useProdutos();
  const { data: empresas } = useEmpresas();
  const createProduto = useCreateProduto();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    empresa_id: "",
    nome: "",
    codigo: "",
    codigo_interno: "",
    descricao: "",
    ncm: "",
    ean: "",
    unidade: "UN",
    preco_unitario: "",
    cfop: "5102",
    cst_icms: "060",
    csosn: "",
    icms_aliquota: "0",
    ipi_aliquota: "0",
    pis_aliquota: "0",
    cofins_aliquota: "0",
    estoque_atual: "0",
    estoque_minimo: "0"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.empresa_id) {
      return;
    }

    const produtoData = {
      ...formData,
      preco_unitario: parseFloat(formData.preco_unitario) || 0,
      icms_aliquota: parseFloat(formData.icms_aliquota) || 0,
      ipi_aliquota: parseFloat(formData.ipi_aliquota) || 0,
      pis_aliquota: parseFloat(formData.pis_aliquota) || 0,
      cofins_aliquota: parseFloat(formData.cofins_aliquota) || 0,
      estoque_atual: parseInt(formData.estoque_atual) || 0,
      estoque_minimo: parseInt(formData.estoque_minimo) || 0
    };

    await createProduto.mutateAsync(produtoData);
    setIsDialogOpen(false);
    setFormData({
      empresa_id: "",
      nome: "",
      codigo: "",
      codigo_interno: "",
      descricao: "",
      ncm: "",
      ean: "",
      unidade: "UN",
      preco_unitario: "",
      cfop: "5102",
      cst_icms: "060",
      csosn: "",
      icms_aliquota: "0",
      ipi_aliquota: "0",
      pis_aliquota: "0",
      cofins_aliquota: "0",
      estoque_atual: "0",
      estoque_minimo: "0"
    });
  };

  const filteredProdutos = produtos?.filter(produto =>
    (produto.nome || produto.descricao).toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.codigo.includes(searchTerm)
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Produtos</h2>
          <p className="text-muted-foreground">
            Gerencie seus produtos e serviços
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Novo Produto</DialogTitle>
              <DialogDescription>
                Preencha os dados do produto
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="empresa_id">Empresa</Label>
                  <Select value={formData.empresa_id} onValueChange={(value) => setFormData({...formData, empresa_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a empresa" />
                    </SelectTrigger>
                    <SelectContent>
                      {empresas?.map((empresa) => (
                        <SelectItem key={empresa.id} value={empresa.id}>
                          {empresa.razao_social}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="nome">Nome do Produto</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="codigo">Código</Label>
                  <Input
                    id="codigo"
                    value={formData.codigo}
                    onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="codigo_interno">Código Interno</Label>
                  <Input
                    id="codigo_interno"
                    value={formData.codigo_interno}
                    onChange={(e) => setFormData({...formData, codigo_interno: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Input
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="ncm">NCM</Label>
                  <Input
                    id="ncm"
                    value={formData.ncm}
                    onChange={(e) => setFormData({...formData, ncm: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="ean">EAN</Label>
                  <Input
                    id="ean"
                    value={formData.ean}
                    onChange={(e) => setFormData({...formData, ean: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="unidade">Unidade</Label>
                  <Select value={formData.unidade} onValueChange={(value) => setFormData({...formData, unidade: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UN">UN - Unidade</SelectItem>
                      <SelectItem value="KG">KG - Quilograma</SelectItem>
                      <SelectItem value="MT">MT - Metro</SelectItem>
                      <SelectItem value="LT">LT - Litro</SelectItem>
                      <SelectItem value="PC">PC - Peça</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="preco_unitario">Preço Unitário</Label>
                  <Input
                    id="preco_unitario"
                    type="number"
                    step="0.01"
                    value={formData.preco_unitario}
                    onChange={(e) => setFormData({...formData, preco_unitario: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cfop">CFOP</Label>
                  <Input
                    id="cfop"
                    value={formData.cfop}
                    onChange={(e) => setFormData({...formData, cfop: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="cst_icms">CST ICMS</Label>
                  <Input
                    id="cst_icms"
                    value={formData.cst_icms}
                    onChange={(e) => setFormData({...formData, cst_icms: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="icms_aliquota">Alíquota ICMS (%)</Label>
                  <Input
                    id="icms_aliquota"
                    type="number"
                    step="0.01"
                    value={formData.icms_aliquota}
                    onChange={(e) => setFormData({...formData, icms_aliquota: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="ipi_aliquota">Alíquota IPI (%)</Label>
                  <Input
                    id="ipi_aliquota"
                    type="number"
                    step="0.01"
                    value={formData.ipi_aliquota}
                    onChange={(e) => setFormData({...formData, ipi_aliquota: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="estoque_atual">Estoque Atual</Label>
                  <Input
                    id="estoque_atual"
                    type="number"
                    value={formData.estoque_atual}
                    onChange={(e) => setFormData({...formData, estoque_atual: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="estoque_minimo">Estoque Mínimo</Label>
                  <Input
                    id="estoque_minimo"
                    type="number"
                    value={formData.estoque_minimo}
                    onChange={(e) => setFormData({...formData, estoque_minimo: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createProduto.isPending}>
                  {createProduto.isPending ? "Salvando..." : "Salvar"}
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
            Todos os produtos cadastrados
          </CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <Input
              placeholder="Buscar por nome ou código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
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
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : filteredProdutos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Nenhum produto encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredProdutos.map((produto) => (
                  <TableRow key={produto.id}>
                    <TableCell className="font-medium">
                      {produto.codigo}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{produto.nome || produto.descricao}</p>
                        {produto.ncm && (
                          <p className="text-sm text-muted-foreground">NCM: {produto.ncm}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{produto.unidade}</TableCell>
                    <TableCell>
                      R$ {Number(produto.preco_unitario).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p>{produto.estoque_atual || 0}</p>
                        <p className="text-xs text-muted-foreground">
                          Min: {produto.estoque_minimo || 0}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {(produto.estoque_atual || 0) <= (produto.estoque_minimo || 0) ? (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Baixo
                        </Badge>
                      ) : (
                        <Badge variant="default">Normal</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
