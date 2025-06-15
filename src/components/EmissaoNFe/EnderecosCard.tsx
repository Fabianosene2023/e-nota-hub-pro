
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";

interface EnderecosCardProps {
  formData: any;
  onInputChange: (field: string, value: string | number) => void;
}

export const EnderecosCard = ({ formData, onInputChange }: EnderecosCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Endereços
        </CardTitle>
        <CardDescription>
          Endereços de faturamento e entrega
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="endereco_faturamento">Endereço para Faturamento *</Label>
          <Textarea
            id="endereco_faturamento"
            value={formData.endereco_faturamento}
            onChange={(e) => onInputChange('endereco_faturamento', e.target.value)}
            placeholder="Rua, número, bairro, cidade - UF, CEP"
            rows={2}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endereco_entrega">Endereço para Entrega *</Label>
          <Textarea
            id="endereco_entrega"
            value={formData.endereco_entrega}
            onChange={(e) => onInputChange('endereco_entrega', e.target.value)}
            placeholder="Rua, número, bairro, cidade - UF, CEP"
            rows={2}
            required
          />
        </div>
      </CardContent>
    </Card>
  );
};
