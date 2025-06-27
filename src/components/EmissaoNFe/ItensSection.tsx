
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useProdutosManager } from '@/hooks/useProdutosManager';
import { toast } from '@/hooks/use-toast';
import { Plus, Trash2 } from "lucide-react";

interface ItemNFe {
  produto_id: string;
  item_nome: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  cfop: string;
  tipo: 'produto';
}

interface ItensSectionProps {
  itens: ItemNFe[];
  setItens: (itens: ItemNFe[]) => void;
  empresaId: string;
  valorTotalNota: number;
}

export const ItensSection = ({ itens, setItens, empresaId, valorTotalNota }: ItensSectionProps) => {
  const [itemAtual, setItemAtual] = useState({
    produto_id: '',
    quantidade: 1,
    valor_unitario: 0,
    cfop: '5102'
  });

  const { data: produtos } = useProdutosManager(empresaId);

  const adicionarItem = () => {
    if (!itemAtual.produto_id) {
      toast({
        title: "Erro",
        description: "Selecione um produto",
        variant: "destructive",
      });
      return;
    }

    if (itemAtual.quantidade <= 0) {
      toast({
        title: "Erro",
        description: "Quantidade deve ser maior que zero",
        variant: "destructive",
      });
      return;
    }

    if (itemAtual.valor_unitario <= 0) {
      toast({
        title: "Erro",
        description: "Valor unitário deve ser maior que zero",
        variant: "destructive",
      });
      return;
    }

    const produto = produtos?.find(p => p.id === itemAtual.produto_id);
    
    if (!produto) {
      toast({
        title: "Erro",
        description: "Produto não encontrado",
        variant: "destructive",
      });
      return;
    }

    const valorTotal = itemAtual.quantidade * itemAtual.valor_unitario;
    
    const novoItem: ItemNFe = {
      produto_id: produto.id,
      item_nome: produto.nome || produto.descricao || '',
      quantidade: itemAtual.quantidade,
      valor_unitario: itemAtual.valor_unitario,
      valor_total: valorTotal,
      cfop: itemAtual.cfop,
      tipo: 'produto'
    };

    setItens([...itens, novoItem]);
    
    // Resetar form do item
    setItemAtual({
      produto_id: '',
      quantidade: 1,
      valor_unitario: 0,
      cfop: '5102'
    });

    toast({
      title: "Produto adicionado",
      description: `${produto.nome || produto.descricao} foi adicionado à nota fiscal`,
    });
  };

  const removerItem = (index: number) => {
    const itemRemovido = itens[index];
    setItens(itens.filter((_, i) => i !== index));
    
    toast({
      title: "Produto removido",
      description: `${itemRemovido.item_nome} foi removido da nota fiscal`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Produtos da NFe</CardTitle>
        <CardDescription>
          Adicione os produtos da nota fiscal eletrônica
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Adicionar Produto */}
        <div className="grid grid-cols-5 gap-4 p-4 border rounded-lg">
          <div className="space-y-2">
            <Label>Produto</Label>
            <Select 
              value={itemAtual.produto_id} 
              onValueChange={(value) => {
                const produto = produtos?.find(p => p.id === value);
                setItemAtual({
                  ...itemAtual, 
                  produto_id: value,
                  valor_unitario: produto?.preco_unitario || 0
                });
              }}
              disabled={!empresaId}
            >
              <SelectTrigger>
                <SelectValue placeholder={!empresaId ? "Selecione empresa primeiro" : "Selecione produto"} />
              </SelectTrigger>
              <SelectContent>
                {produtos?.map((produto) => (
                  <SelectItem key={produto.id} value={produto.id}>
                    {produto.nome || produto.descricao} - R$ {produto.preco_unitario?.toFixed(2)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Quantidade</Label>
            <Input
              type="number"
              step="0.01"
              min="0.01"
              value={itemAtual.quantidade}
              onChange={(e) => setItemAtual({...itemAtual, quantidade: parseFloat(e.target.value) || 0})}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Valor Unitário</Label>
            <Input
              type="number"
              step="0.01"
              min="0.01"
              value={itemAtual.valor_unitario}
              onChange={(e) => setItemAtual({...itemAtual, valor_unitario: parseFloat(e.target.value) || 0})}
            />
          </div>
          
          <div className="space-y-2">
            <Label>CFOP</Label>
            <Input
              value={itemAtual.cfop}
              onChange={(e) => setItemAtual({...itemAtual, cfop: e.target.value})}
              placeholder="5102"
            />
          </div>
          
          <div className="space-y-2">
            <Label>&nbsp;</Label>
            <Button 
              type="button" 
              onClick={adicionarItem} 
              className="w-full"
              disabled={!itemAtual.produto_id || itemAtual.quantidade <= 0 || itemAtual.valor_unitario <= 0}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </div>

        {/* Lista de Produtos */}
        {itens.length > 0 && (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Qtd</TableHead>
                  <TableHead>Valor Unit.</TableHead>
                  <TableHead>CFOP</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itens.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.item_nome}</TableCell>
                    <TableCell>{item.quantidade}</TableCell>
                    <TableCell>R$ {item.valor_unitario.toFixed(2)}</TableCell>
                    <TableCell>{item.cfop}</TableCell>
                    <TableCell>R$ {item.valor_total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="sm"
                        onClick={() => removerItem(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50">
                  <TableCell colSpan={4} className="font-bold">Total Geral:</TableCell>
                  <TableCell className="font-bold">R$ {valorTotalNota.toFixed(2)}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}

        {itens.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum produto adicionado. Use o formulário acima para adicionar produtos.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
