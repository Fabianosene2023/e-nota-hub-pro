
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from '@/hooks/use-toast';

interface ItemNFe {
  produto_id: string;
  item_nome: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  cfop: string;
  tipo: 'produto';
}

interface ProdutoFormSectionProps {
  produtos: any[];
  onAddItem: (item: ItemNFe) => void;
  empresaId: string;
}

export const ProdutoFormSection = ({ produtos, onAddItem, empresaId }: ProdutoFormSectionProps) => {
  const [itemAtual, setItemAtual] = useState({
    produto_id: '',
    quantidade: 1,
    valor_unitario: 0,
    cfop: '5102'
  });

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

    onAddItem(novoItem);
    
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

  return (
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
  );
};
