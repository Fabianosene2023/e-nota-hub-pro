
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ConfiguracoesFiscaisFormData } from './types';

interface RegimeFiscalTabProps {
  formData: ConfiguracoesFiscaisFormData;
  onFormDataChange: (data: Partial<ConfiguracoesFiscaisFormData>) => void;
}

export const RegimeFiscalTab: React.FC<RegimeFiscalTabProps> = ({
  formData,
  onFormDataChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Regime Fiscal e Tributário</CardTitle>
        <CardDescription>
          Configure o regime fiscal e tributário da empresa
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="regime_fiscal">Regime Fiscal</Label>
          <Select 
            value={formData.regime_fiscal} 
            onValueChange={(value) => onFormDataChange({ regime_fiscal: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="simples_nacional">Simples Nacional</SelectItem>
              <SelectItem value="simples_nacional_mei">Simples Nacional - MEI</SelectItem>
              <SelectItem value="lucro_presumido">Lucro Presumido</SelectItem>
              <SelectItem value="lucro_real">Lucro Real</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="regime_tributario">Regime Tributário</Label>
          <Select 
            value={formData.regime_tributario} 
            onValueChange={(value) => onFormDataChange({ regime_tributario: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="simples_nacional">Simples Nacional</SelectItem>
              <SelectItem value="simples_nacional_excesso">Simples Nacional - Excesso de Sublimite de Receita Bruta</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="enviar_nfe_por_email">Enviar NFe por E-mail</Label>
            <p className="text-sm text-muted-foreground">
              Enviar automaticamente as notas fiscais por e-mail para os clientes
            </p>
          </div>
          <Switch
            id="enviar_nfe_por_email"
            checked={formData.enviar_nfe_por_email}
            onCheckedChange={(checked) => onFormDataChange({ enviar_nfe_por_email: checked })}
          />
        </div>
      </CardContent>
    </Card>
  );
};
