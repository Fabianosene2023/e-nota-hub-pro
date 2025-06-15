
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Empresa {
  id: string;
  nome_fantasia: string | null;
  razao_social: string;
}

interface EmpresaSelectorProps {
  empresas: Empresa[] | undefined;
  empresaSelecionada: string;
  onEmpresaChange: (empresaId: string) => void;
}

export const EmpresaSelector: React.FC<EmpresaSelectorProps> = ({
  empresas,
  empresaSelecionada,
  onEmpresaChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Selecionar Empresa</CardTitle>
        <CardDescription>
          Escolha a empresa para configurar os parâmetros fiscais
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Select value={empresaSelecionada} onValueChange={onEmpresaChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione uma empresa" />
          </SelectTrigger>
          <SelectContent>
            {empresas?.map((empresa) => (
              <SelectItem key={empresa.id} value={empresa.id}>
                {empresa.nome_fantasia || empresa.razao_social}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};
