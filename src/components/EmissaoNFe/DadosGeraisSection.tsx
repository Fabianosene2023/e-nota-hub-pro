import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEmpresas } from '@/hooks/useEmpresas';
import { useClientesManager } from '@/hooks/useClientesManager';
import { Building2, User, Calendar, MapPin } from "lucide-react";

interface DadosGeraisProps {
  formData: {
    empresa_id: string;
    cliente_id: string;
    numero: string;
    serie: number;
    natureza_operacao: string;
    observacoes: string;
    tipo_pessoa: 'fisica' | 'juridica';
    // Novos campos
    email_cliente: string;
    telefone_cliente: string;
    cnpj_cpf_entrega: string;
    inscricao_estadual_cliente: string;
    endereco_faturamento: string;
    endereco_entrega: string;
    tipo_nota: 'entrada' | 'saida';
    data_emissao: string;
    data_entrega: string;
    data_cancelamento: string;
  };
  setFormData: (data: any) => void;
}

export const DadosGeraisSection = ({ formData, setFormData }: DadosGeraisProps) => {
  const { data: empresas, isLoading: loadingEmpresas } = useEmpresas();
  const { data: clientes, isLoading: loadingClientes } = useClientesManager(formData.empresa_id);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const clienteSelecionado = clientes?.find(c => c.id === formData.cliente_id);

  // Auto-preencher dados do cliente quando selecionado
  React.useEffect(() => {
    if (clienteSelecionado) {
      setFormData((prev: any) => ({
        ...prev,
        email_cliente: clienteSelecionado.email || '',
        telefone_cliente: clienteSelecionado.telefone || '',
        cnpj_cpf_entrega: clienteSelecionado.cpf_cnpj || '',
        inscricao_estadual_cliente: clienteSelecionado.inscricao_estadual || '',
        endereco_faturamento: `${clienteSelecionado.endereco}, ${clienteSelecionado.cidade} - ${clienteSelecionado.estado}, ${clienteSelecionado.cep}`,
        endereco_entrega: `${clienteSelecionado.endereco}, ${clienteSelecionado.cidade} - ${clienteSelecionado.estado}, ${clienteSelecionado.cep}`
      }));
    }
  }, [clienteSelecionado, setFormData]);

  return (
    <div className="space-y-6">
      {/* Dados Básicos */}
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
                onValueChange={(value) => handleInputChange('empresa_id', value)}
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
                onValueChange={(value) => handleInputChange('tipo_nota', value)}
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
                onChange={(e) => handleInputChange('numero', e.target.value)}
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
                onChange={(e) => handleInputChange('serie', parseInt(e.target.value) || 1)}
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
                onChange={(e) => handleInputChange('data_emissao', e.target.value)}
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
                onChange={(e) => handleInputChange('data_entrega', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="data_cancelamento">Data de Cancelamento</Label>
              <Input
                id="data_cancelamento"
                type="date"
                value={formData.data_cancelamento}
                onChange={(e) => handleInputChange('data_cancelamento', e.target.value)}
                disabled
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="natureza_operacao">Natureza da Operação *</Label>
            <Input
              id="natureza_operacao"
              value={formData.natureza_operacao}
              onChange={(e) => handleInputChange('natureza_operacao', e.target.value)}
              placeholder="Ex: Venda de mercadoria adquirida ou produzida pelo estabelecimento"
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Dados do Cliente */}
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
              value={formData.cliente_id} 
              onValueChange={(value) => handleInputChange('cliente_id', value)}
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
                onChange={(e) => handleInputChange('email_cliente', e.target.value)}
                placeholder="email@cliente.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone_cliente">Telefone do Cliente</Label>
              <Input
                id="telefone_cliente"
                value={formData.telefone_cliente}
                onChange={(e) => handleInputChange('telefone_cliente', e.target.value)}
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
                onChange={(e) => handleInputChange('cnpj_cpf_entrega', e.target.value)}
                placeholder="00.000.000/0000-00 ou 000.000.000-00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inscricao_estadual_cliente">Inscrição Estadual</Label>
              <Input
                id="inscricao_estadual_cliente"
                value={formData.inscricao_estadual_cliente}
                onChange={(e) => handleInputChange('inscricao_estadual_cliente', e.target.value)}
                placeholder="000.000.000.000"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Endereços */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Endereços
          </CardTitle>
          <CardDescription>
            Endereços de faturamento e entrega
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="endereco_faturamento">Endereço para Faturamento *</Label>
            <Textarea
              id="endereco_faturamento"
              value={formData.endereco_faturamento}
              onChange={(e) => handleInputChange('endereco_faturamento', e.target.value)}
              placeholder="Rua, número, bairro, cidade - UF, CEP"
              rows={2}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endereco_entrega">Endereço para Entrega *</Label>
            <Textarea
              id="endereco_entrega"
              value={formData.endereco_entrega}
              onChange={(e) => handleInputChange('endereco_entrega', e.target.value)}
              placeholder="Rua, número, bairro, cidade - UF, CEP"
              rows={2}
              required
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
