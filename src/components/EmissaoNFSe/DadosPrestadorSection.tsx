
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { usePrestadoresServico } from "@/hooks/usePrestadoresServico";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface DadosPrestadorSectionProps {
  prestadorId: string;
  setPrestadorId: (id: string) => void;
}

export const DadosPrestadorSection = ({ prestadorId, setPrestadorId }: DadosPrestadorSectionProps) => {
  const { profile } = useAuth();
  const { data: prestadores, isLoading, error } = usePrestadoresServico(profile?.empresa_id);

  console.log('Profile empresa_id:', profile?.empresa_id);
  console.log('Prestadores data:', prestadores);

  // Auto-select if only one prestador
  React.useEffect(() => {
    if (prestadores && prestadores.length === 1 && !prestadorId) {
      console.log('Auto-selecting single prestador:', prestadores[0].id);
      setPrestadorId(prestadores[0].id);
    }
  }, [prestadores, prestadorId, setPrestadorId]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dados do Prestador</CardTitle>
          <CardDescription className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Carregando prestadores de serviço...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    console.error('Query error:', error);
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dados do Prestador</CardTitle>
          <CardDescription className="text-red-600">
            Erro ao carregar prestadores de serviço. Verifique sua conexão.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!prestadores || prestadores.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dados do Prestador</CardTitle>
          <CardDescription className="text-yellow-600">
            Nenhum prestador de serviços encontrado. Cadastre um prestador primeiro.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados do Prestador</CardTitle>
        <CardDescription>
          Selecione o prestador de serviços responsável pela emissão
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
                {prestadores.map((prestador) => (
                  <SelectItem key={prestador.id} value={prestador.id}>
                    {prestador.cnpj} {prestador.inscricao_municipal && `- IM: ${prestador.inscricao_municipal}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {prestadorId && (
            <div className="text-sm text-muted-foreground">
              {(() => {
                const selectedPrestador = prestadores.find(p => p.id === prestadorId);
                return selectedPrestador ? (
                  <div className="space-y-1">
                    <p><strong>CNPJ:</strong> {selectedPrestador.cnpj}</p>
                    {selectedPrestador.inscricao_municipal && (
                      <p><strong>Inscrição Municipal:</strong> {selectedPrestador.inscricao_municipal}</p>
                    )}
                    <p><strong>Regime Tributário:</strong> {selectedPrestador.regime_tributario.replace('_', ' ')}</p>
                  </div>
                ) : null;
              })()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
