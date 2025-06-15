
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, FileText, FileSpreadsheet, Loader2, CheckCircle } from "lucide-react";

interface OpcoesExportacaoProps {
  formatoExportacao: string;
  setFormatoExportacao: (valor: string) => void;
  totalNotas: number;
  notasSelecionadas: number;
  isLoading: boolean;
  onExportar: () => void;
}

export const OpcoesExportacao: React.FC<OpcoesExportacaoProps> = ({
  formatoExportacao,
  setFormatoExportacao,
  totalNotas,
  notasSelecionadas,
  isLoading,
  onExportar
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Opções de Exportação</CardTitle>
        <CardDescription>
          Escolha o formato desejado para exportar as notas selecionadas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="formato-exportacao">Formato de Exportação</Label>
          <Select value={formatoExportacao} onValueChange={setFormatoExportacao}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o formato" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="xml">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  XML - Arquivos originais da SEFAZ
                </div>
              </SelectItem>
              <SelectItem value="pdf">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  PDF - DANFE das notas
                </div>
              </SelectItem>
              <SelectItem value="xlsx">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  Excel - Planilha com dados das notas
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {totalNotas > 0 && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              {notasSelecionadas} de {totalNotas} nota(s) selecionada(s) para exportação
            </AlertDescription>
          </Alert>
        )}

        <Button 
          onClick={onExportar}
          disabled={isLoading || totalNotas === 0}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Exportando...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Exportar Notas Selecionadas
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
