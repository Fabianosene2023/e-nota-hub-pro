
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle } from "lucide-react";

interface ModoSefazSelectorProps {
  modoProducao: boolean;
  onModoChange: (producao: boolean) => void;
}

export const ModoSefazSelector = ({ modoProducao, onModoChange }: ModoSefazSelectorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Modo de Integração SEFAZ
        </CardTitle>
        <CardDescription>
          Escolha entre simulação (desenvolvimento) ou integração real com SEFAZ
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="modo-producao"
            checked={modoProducao}
            onCheckedChange={onModoChange}
          />
          <Label htmlFor="modo-producao">
            {modoProducao ? 'Integração Real com SEFAZ' : 'Modo Simulação (Desenvolvimento)'}
          </Label>
        </div>

        {modoProducao ? (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Modo Produção Ativo!</strong><br/>
              As NFe serão enviadas para a SEFAZ real. Certifique-se de ter:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Certificado digital válido configurado</li>
                <li>Configurações SEFAZ corretas</li>
                <li>Ambiente (homologação/produção) configurado</li>
              </ul>
            </AlertDescription>
          </Alert>
        ) : (
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Modo Simulação Ativo</strong><br/>
              As operações de NFe são simuladas para desenvolvimento e testes.
              Nenhuma comunicação real com SEFAZ é realizada.
            </AlertDescription>
          </Alert>
        )}

        <div className="text-sm text-muted-foreground">
          <h4 className="font-semibold mb-2">APIs Utilizadas:</h4>
          {modoProducao ? (
            <ul className="space-y-1">
              <li>• <strong>node-nfe</strong>: Biblioteca para integração real</li>
              <li>• <strong>node-forge</strong>: Manipulação de certificados digitais</li>
              <li>• <strong>Endpoints SEFAZ</strong>: Comunicação direta com receita</li>
            </ul>
          ) : (
            <ul className="space-y-1">
              <li>• <strong>Edge Function</strong>: sefaz-integration (simulada)</li>
              <li>• <strong>Simulação</strong>: Respostas mockadas da SEFAZ</li>
              <li>• <strong>Desenvolvimento</strong>: Ambiente seguro para testes</li>
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
