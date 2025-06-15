
import React from "react";
import { FileText, MapPin } from "lucide-react";
import { useEmitirNfseUberaba } from "@/hooks/useNfseUberaba";
import { NfseEmissaoForm } from "./NfseEmissaoForm";
import { NfseResultCard } from "./NfseResultCard";

export const NfseEmissao: React.FC = () => {
  const emitirNfse = useEmitirNfseUberaba();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="h-6 w-6 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold">Emissão de NFSe</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>Uberaba - MG</span>
          </div>
        </div>
      </div>

      <NfseEmissaoForm />

      {emitirNfse.isSuccess && emitirNfse.data && (
        <NfseResultCard data={emitirNfse.data} />
      )}
    </div>
  );
};
