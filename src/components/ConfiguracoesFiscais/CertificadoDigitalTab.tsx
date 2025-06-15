
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from '@/hooks/use-toast';
import { ConfiguracoesFiscaisFormData } from './types';

interface CertificadoDigitalTabProps {
  formData: ConfiguracoesFiscaisFormData;
  onFormDataChange: (data: Partial<ConfiguracoesFiscaisFormData>) => void;
}

export const CertificadoDigitalTab: React.FC<CertificadoDigitalTabProps> = ({
  formData,
  onFormDataChange
}) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        onFormDataChange({ certificado_a1_data: base64 });
        toast({
          title: "Sucesso!",
          description: "Certificado carregado com sucesso",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Certificado Digital A1</CardTitle>
        <CardDescription>
          Configure o certificado digital para assinatura das NFe
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="certificado">Arquivo do Certificado (.p12/.pfx)</Label>
          <Input
            id="certificado"
            type="file"
            accept=".p12,.pfx"
            onChange={handleFileUpload}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="senha">Senha do Certificado</Label>
          <Input
            id="senha"
            type="password"
            placeholder="Digite a senha do certificado"
            value={formData.certificado_a1_senha}
            onChange={(e) => onFormDataChange({ certificado_a1_senha: e.target.value })}
          />
        </div>
      </CardContent>
    </Card>
  );
};
