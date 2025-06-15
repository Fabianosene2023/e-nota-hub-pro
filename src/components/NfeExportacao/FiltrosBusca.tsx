
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Search, Loader2 } from "lucide-react";

interface FiltrosBuscaProps {
  dataInicio: Date | undefined;
  setDataInicio: (date: Date | undefined) => void;
  dataFim: Date | undefined;
  setDataFim: (date: Date | undefined) => void;
  numeroNFe: string;
  setNumeroNFe: (value: string) => void;
  chaveAcesso: string;
  setChaveAcesso: (value: string) => void;
  statusFiltro: string;
  setStatusFiltro: (value: string) => void;
  isLoading: boolean;
  onBuscar: () => void;
}

export const FiltrosBusca: React.FC<FiltrosBuscaProps> = ({
  dataInicio,
  setDataInicio,
  dataFim,
  setDataFim,
  numeroNFe,
  setNumeroNFe,
  chaveAcesso,
  setChaveAcesso,
  statusFiltro,
  setStatusFiltro,
  isLoading,
  onBuscar
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros de Busca</CardTitle>
        <CardDescription>
          Defina os critérios para buscar as notas fiscais que deseja exportar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="data-inicio">Data Início</Label>
            <DatePicker
              date={dataInicio}
              onDateChange={setDataInicio}
              placeholder="Selecione a data de início"
            />
          </div>
          
          <div>
            <Label htmlFor="data-fim">Data Fim</Label>
            <DatePicker
              date={dataFim}
              onDateChange={setDataFim}
              placeholder="Selecione a data de fim"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="numero-nfe">Número da NFe</Label>
            <Input
              id="numero-nfe"
              placeholder="Ex: 123"
              value={numeroNFe}
              onChange={(e) => setNumeroNFe(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="status-filtro">Status</Label>
            <Select value={statusFiltro} onValueChange={setStatusFiltro}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="autorizada">Autorizada</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
                <SelectItem value="erro">Erro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="chave-acesso">Chave de Acesso</Label>
          <Input
            id="chave-acesso"
            placeholder="Ex: 35240123456789000123550010000000123456789012"
            value={chaveAcesso}
            onChange={(e) => setChaveAcesso(e.target.value.replace(/\D/g, ''))}
            maxLength={44}
            className="font-mono"
          />
        </div>

        <Button 
          onClick={onBuscar}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Buscando...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Buscar Notas
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
