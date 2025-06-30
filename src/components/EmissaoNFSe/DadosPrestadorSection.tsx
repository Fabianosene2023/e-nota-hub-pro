
import React from 'react';
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
  
  const { data: prestadores, isLoading } = useQuery({
    queryKey: ['prestadores-servico', profile?.empresa_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prestadores_servico')
        .select(`
          id, 
          cnpj, 
          inscricao_municipal,
          regime_tributario,
          empresas!inner(razao_social, nome_fantasia)
        `)
        .eq('empresa_id', profile?.empresa_id || '')
        .eq('ativo', true);
      
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.empresa_id,
  });

  // Auto-select if only one prestador
  React.useEffect(() => {
    if (prestadores && prestadores.length === 1 && !prestadorId) {
      setPrestadorId(prestadores[0].id);
    }
  }, [prestadores, prestadorId, setPrestadorId]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dados do Prestador</CardTitle>
          <CardDescription>Carregando prestadores de serviço...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados do Prestador</CardTitle>
        <CardDescription>
          Selecione o prestador de serviços
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
                {prestadores?.map((prestador) => (
                  <SelectItem key={prestador.id} value={prestador.id}>
                    {prestador.empresas.razao_social} - {prestador.cnpj}
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
