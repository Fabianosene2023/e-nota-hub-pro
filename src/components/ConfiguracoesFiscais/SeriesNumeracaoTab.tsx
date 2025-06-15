
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ConfiguracoesFiscaisFormData } from './types';

interface SeriesNumeracaoTabProps {
  formData: ConfiguracoesFiscaisFormData;
  onFormDataChange: (data: Partial<ConfiguracoesFiscaisFormData>) => void;
}

export const SeriesNumeracaoTab: React.FC<SeriesNumeracaoTabProps> = ({
  formData,
  onFormDataChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Séries e Numeração</CardTitle>
        <CardDescription>
          Configure as séries e próximos números para NFe e NFCe
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="serie_nfe">Série NFe</Label>
            <Input
              id="serie_nfe"
              type="number"
              min="1"
              max="999"
              value={formData.serie_nfe}
              onChange={(e) => onFormDataChange({ serie_nfe: parseInt(e.target.value) })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="serie_nfce">Série NFCe</Label>
            <Input
              id="serie_nfce"
              type="number"
              min="1"
              max="999"
              value={formData.serie_nfce}
              onChange={(e) => onFormDataChange({ serie_nfce: parseInt(e.target.value) })}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="proxima_num_nf">Próximo Número NFe</Label>
          <Input
            id="proxima_num_nf"
            type="number"
            min="1"
            value={formData.proxima_num_nf}
            onChange={(e) => onFormDataChange({ proxima_num_nf: parseInt(e.target.value) })}
          />
        </div>
      </CardContent>
    </Card>
  );
};
