
import React from "react";
import { FileText, Plus } from "lucide-react";
import { NfeComplementarForm } from "./NfeComplementarForm";

export const NfeComplementar: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Plus className="h-6 w-6 text-green-600" />
        <div>
          <h1 className="text-2xl font-bold">Emissão de NFe Complementar</h1>
          <p className="text-sm text-muted-foreground">
            Emita notas fiscais complementares para ajustes de valor ou correções
          </p>
        </div>
      </div>

      <NfeComplementarForm />
    </div>
  );
};
