
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

  const selectedPrestador = prestadores.find(p => p.id === prestadorId);

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
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {prestador.empresas?.razao_social || 'Empresa não encontrada'}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        CNPJ: {prestador.cnpj}
                        {prestador.inscricao_municipal && ` - IM: ${prestador.inscricao_municipal}`}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedPrestador && selectedPrestador.empresas && (
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <h4 className="font-medium text-sm">Dados da Empresa:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">Razão Social:</span>
                  <p className="text-muted-foreground">{selectedPrestador.empresas.razao_social}</p>
                </div>
                {selectedPrestador.empresas.nome_fantasia && (
                  <div>
                    <span className="font-medium">Nome Fantasia:</span>
                    <p className="text-muted-foreground">{selectedPrestador.empresas.nome_fantasia}</p>
                  </div>
                )}
                <div>
                  <span className="font-medium">CNPJ:</span>
                  <p className="text-muted-foreground font-mono">{selectedPrestador.cnpj}</p>
                </div>
                {selectedPrestador.inscricao_municipal && (
                  <div>
                    <span className="font-medium">Inscrição Municipal:</span>
                    <p className="text-muted-foreground">{selectedPrestador.inscricao_municipal}</p>
                  </div>
                )}
                {selectedPrestador.empresas.inscricao_estadual && (
                  <div>
                    <span className="font-medium">Inscrição Estadual:</span>
                    <p className="text-muted-foreground">{selectedPrestador.empresas.inscricao_estadual}</p>
                  </div>
                )}
                <div>
                  <span className="font-medium">Regime Tributário:</span>
                  <p className="text-muted-foreground capitalize">{selectedPrestador.regime_tributario.replace('_', ' ')}</p>
                </div>
                <div className="col-span-full">
                  <span className="font-medium">Endereço:</span>
                  <p className="text-muted-foreground">
                    {selectedPrestador.empresas.endereco}, {selectedPrestador.empresas.cidade} - {selectedPrestador.empresas.estado}, CEP: {selectedPrestador.empresas.cep}
                  </p>
                </div>
                {selectedPrestador.empresas.email && (
                  <div>
                    <span className="font-medium">E-mail:</span>
                    <p className="text-muted-foreground">{selectedPrestador.empresas.email}</p>
                  </div>
                )}
                {selectedPrestador.empresas.telefone && (
                  <div>
                    <span className="font-medium">Telefone:</span>
                    <p className="text-muted-foreground">{selectedPrestador.empresas.telefone}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
