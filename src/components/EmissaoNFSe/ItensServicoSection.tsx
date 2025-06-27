
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useServicosManager } from '@/hooks/useServicosManager';
import { toast } from '@/hooks/use-toast';
import { Plus, Trash2 } from "lucide-react";

interface ItemNFSe {
  servico_id: string;
  item_nome: string;
  quantidade: number;
  valor_servico: number;
  valor_total: number;
  codigo_servico: string;
  aliquota_iss: number;
}

interface ItensServicoSectionProps {
  itens: ItemNFSe[];
  setItens: (itens: ItemNFSe[]) => void;
  empresaId: string;
  valorTotalNota: number;
}

export const ItensServicoSection = ({ itens, setItens, empresaId, valorTotalNota }: ItensServicoSectionProps) => {
  const [itemAtual, setItemAtual] = useState({
    servico_id: '',
    quantidade: 1,
    valor_servico: 0,
    codigo_servico: '1.01',
    aliquota_iss: 5
  });

  const { data: servicos } = useServicosManager(empresaId);

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

    setItens([...itens, novoItem]);
    
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

  const removerItem = (index: number) => {
    const itemRemovido = itens[index];
    setItens(itens.filter((_, i) => i !== index));
    
    toast({
      title: "Serviço removido",
      description: `${itemRemovido.item_nome} foi removido da nota fiscal`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Serviços da NFSe</CardTitle>
        <CardDescription>
          Adicione os serviços da nota fiscal de serviços eletrônica
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Adicionar Serviço */}
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

        {/* Lista de Serviços */}
        {itens.length > 0 && (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Qtd</TableHead>
                  <TableHead>Valor do Serviço</TableHead>
                  <TableHead>Código do Serviço</TableHead>
                  <TableHead>Alíquota ISS (%)</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itens.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.item_nome}</TableCell>
                    <TableCell>{item.quantidade}</TableCell>
                    <TableCell>R$ {item.valor_servico.toFixed(2)}</TableCell>
                    <TableCell>{item.codigo_servico}</TableCell>
                    <TableCell>{item.aliquota_iss}%</TableCell>
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
                  <TableCell colSpan={5} className="font-bold">Total Geral:</TableCell>
                  <TableCell className="font-bold">R$ {valorTotalNota.toFixed(2)}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}

        {itens.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum serviço adicionado. Use o formulário acima para adicionar serviços.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
