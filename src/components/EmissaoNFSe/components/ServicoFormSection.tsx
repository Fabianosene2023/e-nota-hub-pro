
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useServicosManager } from '@/hooks/useServicosManager';
import { useEmpresasManager } from '@/hooks/useEmpresasManager';
import { toast } from '@/hooks/use-toast';

interface ItemNFSe {
  servico_id?: string;
  descricao: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  codigo_servico?: string;
  aliquota_iss: number;
}

interface ServicoFormSectionProps {
  onAddItem: (item: ItemNFSe) => void;
}

export const ServicoFormSection = ({ onAddItem }: ServicoFormSectionProps) => {
  const { data: empresas } = useEmpresasManager();
  const empresaId = empresas?.[0]?.id || '';
  const { data: servicos } = useServicosManager(empresaId);
  
  const [itemForm, setItemForm] = useState({
    servico_id: '',
    descricao: '',
    quantidade: 1,
    valor_unitario: 0,
    codigo_servico: '',
    aliquota_iss: 5
  });

  const handleServicoChange = (servicoId: string) => {
    const servico = servicos?.find(s => s.id === servicoId);
    if (servico) {
      setItemForm({
        ...itemForm,
        servico_id: servicoId,
        descricao: servico.descricao || servico.nome,
        valor_unitario: Number(servico.preco_unitario),
        codigo_servico: servico.codigo_servico_municipal || servico.codigo,
        aliquota_iss: Number(servico.aliquota_iss) || 5
      });
    }
  };

  const handleAddItem = () => {
    if (!itemForm.descricao || itemForm.valor_unitario <= 0) {
      toast({
        title: "Erro",
        description: "Preencha descrição e valor do serviço",
        variant: "destructive",
      });
      return;
    }

    const valor_total = itemForm.quantidade * itemForm.valor_unitario;
    
    onAddItem({
      ...itemForm,
      valor_total
    });

    setItemForm({
      servico_id: '',
      descricao: '',
      quantidade: 1,
      valor_unitario: 0,
      codigo_servico: '',
      aliquota_iss: 5
    });
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <h4 className="font-medium">Adicionar Serviço</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="servico">Serviço Cadastrado</Label>
          <Select value={itemForm.servico_id} onValueChange={handleServicoChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um serviço" />
            </SelectTrigger>
            <SelectContent>
              {servicos?.map((servico) => (
                <SelectItem key={servico.id} value={servico.id}>
                  {servico.codigo} - {servico.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="codigo_servico">Código do Serviço</Label>
          <Input
            id="codigo_servico"
            value={itemForm.codigo_servico}
            onChange={(e) => setItemForm({...itemForm, codigo_servico: e.target.value})}
            placeholder="1.01"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="aliquota_iss">Alíquota ISS (%)</Label>
          <Input
            id="aliquota_iss"
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={itemForm.aliquota_iss}
            onChange={(e) => setItemForm({...itemForm, aliquota_iss: Number(e.target.value)})}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição do Serviço *</Label>
        <Input
          id="descricao"
          value={itemForm.descricao}
          onChange={(e) => setItemForm({...itemForm, descricao: e.target.value})}
          placeholder="Descrição detalhada do serviço prestado"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantidade">Quantidade</Label>
          <Input
            id="quantidade"
            type="number"
            min="0.01"
            step="0.01"
            value={itemForm.quantidade}
            onChange={(e) => setItemForm({...itemForm, quantidade: Number(e.target.value)})}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="valor_unitario">Valor do Serviço *</Label>
          <Input
            id="valor_unitario"
            type="number"
            min="0.01"
            step="0.01"
            value={itemForm.valor_unitario}
            onChange={(e) => setItemForm({...itemForm, valor_unitario: Number(e.target.value)})}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Valor Total</Label>
          <Input
            value={(itemForm.quantidade * itemForm.valor_unitario).toFixed(2)}
            readOnly
            className="bg-muted"
          />
        </div>
      </div>

      <Button type="button" onClick={handleAddItem} className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Adicionar Serviço
      </Button>
    </div>
  );
};
