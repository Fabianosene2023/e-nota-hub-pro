
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface DadosPrestadorSectionProps {
  prestadorId: string;
  setPrestadorId: (id: string) => void;
}

export const DadosPrestadorSection = ({ prestadorId, setPrestadorId }: DadosPrestadorSectionProps) => {
  const { profile } = useAuth();
  
  const { data: empresas, isLoading } = useQuery({
    queryKey: ['empresas-prestadoras', profile?.empresa_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('empresas')
        .select('id, razao_social, cnpj, inscricao_municipal')
        .eq('id', profile?.empresa_id || '');
      
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.empresa_id,
  });

  // Auto-select if only one company
  React.useEffect(() => {
    if (empresas && empresas.length === 1 && !prestadorId) {
      setPrestadorId(empresas[0].id);
    }
  }, [empresas, prestadorId, setPrestadorId]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dados do Prestador</CardTitle>
          <CardDescription>Carregando dados da empresa...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados do Prestador</CardTitle>
        <CardDescription>
          Selecione a empresa prestadora de serviços
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="prestador">Prestador de Serviços *</Label>
            <Select value={prestadorId} onValueChange={setPrestadorId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o prestador" />
              </SelectTrigger>
              <SelectContent>
                {empresas?.map((empresa) => (
                  <SelectItem key={empresa.id} value={empresa.id}>
                    {empresa.razao_social} - {empresa.cnpj}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
