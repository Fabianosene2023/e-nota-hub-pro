
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ObservacoesSectionProps {
  observacoes: string;
  setObservacoes: (observacoes: string) => void;
}

export const ObservacoesSection = ({ observacoes, setObservacoes }: ObservacoesSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Observações</CardTitle>
        <CardDescription>
          Informações adicionais para a nota fiscal de serviços
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label>Observações Gerais</Label>
          <Textarea
            placeholder="Digite observações adicionais para a NFSe..."
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );
};
