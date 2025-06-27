
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEmpresasManager } from '@/hooks/useEmpresasManager';
import { useClientesManager } from '@/hooks/useClientesManager';

interface FormData {
  empresa_id: string;
  cliente_id: string;
  numero: string;
  serie: number;
  natureza_operacao: string;
  observacoes: string;
  tipo_pessoa: 'fisica' | 'juridica';
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
}

interface DadosGeraisSectionProps {
  formData: FormData;
  setFormData: (formData: FormData) => void;
}

export const DadosGeraisSection = ({ formData, setFormData }: DadosGeraisSectionProps) => {
  const { data: empresas } = useEmpresasManager();
  const { data: clientes } = useClientesManager(formData.empresa_id);

  const handleFieldChange = (field: keyof FormData, value: string | number) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados Gerais da NFSe</CardTitle>
        <CardDescription>
          Informações básicas da nota fiscal de serviços
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Empresa *</Label>
            <Select 
              value={formData.empresa_id} 
              onValueChange={(value) => handleFieldChange('empresa_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a empresa" />
              </SelectTrigger>
              <SelectContent>
                {empresas?.map((empresa) => (
                  <SelectItem key={empresa.id} value={empresa.id}>
                    {empresa.razao_social}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Cliente *</Label>
            <Select 
              value={formData.cliente_id} 
              onValueChange={(value) => handleFieldChange('cliente_id', value)}
              disabled={!formData.empresa_id}
            >
              <SelectTrigger>
                <SelectValue placeholder={!formData.empresa_id ? "Selecione empresa primeiro" : "Selecione o cliente"} />
              </SelectTrigger>
              <SelectContent>
                {clientes?.map((cliente) => (
                  <SelectItem key={cliente.id} value={cliente.id}>
                    {cliente.nome_razao_social}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Número</Label>
            <Input
              value={formData.numero}
              onChange={(e) => handleFieldChange('numero', e.target.value)}
              placeholder="Deixe vazio para gerar automaticamente"
            />
          </div>

          <div className="space-y-2">
            <Label>Série</Label>
            <Input
              type="number"
              value={formData.serie}
              onChange={(e) => handleFieldChange('serie', parseInt(e.target.value) || 1)}
            />
          </div>

          <div className="space-y-2">
            <Label>Data de Emissão</Label>
            <Input
              type="date"
              value={formData.data_emissao}
              onChange={(e) => handleFieldChange('data_emissao', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Natureza da Operação</Label>
          <Input
            value={formData.natureza_operacao}
            onChange={(e) => handleFieldChange('natureza_operacao', e.target.value)}
            placeholder="Ex: Prestação de serviços"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>E-mail do Cliente</Label>
            <Input
              type="email"
              value={formData.email_cliente}
              onChange={(e) => handleFieldChange('email_cliente', e.target.value)}
              placeholder="email@cliente.com"
            />
          </div>

          <div className="space-y-2">
            <Label>Telefone do Cliente</Label>
            <Input
              value={formData.telefone_cliente}
              onChange={(e) => handleFieldChange('telefone_cliente', e.target.value)}
              placeholder="(11) 99999-9999"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Endereço de Faturamento</Label>
          <Input
            value={formData.endereco_faturamento}
            onChange={(e) => handleFieldChange('endereco_faturamento', e.target.value)}
            placeholder="Rua, número, bairro, cidade - UF"
          />
        </div>
      </CardContent>
    </Card>
  );
};
