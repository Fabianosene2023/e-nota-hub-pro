
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEmpresasManager } from '@/hooks/useEmpresasManager';
import { useClientesManager } from '@/hooks/useClientesManager';
import { Building, User } from "lucide-react";

interface FormData {
  empresa_id: string;
  cliente_id: string;
  numero: string;
  serie: number;
  natureza_operacao: string;
  observacoes: string;
  tipo_pessoa: 'fisica' | 'juridica';
}

interface DadosGeraisSectionProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
}

export const DadosGeraisSection = ({ formData, setFormData }: DadosGeraisSectionProps) => {
  const { data: empresas } = useEmpresasManager();
  const { data: clientes } = useClientesManager(formData.empresa_id);

  // Filtrar clientes por tipo de pessoa
  const clientesFiltrados = clientes?.filter(cliente => {
    if (formData.tipo_pessoa === 'fisica') {
      return cliente.tipo_pessoa === 'fisica';
    } else {
      return cliente.tipo_pessoa === 'juridica';
    }
  }) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados Gerais</CardTitle>
        <CardDescription>
          Informações básicas da nota fiscal
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="empresa">Empresa Emitente *</Label>
            <Select 
              value={formData.empresa_id} 
              onValueChange={(value) => setFormData({...formData, empresa_id: value, cliente_id: ''})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a empresa" />
              </SelectTrigger>
              <SelectContent>
                {empresas?.map((empresa) => (
                  <SelectItem key={empresa.id} value={empresa.id}>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      {empresa.nome_fantasia || empresa.razao_social}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="numero">Número *</Label>
              <Input
                id="numero"
                type="number"
                placeholder="1001"
                value={formData.numero}
                onChange={(e) => setFormData({...formData, numero: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serie">Série</Label>
              <Input
                id="serie"
                type="number"
                value={formData.serie}
                onChange={(e) => setFormData({...formData, serie: parseInt(e.target.value) || 1})}
              />
            </div>
          </div>
        </div>

        {/* Tipo de Pessoa e Cliente */}
        <div className="space-y-4">
          <div className="space-y-3">
            <Label>Tipo de Cliente *</Label>
            <RadioGroup
              value={formData.tipo_pessoa}
              onValueChange={(value: 'fisica' | 'juridica') => setFormData({...formData, tipo_pessoa: value, cliente_id: ''})}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fisica" id="fisica" />
                <Label htmlFor="fisica" className="flex items-center gap-2 cursor-pointer">
                  <User className="h-4 w-4" />
                  Pessoa Física
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="juridica" id="juridica" />
                <Label htmlFor="juridica" className="flex items-center gap-2 cursor-pointer">
                  <Building className="h-4 w-4" />
                  Pessoa Jurídica
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cliente">
              {formData.tipo_pessoa === 'fisica' ? 'Cliente (Pessoa Física) *' : 'Cliente (Pessoa Jurídica) *'}
            </Label>
            <Select 
              value={formData.cliente_id} 
              onValueChange={(value) => setFormData({...formData, cliente_id: value})}
              disabled={!formData.empresa_id}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  !formData.empresa_id 
                    ? "Selecione uma empresa primeiro" 
                    : `Selecione o cliente (${formData.tipo_pessoa === 'fisica' ? 'PF' : 'PJ'})`
                } />
              </SelectTrigger>
              <SelectContent>
                {clientesFiltrados?.map((cliente) => (
                  <SelectItem key={cliente.id} value={cliente.id}>
                    <div className="flex items-center gap-2">
                      {formData.tipo_pessoa === 'fisica' ? 
                        <User className="h-4 w-4" /> : 
                        <Building className="h-4 w-4" />
                      }
                      <div className="flex flex-col">
                        <span>{cliente.nome_razao_social}</span>
                        <span className="text-xs text-muted-foreground">
                          {cliente.cpf_cnpj}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.empresa_id && clientesFiltrados?.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nenhum cliente do tipo {formData.tipo_pessoa === 'fisica' ? 'pessoa física' : 'pessoa jurídica'} encontrado para esta empresa.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="natureza">Natureza da Operação</Label>
          <Input
            id="natureza"
            value={formData.natureza_operacao}
            onChange={(e) => setFormData({...formData, natureza_operacao: e.target.value})}
          />
        </div>
      </CardContent>
    </Card>
  );
};
