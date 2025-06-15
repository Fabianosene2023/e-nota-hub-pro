
import React from "react";
import { useCtes } from "@/hooks/useCte";
import { Button } from "@/components/ui/button";
import { CteDesacordoDialog } from "@/components/Cte/CteDesacordoDialog";
import { AlertTriangle } from "lucide-react";

export default function CteDesacordoPage() {
  const { data: ctes = [], isLoading } = useCtes();
  const [desacordoOpen, setDesacordoOpen] = React.useState(false);
  const [selectedCteId, setSelectedCteId] = React.useState<string | null>(null);

  const emitidos = ctes.filter((cte: any) => cte.status === "emitido");

  return (
    <div className="max-w-4xl mx-auto mt-6 bg-background rounded shadow">
      <h1 className="text-2xl font-bold p-4 flex gap-2 items-center">
        <AlertTriangle className="text-orange-500" /> Emissão de Desacordo de CT-e
      </h1>
      <div className="p-4">
        {isLoading ? (
          <div>Carregando CT-es emitidos...</div>
        ) : emitidos.length === 0 ? (
          <div className="text-center text-muted-foreground p-8">
            Nenhum CT-e emitido disponível para manifestação de desacordo.
          </div>
        ) : (
          <table className="min-w-full text-sm border">
            <thead className="bg-muted/30">
              <tr>
                <th className="p-2 border">Número</th>
                <th className="p-2 border">Valor Total</th>
                <th className="p-2 border">Natureza da Operação</th>
                <th className="p-2 border">Ações</th>
              </tr>
            </thead>
            <tbody>
              {emitidos.map((cte: any) => (
                <tr key={cte.id}>
                  <td className="p-2 border">{cte.numero}</td>
                  <td className="p-2 border">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(cte.valor_total)}
                  </td>
                  <td className="p-2 border">{cte.natureza_operacao}</td>
                  <td className="p-2 border text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedCteId(cte.id);
                        setDesacordoOpen(true);
                      }}
                    >
                      <AlertTriangle className="mr-1 text-orange-500" size={16} /> Manifestar Desacordo
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <CteDesacordoDialog
        open={desacordoOpen}
        onOpenChange={setDesacordoOpen}
        cteId={selectedCteId}
      />
    </div>
  );
}
