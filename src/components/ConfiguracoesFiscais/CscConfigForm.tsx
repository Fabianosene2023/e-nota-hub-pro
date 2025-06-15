
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface CscConfigFormProps {
  formData: {
    csc_id: string;
    csc_token: string;
  };
  onFormDataChange: (data: Partial<CscConfigFormProps['formData']>) => void;
}

export const CscConfigForm: React.FC<CscConfigFormProps> = ({ formData, onFormDataChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações NFCe (CSC)</CardTitle>
        <CardDescription>
          Código de Segurança do Contribuinte para NFCe
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="csc_id">CSC ID</Label>
            <Input
              id="csc_id"
              value={formData.csc_id}
              onChange={(e) => onFormDataChange({ csc_id: e.target.value })}
              placeholder="Identificador do CSC"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="csc_token">CSC Token</Label>
            <Input
              id="csc_token"
              type="password"
              value={formData.csc_token}
              onChange={(e) => onFormDataChange({ csc_token: e.target.value })}
              placeholder="Token do CSC"
            />
          </div>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            O CSC é obrigatório apenas para emissão de NFCe. Consulte a SEFAZ do seu estado para obter esses dados.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
