
import React from "react";
import { Download, FileText } from "lucide-react";
import { NfeExportacaoForm } from "./NfeExportacaoForm";

export const NfeExportacao: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Download className="h-6 w-6 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold">Exportação de NFe</h1>
          <p className="text-sm text-muted-foreground">
            Exporte notas fiscais em diversos formatos (XML, PDF, Excel)
          </p>
        </div>
      </div>

      <NfeExportacaoForm />
    </div>
  );
};
