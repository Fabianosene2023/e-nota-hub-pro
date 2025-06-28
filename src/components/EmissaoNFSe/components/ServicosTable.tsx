
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ItemNFSe {
  servico_id?: string;
  descricao: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  codigo_servico?: string;
  aliquota_iss: number;
}

interface ServicosTableProps {
  itens: ItemNFSe[];
  valorTotalNota: number;
  onRemoveItem: (index: number) => void;
}

export const ServicosTable = ({ itens, valorTotalNota, onRemoveItem }: ServicosTableProps) => {
  if (itens.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum serviço adicionado
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="w-24">Qtd</TableHead>
              <TableHead className="w-32">Valor Unit.</TableHead>
              <TableHead className="w-32">Valor Total</TableHead>
              <TableHead className="w-24">ISS %</TableHead>
              <TableHead className="w-16">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {itens.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-mono">{item.codigo_servico || '-'}</TableCell>
                <TableCell>{item.descricao}</TableCell>
                <TableCell>{item.quantidade}</TableCell>
                <TableCell>R$ {item.valor_unitario.toFixed(2)}</TableCell>
                <TableCell>R$ {item.valor_total.toFixed(2)}</TableCell>
                <TableCell>{item.aliquota_iss}%</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveItem(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end">
        <div className="text-right">
          <div className="text-lg font-semibold">
            Total dos Serviços: R$ {valorTotalNota.toFixed(2)}
          </div>
          <div className="text-sm text-muted-foreground">
            ISS: R$ {itens.reduce((total, item) => 
              total + (item.valor_total * item.aliquota_iss / 100), 0
            ).toFixed(2)}
          </div>
          <div className="text-sm text-muted-foreground">
            Valor Líquido: R$ {(valorTotalNota - itens.reduce((total, item) => 
              total + (item.valor_total * item.aliquota_iss / 100), 0
            )).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};
