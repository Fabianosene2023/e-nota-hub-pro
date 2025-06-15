
import * as React from "react";
import { Button } from "@/components/ui/button";
import { useCtes, useCteDelete } from "@/hooks/useCte";
import { CteForm } from "./CteForm";
import { Pencil, Trash, Plus } from "lucide-react";

export function CteTable() {
  const { data: ctes = [], isLoading } = useCtes();
  const remove = useCteDelete();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editData, setEditData] = React.useState<any | null>(null);

  if (isLoading) {
    return <div className="p-4">Carregando CT-es...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">CT-es</h2>
        <Button onClick={() => { setFormOpen(true); setEditData(null); }}>
          <Plus size={16} className="mr-1" />
          Novo CT-e
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead className="bg-muted/30">
            <tr>
              <th className="p-2 border">Número</th>
              <th className="p-2 border">Valor Total</th>
              <th className="p-2 border">Natureza da Operação</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border w-24">Ações</th>
            </tr>
          </thead>
          <tbody>
            {ctes.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-6">Nenhum CT-e cadastrado ainda.</td>
              </tr>
            )}
            {ctes.map((cte: any) => (
              <tr key={cte.id}>
                <td className="p-2 border">{cte.numero}</td>
                <td className="p-2 border">{cte.valor_total}</td>
                <td className="p-2 border">{cte.natureza_operacao}</td>
                <td className="p-2 border">{cte.status}</td>
                <td className="p-2 border flex gap-1 justify-center">
                  <Button variant="ghost" size="sm" onClick={() => { setEditData(cte); setFormOpen(true); }}>
                    <Pencil size={14} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => remove.mutate(cte.id)}>
                    <Trash size={14} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CteForm open={formOpen} onOpenChange={setFormOpen} initialData={editData} />
    </div>
  );
}
