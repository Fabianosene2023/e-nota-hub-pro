
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEmpresas } from '@/hooks/useEmpresas';
import { useClientes } from '@/hooks/useClientes';

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
  setFormData: (data: FormData) => void;
}

const naturezasOperacao = [
  'Prestação de serviços',
  'Prestação de serviços de informática',
  'Consultoria e assessoria',
  'Serviços de engenharia',
  'Serviços de manutenção'
];

export const DadosGeraisSection = ({ formData, setFormData }: DadosGeraisSectionProps) => {
  const { data: empresas } = useEmpresas();
  const { data: clientes } = useClientes(formData.empresa_id);

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
              onValueChange={(value) => setFormData({...formData, empresa_id: value, cliente_id: ''})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a empresa" />
              </SelectTrigger>
              <SelectContent>
                {empresas?.map((empresa) => (
                  <SelectItem key={empresa.id} value={empresa.id}>
                    {empresa.nome_fantasia || empresa.razao_social}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Cliente *</Label>
            <Select 
              value={formData.cliente_id} 
              onValueChange={(value) => setFormData({...formData, cliente_id: value})}
              disabled={!formData.empresa_id}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o cliente" />
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
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Número da NFSe</Label>
            <Input
              type="number"
              placeholder="Automático"
              value={formData.numero}
              onChange={(e) => setFormData({...formData, numero: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label>Série</Label>
            <Input
              type="number"
              value={formData.serie}
              onChange={(e) => setFormData({...formData, serie: parseInt(e.target.value) || 1})}
            />
          </div>

          <div className="space-y-2">
            <Label>Data de Emissão</Label>
            <Input
              type="date"
              value={formData.data_emissao}
              onChange={(e) => setFormData({...formData, data_emissao: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Natureza da Operação</Label>
          <Select 
            value={formData.natureza_operacao} 
            onValueChange={(value) => setFormData({...formData, natureza_operacao: value})}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {naturezasOperacao.map((natureza) => (
                <SelectItem key={natureza} value={natureza}>
                  {natureza}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
