
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface NfseResultData {
  numero_nfse: string;
  codigo_verificacao?: string;
  valor_total: number;
  data_emissao: string;
}

interface NfseResultCardProps {
  data: NfseResultData;
}

export const NfseResultCard: React.FC<NfseResultCardProps> = ({ data }) => {
  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="text-green-700">NFSe Emitida com Sucesso!</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Número da NFSe:</strong> {data.numero_nfse}
          </div>
          {data.codigo_verificacao && (
            <div>
              <strong>Código de Verificação:</strong> {data.codigo_verificacao}
            </div>
          )}
          <div>
            <strong>Valor Total:</strong> R$ {data.valor_total?.toFixed(2)}
          </div>
          <div>
            <strong>Data de Emissão:</strong> {new Date(data.data_emissao).toLocaleDateString('pt-BR')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
