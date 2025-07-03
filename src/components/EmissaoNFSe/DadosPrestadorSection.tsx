
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useEmpresas } from "@/hooks/useEmpresas";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface DadosPrestadorSectionProps {
  prestadorId: string;
  setPrestadorId: (id: string) => void;
}

export const DadosPrestadorSection = ({ prestadorId, setPrestadorId }: DadosPrestadorSectionProps) => {
  const { profile } = useAuth();
  const { data: empresas, isLoading, error } = useEmpresas();

  console.log('DadosPrestadorSection - Profile empresa_id:', profile?.empresa_id);
  console.log('DadosPrestadorSection - Empresas data:', empresas);

  // Auto-select if only one empresa
  React.useEffect(() => {
    if (empresas && empresas.length === 1 && !prestadorId) {
      console.log('Auto-selecting single empresa:', empresas[0].id);
      setPrestadorId(empresas[0].id);
    }
  }, [empresas, prestadorId, setPrestadorId]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dados do Prestador</CardTitle>
          <CardDescription className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Carregando empresas...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    console.error('DadosPrestadorSection - Query error:', error);
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dados do Prestador</CardTitle>
          <CardDescription className="text-red-600">
            Erro ao carregar empresas. Verifique sua conexão.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!empresas || empresas.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dados do Prestador</CardTitle>
          <CardDescription className="text-yellow-600">
            Nenhuma empresa encontrada. Cadastre uma empresa primeiro.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const selectedEmpresa = empresas.find(e => e.id === prestadorId);
  console.log('Selected empresa:', selectedEmpresa);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados do Prestador</CardTitle>
        <CardDescription>
          Selecione a empresa responsável pela emissão de NFSe
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="prestador">Empresa Prestadora *</Label>
            <Select value={prestadorId} onValueChange={setPrestadorId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a empresa" />
              </SelectTrigger>
              <SelectContent>
                {empresas.map((empresa) => (
                  <SelectItem key={empresa.id} value={empresa.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {empresa.razao_social}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        CNPJ: {empresa.cnpj}
                        {empresa.inscricao_municipal && ` - IM: ${empresa.inscricao_municipal}`}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedEmpresa && (
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <h4 className="font-medium text-sm">Dados Completos da Empresa:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">Razão Social:</span>
                  <p className="text-muted-foreground">{selectedEmpresa.razao_social}</p>
                </div>
                {selectedEmpresa.nome_fantasia && (
                  <div>
                    <span className="font-medium">Nome Fantasia:</span>
                    <p className="text-muted-foreground">{selectedEmpresa.nome_fantasia}</p>
                  </div>
                )}
                <div>
                  <span className="font-medium">CNPJ:</span>
                  <p className="text-muted-foreground font-mono">{selectedEmpresa.cnpj}</p>
                </div>
                {selectedEmpresa.inscricao_municipal && (
                  <div>
                    <span className="font-medium">Inscrição Municipal:</span>
                    <p className="text-muted-foreground">{selectedEmpresa.inscricao_municipal}</p>
                  </div>
                )}
                {selectedEmpresa.inscricao_estadual && (
                  <div>
                    <span className="font-medium">Inscrição Estadual:</span>
                    <p className="text-muted-foreground">{selectedEmpresa.inscricao_estadual}</p>
                  </div>
                )}
                <div>
                  <span className="font-medium">Regime Tributário:</span>
                  <p className="text-muted-foreground capitalize">{selectedEmpresa.regime_tributario?.replace('_', ' ')}</p>
                </div>
                <div className="col-span-full">
                  <span className="font-medium">Endereço Completo:</span>
                  <p className="text-muted-foreground">
                    {selectedEmpresa.endereco}, {selectedEmpresa.cidade} - {selectedEmpresa.estado}, CEP: {selectedEmpresa.cep}
                  </p>
                </div>
                {selectedEmpresa.email && (
                  <div>
                    <span className="font-medium">E-mail:</span>
                    <p className="text-muted-foreground">{selectedEmpresa.email}</p>
                  </div>
                )}
                {selectedEmpresa.telefone && (
                  <div>
                    <span className="font-medium">Telefone:</span>
                    <p className="text-muted-foreground">{selectedEmpresa.telefone}</p>
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
