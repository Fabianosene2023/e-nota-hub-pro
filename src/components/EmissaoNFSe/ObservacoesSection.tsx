
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ObservacoesSectionProps {
  discriminacao: string;
  setDiscriminacao: (discriminacao: string) => void;
}

export const ObservacoesSection = ({ discriminacao, setDiscriminacao }: ObservacoesSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Observações</CardTitle>
        <CardDescription>
          Informações complementares sobre os serviços
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <Label htmlFor="observacoes">Observações Gerais</Label>
          <Textarea
            id="observacoes"
            value={discriminacao}
            onChange={(e) => setDiscriminacao(e.target.value)}
            placeholder="Informações adicionais sobre os serviços prestados"
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );
};
