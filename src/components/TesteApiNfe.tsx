
import { useState } from 'react';
import { useCreateNotaFiscal } from '@/hooks/useNotasFiscais';
import { useEmpresas } from '@/hooks/useEmpresas';
import { useClientes } from '@/hooks/useClientes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from '@/hooks/use-toast';
import { Loader2, TestTube } from "lucide-react";

export const TesteApiNfe = () => {
  const [formData, setFormData] = useState({
    empresa_id: '',
    cliente_id: '',
    numero: '',
    valor_total: '',
    observacoes: ''
  });

  const { data: empresas } = useEmpresas();
  const { data: clientes } = useClientes(formData.empresa_id);
  const createNotaFiscal = useCreateNotaFiscal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.empresa_id || !formData.cliente_id || !formData.numero || !formData.valor_total) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const notaData = {
      empresa_id: formData.empresa_id,
      cliente_id: formData.cliente_id,
      numero: parseInt(formData.numero),
      serie: 1,
      valor_total: parseFloat(formData.valor_total),
      natureza_operacao: 'Venda de mercadoria adquirida ou produzida pelo estabelecimento',
      observacoes: formData.observacoes || null,
      itens: [
        {
          produto_id: 'teste-produto-id',
          quantidade: 1,
          valor_unitario: parseFloat(formData.valor_total),
          valor_total: parseFloat(formData.valor_total),
          cfop: '5102'
        }
      ]
    };

    console.log('Testando API de NFe com dados:', notaData);
    
    try {
      const resultado = await createNotaFiscal.mutateAsync(notaData);
      
      if (resultado?.data || resultado?.sefazResult) {
        toast({
          title: "Teste realizado com sucesso!",
          description: `NFe ${formData.numero} processada. Status: ${resultado?.sefazResult?.success ? 'Autorizada' : 'Erro'}`,
        });
      }
      
      // Limpar formulário após sucesso
      setFormData({
        empresa_id: formData.empresa_id, // Manter empresa selecionada
        cliente_id: '',
        numero: '',
        valor_total: '',
        observacoes: ''
      });
    } catch (error) {
      console.error('Erro no teste da API:', error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          Teste de API - Criação de NFe
        </CardTitle>
        <CardDescription>
          Teste a conexão com a API de criação de notas fiscais usando dados reais do banco
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="empresa">Empresa *</Label>
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
              <Label htmlFor="cliente">Cliente *</Label>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numero">Número da NFe *</Label>
              <Input
                id="numero"
                type="number"
                placeholder="Ex: 1002"
                value={formData.numero}
                onChange={(e) => setFormData({...formData, numero: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor">Valor Total *</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                placeholder="Ex: 1500.00"
                value={formData.valor_total}
                onChange={(e) => setFormData({...formData, valor_total: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              placeholder="Observações adicionais para a nota fiscal..."
              value={formData.observacoes}
              onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={createNotaFiscal.isPending}
          >
            {createNotaFiscal.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testando API...
              </>
            ) : (
              <>
                <TestTube className="mr-2 h-4 w-4" />
                Testar Criação de NFe
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2">Status do Teste:</h4>
          <p className="text-sm text-muted-foreground">
            Este teste simula uma conexão com a API da SEFAZ para criação de NFe. 
            O sistema agora carrega dados reais de empresas e clientes do banco de dados.
          </p>
          <ul className="text-sm text-muted-foreground mt-2 list-disc list-inside">
            <li>Empresas carregadas do banco de dados</li>
            <li>Clientes filtrados por empresa selecionada</li>
            <li>Integração com Edge Function de SEFAZ</li>
            <li>Simulação de ambiente de homologação</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
