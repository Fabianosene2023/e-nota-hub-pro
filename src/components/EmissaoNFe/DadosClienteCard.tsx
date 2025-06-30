
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";

interface DadosClienteCardProps {
  formData: any;
  clientes: any[];
  loadingClientes: boolean;
  onInputChange: (field: string, value: string | number) => void;
}

export const DadosClienteCard = ({ formData, clientes, loadingClientes, onInputChange }: DadosClienteCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Dados do Cliente/Destinatário
        </CardTitle>
        <CardDescription>
          Informações do cliente e contato
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cliente">Cliente/Destinatário *</Label>
          <Select 
            value={formData.cliente_id || ""} 
            onValueChange={(value) => onInputChange('cliente_id', value)}
            disabled={!formData.empresa_id || loadingClientes}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um cliente" />
            </SelectTrigger>
            <SelectContent>
              {clientes?.map((cliente) => (
                <SelectItem key={cliente.id} value={cliente.id}>
                  {cliente.nome_razao_social} - {cliente.cpf_cnpj}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email_cliente">Email do Cliente</Label>
            <Input
              id="email_cliente"
              type="email"
              value={formData.email_cliente}
              onChange={(e) => onInputChange('email_cliente', e.target.value)}
              placeholder="email@cliente.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone_cliente">Telefone do Cliente</Label>
            <Input
              id="telefone_cliente"
              value={formData.telefone_cliente}
              onChange={(e) => onInputChange('telefone_cliente', e.target.value)}
              placeholder="(11) 99999-9999"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cnpj_cpf_entrega">CNPJ/CPF para Entrega</Label>
            <Input
              id="cnpj_cpf_entrega"
              value={formData.cnpj_cpf_entrega}
              onChange={(e) => onInputChange('cnpj_cpf_entrega', e.target.value)}
              placeholder="00.000.000/0000-00 ou 000.000.000-00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="inscricao_estadual_cliente">Inscrição Estadual</Label>
            <Input
              id="inscricao_estadual_cliente"
              value={formData.inscricao_estadual_cliente}
              onChange={(e) => onInputChange('inscricao_estadual_cliente', e.target.value)}
              placeholder="000.000.000.000"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
