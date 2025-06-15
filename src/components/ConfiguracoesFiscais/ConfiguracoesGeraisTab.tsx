
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfiguracoesFiscaisFormData } from './types';

interface ConfiguracoesGeraisTabProps {
  formData: ConfiguracoesFiscaisFormData;
  onFormDataChange: (data: Partial<ConfiguracoesFiscaisFormData>) => void;
}

export const ConfiguracoesGeraisTab: React.FC<ConfiguracoesGeraisTabProps> = ({
  formData,
  onFormDataChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações Gerais</CardTitle>
        <CardDescription>
          Configure CSC, email padrão e layout do DANFE
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="csc_id">CSC ID (NFCe)</Label>
            <Input
              id="csc_id"
              placeholder="Ex: 000001"
              value={formData.csc_id}
              onChange={(e) => onFormDataChange({ csc_id: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="csc_token">CSC Token (NFCe)</Label>
            <Input
              id="csc_token"
              placeholder="Token fornecido pela SEFAZ"
              value={formData.csc_token}
              onChange={(e) => onFormDataChange({ csc_token: e.target.value })}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email Padrão para Envio</Label>
          <Input
            id="email"
            type="email"
            placeholder="fiscal@empresa.com"
            value={formData.email_padrao_envio}
            onChange={(e) => onFormDataChange({ email_padrao_envio: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="layout">Layout do DANFE</Label>
          <Select 
            value={formData.layout_danfe} 
            onValueChange={(value) => onFormDataChange({ layout_danfe: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="retrato">Retrato</SelectItem>
              <SelectItem value="paisagem">Paisagem</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
