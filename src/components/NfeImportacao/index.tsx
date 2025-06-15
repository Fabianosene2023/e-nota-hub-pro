
import React from "react";
import { FileUp, Download } from "lucide-react";
import { NfeImportacaoForm } from "./NfeImportacaoForm";

export const NfeImportacao: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <FileUp className="h-6 w-6 text-purple-600" />
        <div>
          <h1 className="text-2xl font-bold">Importação de NFe</h1>
          <p className="text-sm text-muted-foreground">
            Importe notas fiscais através de arquivo XML ou chave de acesso
          </p>
        </div>
      </div>

      <NfeImportacaoForm />
    </div>
  );
};
