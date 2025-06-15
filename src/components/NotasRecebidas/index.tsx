
import React from "react";
import { Package, FileText } from "lucide-react";
import { NotasRecebidasForm } from "./NotasRecebidasForm";

export const NotasRecebidas: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Package className="h-6 w-6 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold">Notas Recebidas (MDF-e)</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie e visualize os Manifestos de Documentos Fiscais Eletrônicos recebidos
          </p>
        </div>
      </div>

      <NotasRecebidasForm />
    </div>
  );
};
