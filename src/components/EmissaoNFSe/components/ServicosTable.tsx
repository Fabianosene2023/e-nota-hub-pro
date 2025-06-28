
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react";
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

interface ServicosTableProps {
  itens: ItemNFSe[];
  valorTotalNota: number;
  onRemoveItem: (index: number) => void;
}

export const ServicosTable = ({ itens, valorTotalNota, onRemoveItem }: ServicosTableProps) => {
  const removerItem = (index: number) => {
    const itemRemovido = itens[index];
    onRemoveItem(index);
    
    toast({
      title: "Serviço removido",
      description: `${itemRemovido.item_nome} foi removido da nota fiscal`,
    });
  };

  if (itens.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum serviço adicionado. Use o formulário acima para adicionar serviços.
      </div>
    );
  }

  return (
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
  );
};
