
import React from "react";
import { Search, FileText } from "lucide-react";
import { ConsultaDocumentosForm } from "./ConsultaDocumentosForm";

export const ConsultaDocumentos: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Search className="h-6 w-6 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold">Consulta de Documentos</h1>
          <p className="text-sm text-muted-foreground">
            Consulte e visualize documentos fiscais emitidos
          </p>
        </div>
      </div>

      <ConsultaDocumentosForm />
    </div>
  );
};
