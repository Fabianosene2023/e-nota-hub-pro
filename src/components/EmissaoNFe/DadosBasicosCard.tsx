
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2 } from "lucide-react";

interface DadosBasicosCardProps {
  formData: any;
  empresas: any[];
  loadingEmpresas: boolean;
  onInputChange: (field: string, value: string | number) => void;
}

export const DadosBasicosCard = ({ formData, empresas, loadingEmpresas, onInputChange }: DadosBasicosCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Dados Básicos da Nota
        </CardTitle>
        <CardDescription>
          Informações fundamentais da nota fiscal
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="empresa">Empresa Emitente *</Label>
            <Select 
              value={formData.empresa_id} 
              onValueChange={(value) => onInputChange('empresa_id', value)}
              disabled={loadingEmpresas}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma empresa" />
              </SelectTrigger>
              <SelectContent>
                {empresas?.map((empresa) => (
                  <SelectItem key={empresa.id} value={empresa.id}>
                    {empresa.nome_fantasia || empresa.razao_social} - {empresa.cnpj}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo_nota">Tipo de Nota *</Label>
            <Select 
              value={formData.tipo_nota} 
              onValueChange={(value) => onInputChange('tipo_nota', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="saida">Saída</SelectItem>
                <SelectItem value="entrada">Entrada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="numero">Número da Nota *</Label>
            <Input
              id="numero"
              value={formData.numero}
              onChange={(e) => onInputChange('numero', e.target.value)}
              placeholder="Ex: 1001"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="serie">Série</Label>
            <Input
              id="serie"
              type="number"
              value={formData.serie}
              onChange={(e) => onInputChange('serie', parseInt(e.target.value) || 1)}
              placeholder="1"
              min="1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="data_emissao">Data de Emissão *</Label>
            <Input
              id="data_emissao"
              type="date"
              value={formData.data_emissao}
              onChange={(e) => onInputChange('data_emissao', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="data_entrega">Data de Entrega</Label>
            <Input
              id="data_entrega"
              type="date"
              value={formData.data_entrega}
              onChange={(e) => onInputChange('data_entrega', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="data_cancelamento">Data de Cancelamento</Label>
            <Input
              id="data_cancelamento"
              type="date"
              value={formData.data_cancelamento}
              onChange={(e) => onInputChange('data_cancelamento', e.target.value)}
              disabled
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="natureza_operacao">Natureza da Operação *</Label>
          <Input
            id="natureza_operacao"
            value={formData.natureza_operacao}
            onChange={(e) => onInputChange('natureza_operacao', e.target.value)}
            placeholder="Ex: Venda de mercadoria adquirida ou produzida pelo estabelecimento"
            required
          />
        </div>
      </CardContent>
    </Card>
  );
};
