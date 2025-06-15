
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield } from "lucide-react";

interface SefazConfigFormProps {
  formData: {
    ambiente: 'homologacao' | 'producao';
    timeout_sefaz: number;
    serie_nfe: number;
    serie_nfce: number;
    tentativas_reenvio: number;
  };
  onFormDataChange: (data: Partial<SefazConfigFormProps['formData']>) => void;
}

export const SefazConfigForm: React.FC<SefazConfigFormProps> = ({ formData, onFormDataChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Configurações da SEFAZ
        </CardTitle>
        <CardDescription>
          Configure os parâmetros de integração com a Secretaria da Fazenda
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ambiente">Ambiente SEFAZ</Label>
            <Select
              value={formData.ambiente}
              onValueChange={(value: 'homologacao' | 'producao') => 
                onFormDataChange({ ambiente: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="homologacao">Homologação (Testes)</SelectItem>
                <SelectItem value="producao">Produção (Real)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeout">Timeout (ms)</Label>
            <Input
              id="timeout"
              type="number"
              value={formData.timeout_sefaz}
              onChange={(e) => onFormDataChange({ 
                timeout_sefaz: parseInt(e.target.value) || 30000 
              })}
              min="5000"
              max="120000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="serie_nfe">Série NFe</Label>
            <Input
              id="serie_nfe"
              type="number"
              value={formData.serie_nfe}
              onChange={(e) => onFormDataChange({ 
                serie_nfe: parseInt(e.target.value) || 1 
              })}
              min="1"
              max="999"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="serie_nfce">Série NFCe</Label>
            <Input
              id="serie_nfce"
              type="number"
              value={formData.serie_nfce}
              onChange={(e) => onFormDataChange({ 
                serie_nfce: parseInt(e.target.value) || 1 
              })}
              min="1"
              max="999"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tentativas">Tentativas de Reenvio</Label>
            <Input
              id="tentativas"
              type="number"
              value={formData.tentativas_reenvio}
              onChange={(e) => onFormDataChange({ 
                tentativas_reenvio: parseInt(e.target.value) || 3 
              })}
              min="1"
              max="10"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
