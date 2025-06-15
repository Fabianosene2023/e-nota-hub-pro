
import React from "react";
import { Edit, FileText } from "lucide-react";
import { NfeAjusteForm } from "./NfeAjusteForm";

export const NfeAjuste: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Edit className="h-6 w-6 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold">Ajuste de NFe</h1>
          <p className="text-sm text-muted-foreground">
            Realize ajustes e correções em notas fiscais já emitidas
          </p>
        </div>
      </div>

      <NfeAjusteForm />
    </div>
  );
};
