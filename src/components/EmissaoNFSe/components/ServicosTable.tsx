
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";

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
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
}

export const ServicosTable = ({ itens, onEdit, onRemove }: ServicosTableProps) => {
  if (itens.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum serviço adicionado
      </div>
    );
  }

  const valorTotalNota = itens.reduce((total, item) => total + item.valor_total, 0);

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
              <TableHead className="w-24">Ações</TableHead>
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
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(index)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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
