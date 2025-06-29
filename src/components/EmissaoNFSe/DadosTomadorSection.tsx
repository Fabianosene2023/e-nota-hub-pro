
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormData {
  tomador_nome: string;
  tomador_cnpj_cpf: string;
  tomador_endereco: string;
  tomador_email: string;
}

interface DadosTomadorSectionProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
}

export const DadosTomadorSection = ({ formData, setFormData }: DadosTomadorSectionProps) => {
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados do Tomador</CardTitle>
        <CardDescription>
          Informações do cliente que contratou o serviço
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="tomador_nome">Nome/Razão Social *</Label>
            <Input
              id="tomador_nome"
              value={formData.tomador_nome}
              onChange={(e) => handleInputChange('tomador_nome', e.target.value)}
              placeholder="Nome completo ou razão social"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="tomador_cnpj_cpf">CPF/CNPJ</Label>
            <Input
              id="tomador_cnpj_cpf"
              value={formData.tomador_cnpj_cpf}
              onChange={(e) => handleInputChange('tomador_cnpj_cpf', e.target.value)}
              placeholder="000.000.000-00 ou 00.000.000/0000-00"
            />
          </div>
          
          <div>
            <Label htmlFor="tomador_endereco">Endereço</Label>
            <Input
              id="tomador_endereco"
              value={formData.tomador_endereco}
              onChange={(e) => handleInputChange('tomador_endereco', e.target.value)}
              placeholder="Endereço completo"
            />
          </div>
          
          <div>
            <Label htmlFor="tomador_email">E-mail</Label>
            <Input
              id="tomador_email"
              type="email"
              value={formData.tomador_email}
              onChange={(e) => handleInputChange('tomador_email', e.target.value)}
              placeholder="email@exemplo.com"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
