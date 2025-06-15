
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Loader2 } from "lucide-react";

interface FiltrosMdfeProps {
  onBuscar: (filtros: any) => void;
  isLoading: boolean;
}

export const FiltrosMdfe: React.FC<FiltrosMdfeProps> = ({ onBuscar, isLoading }) => {
  const [filtros, setFiltros] = useState({
    dataInicio: "",
    dataFim: "",
    chaveAcesso: "",
    status: "",
    remetenteCnpj: "",
    remetenteNome: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBuscar(filtros);
  };

  const handleInputChange = (field: string, value: string) => {
    setFiltros(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros de Busca</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="data-inicio">Data Início</Label>
              <Input
                id="data-inicio"
                type="date"
                value={filtros.dataInicio}
                onChange={(e) => handleInputChange("dataInicio", e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="data-fim">Data Fim</Label>
              <Input
                id="data-fim"
                type="date"
                value={filtros.dataFim}
                onChange={(e) => handleInputChange("dataFim", e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={filtros.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="recebido">Recebido</SelectItem>
                  <SelectItem value="processado">Processado</SelectItem>
                  <SelectItem value="erro">Erro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="chave-acesso">Chave de Acesso</Label>
              <Input
                id="chave-acesso"
                placeholder="Chave de acesso do MDFe"
                value={filtros.chaveAcesso}
                onChange={(e) => handleInputChange("chaveAcesso", e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="remetente-cnpj">CNPJ Remetente</Label>
              <Input
                id="remetente-cnpj"
                placeholder="CNPJ do remetente"
                value={filtros.remetenteCnpj}
                onChange={(e) => handleInputChange("remetenteCnpj", e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="remetente-nome">Nome Remetente</Label>
              <Input
                id="remetente-nome"
                placeholder="Nome do remetente"
                value={filtros.remetenteNome}
                onChange={(e) => handleInputChange("remetenteNome", e.target.value)}
              />
            </div>
          </div>
          
          <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Buscando...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Buscar MDFe
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
