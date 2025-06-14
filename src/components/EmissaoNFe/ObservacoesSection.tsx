
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface ObservacoesSectionProps {
  observacoes: string;
  setObservacoes: (observacoes: string) => void;
}

export const ObservacoesSection = ({ observacoes, setObservacoes }: ObservacoesSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Observações</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Observações adicionais para a nota fiscal..."
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
        />
      </CardContent>
    </Card>
  );
};
