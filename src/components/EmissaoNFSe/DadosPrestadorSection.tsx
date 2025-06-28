
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePrestadoresServico } from '@/hooks/usePrestadoresServico';
import { useEmpresasManager } from '@/hooks/useEmpresasManager';

interface DadosPrestadorSectionProps {
  prestadorId: string;
  setPrestadorId: (id: string) => void;
}

export const DadosPrestadorSection = ({ prestadorId, setPrestadorId }: DadosPrestadorSectionProps) => {
  const { data: empresas } = useEmpresasManager();
  const empresaId = empresas?.[0]?.id || '';
  const { data: prestadores } = usePrestadoresServico(empresaId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados do Prestador</CardTitle>
        <CardDescription>
          Selecione o prestador de serviço para emissão da NFSe
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="prestador">Prestador de Serviço *</Label>
          <Select value={prestadorId} onValueChange={setPrestadorId}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o prestador" />
            </SelectTrigger>
            <SelectContent>
              {prestadores?.map((prestador) => (
                <SelectItem key={prestador.id} value={prestador.id}>
                  {prestador.cnpj} - {prestador.inscricao_municipal || 'Sem IM'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
