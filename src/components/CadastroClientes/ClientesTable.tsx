
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";

interface ClientesTableProps {
  clientes: any[];
  onEdit: (cliente: any) => void;
  onDelete: (id: string) => void;
  deleteLoading?: boolean;
}

export function ClientesTable({ clientes, onEdit, onDelete, deleteLoading }: ClientesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome/Razão Social</TableHead>
          <TableHead>CPF/CNPJ</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Cidade</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clientes.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-muted-foreground">
              Nenhum cliente encontrado.
            </TableCell>
          </TableRow>
        ) : (
          clientes.map((cliente) => (
            <TableRow key={cliente.id}>
              <TableCell className="font-medium">{cliente.nome_razao_social}</TableCell>
              <TableCell>{cliente.cpf_cnpj}</TableCell>
              <TableCell>
                <Badge variant={cliente.tipo_pessoa === 'fisica' ? 'default' : 'secondary'}>
                  {cliente.tipo_pessoa === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                </Badge>
              </TableCell>
              <TableCell>{cliente.cidade}</TableCell>
              <TableCell>{cliente.estado}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(cliente)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(cliente.id)}
                    disabled={deleteLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
