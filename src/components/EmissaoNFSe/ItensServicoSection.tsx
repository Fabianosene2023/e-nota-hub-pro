
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import { useServicos } from "@/hooks/useServicos";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface ItemNFSe {
  servico_id?: string;
  descricao: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  codigo_servico?: string;
  aliquota_iss: number;
}

interface ItensServicoSectionProps {
  itens: ItemNFSe[];
  setItens: (itens: ItemNFSe[]) => void;
  valorTotalNota: number;
  prestadorId: string;
}

export const ItensServicoSection = ({ itens, setItens, valorTotalNota, prestadorId }: ItensServicoSectionProps) => {
  const [novoItem, setNovoItem] = useState<Partial<ItemNFSe>>({
    descricao: '',
    quantidade: 1,
    valor_unitario: 0,
    aliquota_iss: 5,
  });

  // Buscar empresa_id do prestador selecionado
  const { data: prestadorData } = useQuery({
    queryKey: ['prestador-empresa', prestadorId],
    queryFn: async () => {
      if (!prestadorId) return null;
      
      console.log('Fetching prestador data for:', prestadorId);
      
      const { data, error } = await supabase
        .from('prestadores_servico')
        .select('empresa_id')
        .eq('id', prestadorId)
        .single();
      
      if (error) {
        console.error('Error fetching prestador:', error);
        return null;
      }
      
      console.log('Prestador data:', data);
      return data;
    },
    enabled: !!prestadorId,
  });

  const { data: servicos, isLoading: loadingServicos } = useServicos(prestadorData?.empresa_id || '');

  console.log('Servicos loaded:', servicos);

  const adicionarItem = () => {
    if (!novoItem.descricao || !novoItem.valor_unitario) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha a descrição e o valor unitário",
        variant: "destructive",
      });
      return;
    }

    const quantidade = Number(novoItem.quantidade) || 1;
    const valorUnitario = Number(novoItem.valor_unitario) || 0;
    const valorTotal = quantidade * valorUnitario;

    const item: ItemNFSe = {
      servico_id: novoItem.servico_id,
      descricao: novoItem.descricao!,
      quantidade,
      valor_unitario: valorUnitario,
      valor_total: valorTotal,
      codigo_servico: novoItem.codigo_servico,
      aliquota_iss: Number(novoItem.aliquota_iss) || 5,
    };

    setItens([...itens, item]);
    setNovoItem({
      descricao: '',
      quantidade: 1,
      valor_unitario: 0,
      aliquota_iss: 5,
    });

    toast({
      title: "Item adicionado",
      description: `${item.descricao} foi adicionado à nota`,
    });
  };

  const removerItem = (index: number) => {
    const itemRemovido = itens[index];
    setItens(itens.filter((_, i) => i !== index));
    
    toast({
      title: "Item removido",
      description: `${itemRemovido.descricao} foi removido da nota`,
    });
  };

  const handleServicoChange = (servicoId: string) => {
    const servico = servicos?.find(s => s.id === servicoId);
    if (servico) {
      setNovoItem({
        ...novoItem,
        servico_id: servicoId,
        descricao: servico.nome,
        valor_unitario: servico.preco_unitario,
        codigo_servico: servico.codigo_servico_municipal,
        aliquota_iss: servico.aliquota_iss,
      });
    }
  };

  if (!prestadorId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Serviços da NFSe</CardTitle>
          <CardDescription>Selecione um prestador primeiro</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (loadingServicos) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Serviços da NFSe</CardTitle>
          <CardDescription>Carregando serviços...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Serviços da NFSe</CardTitle>
        <CardDescription>
          Adicione os serviços prestados
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Formulário para adicionar item */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border rounded-lg">
          <div className="md:col-span-2">
            <Label htmlFor="servico">Serviço</Label>
            <Select onValueChange={handleServicoChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um serviço" />
              </SelectTrigger>
              <SelectContent>
                {servicos?.map((servico) => (
                  <SelectItem key={servico.id} value={servico.id}>
                    {servico.nome} - R$ {servico.preco_unitario.toFixed(2)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="descricao">Descrição *</Label>
            <Textarea
              id="descricao"
              value={novoItem.descricao}
              onChange={(e) => setNovoItem({ ...novoItem, descricao: e.target.value })}
              placeholder="Descrição detalhada do serviço"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="quantidade">Qtd</Label>
            <Input
              id="quantidade"
              type="number"
              value={novoItem.quantidade}
              onChange={(e) => setNovoItem({ ...novoItem, quantidade: Number(e.target.value) })}
              min="0.001"
              step="0.001"
            />
          </div>

          <div>
            <Label htmlFor="valor_unitario">Valor Unit. *</Label>
            <Input
              id="valor_unitario"
              type="number"
              value={novoItem.valor_unitario}
              onChange={(e) => setNovoItem({ ...novoItem, valor_unitario: Number(e.target.value) })}
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <Label htmlFor="codigo_servico">Código Serviço</Label>
            <Input
              id="codigo_servico"
              value={novoItem.codigo_servico || ''}
              onChange={(e) => setNovoItem({ ...novoItem, codigo_servico: e.target.value })}
              placeholder="Ex: 1.01"
            />
          </div>

          <div>
            <Label htmlFor="aliquota_iss">Alíquota ISS (%)</Label>
            <Input
              id="aliquota_iss"
              type="number"
              value={novoItem.aliquota_iss}
              onChange={(e) => setNovoItem({ ...novoItem, aliquota_iss: Number(e.target.value) })}
              min="0"
              max="5"
              step="0.01"
            />
          </div>

          <div className="md:col-span-2 lg:col-span-4 flex justify-end">
            <Button type="button" onClick={adicionarItem}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Item
            </Button>
          </div>
        </div>

        {/* Tabela de itens */}
        {itens.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum serviço adicionado. Use o formulário acima para adicionar serviços.
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Qtd</TableHead>
                  <TableHead>Valor Unit.</TableHead>
                  <TableHead>ISS (%)</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itens.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="max-w-xs truncate">{item.descricao}</TableCell>
                    <TableCell>{item.quantidade}</TableCell>
                    <TableCell>R$ {item.valor_unitario.toFixed(2)}</TableCell>
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
                  <TableCell colSpan={4} className="font-bold">Total Geral:</TableCell>
                  <TableCell className="font-bold">R$ {valorTotalNota.toFixed(2)}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
