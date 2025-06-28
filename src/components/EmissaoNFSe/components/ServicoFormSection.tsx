
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from '@/hooks/use-toast';

interface ItemNFSe {
  servico_id: string;
  item_nome: string;
  quantidade: number;
  valor_servico: number;
  valor_total: number;
  codigo_servico: string;
  aliquota_iss: number;
}

interface ServicoFormSectionProps {
  servicos: any[];
  onAddItem: (item: ItemNFSe) => void;
  empresaId: string;
}

export const ServicoFormSection = ({ servicos, onAddItem, empresaId }: ServicoFormSectionProps) => {
  const [itemAtual, setItemAtual] = useState({
    servico_id: '',
    quantidade: 1,
    valor_servico: 0,
    codigo_servico: '1.01',
    aliquota_iss: 5
  });

  const adicionarItem = () => {
    if (!itemAtual.servico_id) {
      toast({
        title: "Erro",
        description: "Selecione um serviço",
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

    if (itemAtual.valor_servico <= 0) {
      toast({
        title: "Erro",
        description: "Valor do serviço deve ser maior que zero",
        variant: "destructive",
      });
      return;
    }

    const servico = servicos?.find(s => s.id === itemAtual.servico_id);
    
    if (!servico) {
      toast({
        title: "Erro",
        description: "Serviço não encontrado",
        variant: "destructive",
      });
      return;
    }

    const valorTotal = itemAtual.quantidade * itemAtual.valor_servico;
    
    const novoItem: ItemNFSe = {
      servico_id: servico.id,
      item_nome: servico.nome || servico.descricao || '',
      quantidade: itemAtual.quantidade,
      valor_servico: itemAtual.valor_servico,
      valor_total: valorTotal,
      codigo_servico: itemAtual.codigo_servico,
      aliquota_iss: itemAtual.aliquota_iss
    };

    onAddItem(novoItem);
    
    // Resetar form do item
    setItemAtual({
      servico_id: '',
      quantidade: 1,
      valor_servico: 0,
      codigo_servico: '1.01',
      aliquota_iss: 5
    });

    toast({
      title: "Serviço adicionado",
      description: `${servico.nome || servico.descricao} foi adicionado à nota fiscal`,
    });
  };

  return (
    <div className="grid grid-cols-6 gap-4 p-4 border rounded-lg">
      <div className="space-y-2">
        <Label>Serviço</Label>
        <Select 
          value={itemAtual.servico_id} 
          onValueChange={(value) => {
            const servico = servicos?.find(s => s.id === value);
            setItemAtual({
              ...itemAtual, 
              servico_id: value,
              valor_servico: servico?.preco_unitario || 0,
              codigo_servico: servico?.codigo_servico_municipal || '1.01',
              aliquota_iss: servico?.aliquota_iss || 5
            });
          }}
          disabled={!empresaId}
        >
          <SelectTrigger>
            <SelectValue placeholder={!empresaId ? "Selecione empresa primeiro" : "Selecione"} />
          </SelectTrigger>
          <SelectContent>
            {servicos?.map((servico) => (
              <SelectItem key={servico.id} value={servico.id}>
                {servico.nome || servico.descricao} - R$ {servico.preco_unitario?.toFixed(2)}
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
        <Label>Valor do Serviço</Label>
        <Input
          type="number"
          step="0.01"
          min="0.01"
          value={itemAtual.valor_servico}
          onChange={(e) => setItemAtual({...itemAtual, valor_servico: parseFloat(e.target.value) || 0})}
          placeholder="0,00"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Código do Serviço</Label>
        <Select
          value={itemAtual.codigo_servico}
          onValueChange={(value) => setItemAtual({...itemAtual, codigo_servico: value})}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1.01">1.01 - Análise e desenvolvimento de sistemas</SelectItem>
            <SelectItem value="1.02">1.02 - Programação</SelectItem>
            <SelectItem value="1.03">1.03 - Processamento de dados</SelectItem>
            <SelectItem value="1.04">1.04 - Elaboração de programas</SelectItem>
            <SelectItem value="17.01">17.01 - Assessoria ou consultoria</SelectItem>
            <SelectItem value="25.01">25.01 - Serviços funerários</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Alíquota ISS (%)</Label>
        <Select
          value={itemAtual.aliquota_iss.toString()}
          onValueChange={(value) => setItemAtual({...itemAtual, aliquota_iss: parseFloat(value)})}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2">2%</SelectItem>
            <SelectItem value="3">3%</SelectItem>
            <SelectItem value="4">4%</SelectItem>
            <SelectItem value="5">5%</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>&nbsp;</Label>
        <Button 
          type="button" 
          onClick={adicionarItem} 
          className="w-full"
          disabled={!itemAtual.servico_id || itemAtual.quantidade <= 0 || itemAtual.valor_servico <= 0}
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar
        </Button>
      </div>
    </div>
  );
};
