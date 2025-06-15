
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEmitirNfseUberaba } from "@/hooks/useNfseUberaba";
import { FileText, MapPin } from "lucide-react";

export default function NfseEmissaoPage() {
  const [form, setForm] = useState({
    tomador_nome: "",
    tomador_cpf_cnpj: "",
    tomador_email: "",
    tomador_endereco: "",
    descricao_servico: "",
    valor_servico: "",
    codigo_servico: "1.01",
    aliquota_iss: "5",
  });

  const emitirNfse = useEmitirNfseUberaba();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!form.tomador_nome || !form.descricao_servico || !form.valor_servico) {
      return;
    }

    emitirNfse.mutate({
      empresa_id: "temp-empresa-id", // Em produção, pegar do contexto do usuário
      tomador_nome: form.tomador_nome,
      tomador_cpf_cnpj: form.tomador_cpf_cnpj,
      tomador_email: form.tomador_email,
      tomador_endereco: form.tomador_endereco,
      descricao_servico: form.descricao_servico,
      valor_servico: parseFloat(form.valor_servico),
      codigo_servico: form.codigo_servico,
      aliquota_iss: parseFloat(form.aliquota_iss),
    });
  };

  const resetForm = () => {
    setForm({
      tomador_nome: "",
      tomador_cpf_cnpj: "",
      tomador_email: "",
      tomador_endereco: "",
      descricao_servico: "",
      valor_servico: "",
      codigo_servico: "1.01",
      aliquota_iss: "5",
    });
  };

  React.useEffect(() => {
    if (emitirNfse.isSuccess) {
      resetForm();
    }
  }, [emitirNfse.isSuccess]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="h-6 w-6 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold">Emissão de NFSe</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>Uberaba - MG</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dados do Tomador */}
        <Card>
          <CardHeader>
            <CardTitle>Dados do Tomador</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tomador_nome">Nome/Razão Social *</Label>
                <Input
                  id="tomador_nome"
                  name="tomador_nome"
                  value={form.tomador_nome}
                  onChange={handleChange}
                  required
                  placeholder="Nome completo ou razão social"
                />
              </div>
              <div>
                <Label htmlFor="tomador_cpf_cnpj">CPF/CNPJ</Label>
                <Input
                  id="tomador_cpf_cnpj"
                  name="tomador_cpf_cnpj"
                  value={form.tomador_cpf_cnpj}
                  onChange={handleChange}
                  placeholder="000.000.000-00 ou 00.000.000/0000-00"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tomador_email">E-mail</Label>
                <Input
                  id="tomador_email"
                  name="tomador_email"
                  type="email"
                  value={form.tomador_email}
                  onChange={handleChange}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div>
                <Label htmlFor="tomador_endereco">Endereço</Label>
                <Input
                  id="tomador_endereco"
                  name="tomador_endereco"
                  value={form.tomador_endereco}
                  onChange={handleChange}
                  placeholder="Rua, número, bairro"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dados do Serviço */}
        <Card>
          <CardHeader>
            <CardTitle>Dados do Serviço</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="descricao_servico">Descrição do Serviço *</Label>
              <Textarea
                id="descricao_servico"
                name="descricao_servico"
                value={form.descricao_servico}
                onChange={handleChange}
                required
                placeholder="Descrição detalhada do serviço prestado"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="codigo_servico">Código do Serviço</Label>
                <Select
                  value={form.codigo_servico}
                  onValueChange={(value) => handleSelectChange("codigo_servico", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1.01">1.01 - Análise e desenvolvimento de sistemas</SelectItem>
                    <SelectItem value="1.02">1.02 - Programação</SelectItem>
                    <SelectItem value="1.03">1.03 - Processamento de dados</SelectItem>
                    <SelectItem value="1.04">1.04 - Elaboração de programas de computadores</SelectItem>
                    <SelectItem value="1.05">1.05 - Licenciamento ou cessão de direito de uso de programas</SelectItem>
                    <SelectItem value="17.01">17.01 - Assessoria ou consultoria de qualquer natureza</SelectItem>
                    <SelectItem value="25.01">25.01 - Serviços de funerária</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="valor_servico">Valor do Serviço (R$) *</Label>
                <Input
                  id="valor_servico"
                  name="valor_servico"
                  type="number"
                  value={form.valor_servico}
                  onChange={handleChange}
                  required
                  placeholder="0,00"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <Label htmlFor="aliquota_iss">Alíquota ISS (%)</Label>
                <Select
                  value={form.aliquota_iss}
                  onValueChange={(value) => handleSelectChange("aliquota_iss", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2%</SelectItem>
                    <SelectItem value="3">3%</SelectItem>
                    <SelectItem value="4">4%</SelectItem>
                    <SelectItem value="5">5% (Padrão)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex gap-3">
          <Button 
            type="submit" 
            disabled={emitirNfse.isPending}
            className="flex-1"
          >
            {emitirNfse.isPending ? "Emitindo..." : "Emitir NFSe"}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={resetForm}
            disabled={emitirNfse.isPending}
          >
            Limpar
          </Button>
        </div>
      </form>

      {/* Resultado da Emissão */}
      {emitirNfse.isSuccess && emitirNfse.data && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-700">NFSe Emitida com Sucesso!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Número da NFSe:</strong> {emitirNfse.data.numero_nfse}
              </div>
              <div>
                <strong>Código de Verificação:</strong> {emitirNfse.data.codigo_verificacao}
              </div>
              <div>
                <strong>Valor Total:</strong> R$ {emitirNfse.data.valor_total?.toFixed(2)}
              </div>
              <div>
                <strong>Data de Emissão:</strong> {emitirNfse.data.data_emissao ? new Date(emitirNfse.data.data_emissao).toLocaleDateString('pt-BR') : ''}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
