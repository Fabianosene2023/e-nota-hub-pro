
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
        <CardTitle>Discriminação dos Serviços</CardTitle>
        <CardDescription>
          Descrição detalhada dos serviços prestados (obrigatório para NFSe)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <Label htmlFor="discriminacao">Discriminação *</Label>
          <Textarea
            id="discriminacao"
            value={discriminacao}
            onChange={(e) => setDiscriminacao(e.target.value)}
            placeholder="Descreva detalhadamente os serviços prestados..."
            rows={4}
            required
          />
        </div>
      </CardContent>
    </Card>
  );
};
