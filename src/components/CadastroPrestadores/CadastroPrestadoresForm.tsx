
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreatePrestadorServico } from '@/hooks/usePrestadoresServico';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export const CadastroPrestadoresForm = () => {
  const { profile } = useAuth();
  const createPrestador = useCreatePrestadorServico();
  
  const [formData, setFormData] = useState({
    cnpj: '',
    inscricao_municipal: '',
    regime_tributario: 'simples_nacional'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile?.empresa_id) {
      toast({
        title: "Erro",
        description: "Empresa não encontrada. Faça login novamente.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.cnpj) {
      toast({
        title: "Erro",
        description: "CNPJ é obrigatório",
        variant: "destructive",
      });
      return;
    }

    try {
      await createPrestador.mutateAsync({
        ...formData,
        empresa_id: profile.empresa_id
      });
      
      // Reset form on success
      setFormData({
        cnpj: '',
        inscricao_municipal: '',
        regime_tributario: 'simples_nacional'
      });
    } catch (error) {
      // Error already handled by hook
      console.error('Error in form submission:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cadastro de Prestador de Serviço</CardTitle>
        <CardDescription>
          Configure os dados do prestador para emissão de NFSe
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ *</Label>
              <Input
                id="cnpj"
                value={formData.cnpj}
                onChange={(e) => setFormData({...formData, cnpj: e.target.value})}
                placeholder="00.000.000/0000-00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inscricao_municipal">Inscrição Municipal</Label>
              <Input
                id="inscricao_municipal"
                value={formData.inscricao_municipal}
                onChange={(e) => setFormData({...formData, inscricao_municipal: e.target.value})}
                placeholder="123456"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="regime_tributario">Regime Tributário</Label>
              <Select value={formData.regime_tributario} onValueChange={(value) => 
                setFormData({...formData, regime_tributario: value})
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simples_nacional">Simples Nacional</SelectItem>
                  <SelectItem value="lucro_presumido">Lucro Presumido</SelectItem>
                  <SelectItem value="lucro_real">Lucro Real</SelectItem>
                  <SelectItem value="mei">MEI</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" disabled={createPrestador.isPending}>
            {createPrestador.isPending ? 'Cadastrando...' : 'Cadastrar Prestador'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
