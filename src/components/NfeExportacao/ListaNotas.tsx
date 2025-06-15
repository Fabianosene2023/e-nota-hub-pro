
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface NFEParaExportar {
  id: string;
  numero: string;
  serie: string;
  chave_acesso: string;
  data_emissao: string;
  valor_total: number;
  cliente_nome: string;
  status: string;
  selecionada: boolean;
}

interface ListaNotasProps {
  notas: NFEParaExportar[];
  todasSelecionadas: boolean;
  onToggleSelecaoTodas: () => void;
  onToggleSelecaoNota: (id: string) => void;
}

export const ListaNotas: React.FC<ListaNotasProps> = ({
  notas,
  todasSelecionadas,
  onToggleSelecaoTodas,
  onToggleSelecaoNota
}) => {
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'autorizada':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'cancelada':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'erro':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  if (notas.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Notas Encontradas</CardTitle>
            <CardDescription>
              {notas.length} nota(s) encontrada(s)
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="selecionar-todas"
              checked={todasSelecionadas}
              onCheckedChange={onToggleSelecaoTodas}
            />
            <Label htmlFor="selecionar-todas">Selecionar todas</Label>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notas.map((nota) => (
            <div key={nota.id} className="flex items-center space-x-3 p-3 border rounded-lg">
              <Checkbox
                checked={nota.selecionada}
                onCheckedChange={() => onToggleSelecaoNota(nota.id)}
              />
              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-2 text-sm">
                <div>
                  <strong>NFe {nota.numero}</strong> - Série {nota.serie}
                </div>
                <div>
                  {nota.cliente_nome}
                </div>
                <div>
                  R$ {nota.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div>
                  <span className={`px-2 py-1 rounded text-xs border ${getStatusBadgeColor(nota.status)}`}>
                    {nota.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
