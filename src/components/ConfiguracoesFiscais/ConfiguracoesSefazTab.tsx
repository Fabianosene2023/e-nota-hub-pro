
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useConfiguracoesSefaz, useUpdateConfiguracoesSefaz, useTestarConexaoSefaz } from '@/hooks/useConfiguracoesSefaz';
import { Shield, TestTube, AlertTriangle } from "lucide-react";
import { ModoSefazSelector } from './ModoSefazSelector';

interface ConfiguracoesSefazTabProps {
  empresaId: string;
}

export const ConfiguracoesSefazTab: React.FC<ConfiguracoesSefazTabProps> = ({ empresaId }) => {
  const { data: configs, isLoading } = useConfiguracoesSefaz(empresaId);
  const updateConfiguracoes = useUpdateConfiguracoesSefaz();
  const testarConexao = useTestarConexaoSefaz();
  
  const [formData, setFormData] = React.useState({
    ambiente: 'homologacao' as 'homologacao' | 'producao',
    csc_id: '',
    csc_token: '',
    serie_nfe: 1,
    serie_nfce: 1,
    timeout_sefaz: 30000,
    tentativas_reenvio: 3,
    modo_producao: false
  });

  React.useEffect(() => {
    if (configs) {
      setFormData({
        ambiente: configs.ambiente,
        csc_id: configs.csc_id || '',
        csc_token: configs.csc_token || '',
        serie_nfe: configs.serie_nfe,
        serie_nfce: configs.serie_nfce,
        timeout_sefaz: configs.timeout_sefaz,
        tentativas_reenvio: configs.tentativas_reenvio,
        modo_producao: configs.ambiente === 'producao'
      });
    }
  }, [configs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await updateConfiguracoes.mutateAsync({
      empresa_id: empresaId,
      ambiente: formData.ambiente,
      csc_id: formData.csc_id,
      csc_token: formData.csc_token,
      serie_nfe: formData.serie_nfe,
      serie_nfce: formData.serie_nfce,
      timeout_sefaz: formData.timeout_sefaz,
      tentativas_reenvio: formData.tentativas_reenvio
    });
  };

  const handleTestarConexao = async () => {
    await testarConexao.mutateAsync(empresaId);
  };

  const handleModoChange = (producao: boolean) => {
    setFormData(prev => ({
      ...prev,
      modo_producao: producao,
      ambiente: producao ? 'producao' : 'homologacao'
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ModoSefazSelector
        modoProducao={formData.modo_producao}
        onModoChange={handleModoChange}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Configurações da SEFAZ
            </CardTitle>
            <CardDescription>
              Configure os parâmetros de integração com a Secretaria da Fazenda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ambiente">Ambiente SEFAZ</Label>
                <Select
                  value={formData.ambiente}
                  onValueChange={(value: 'homologacao' | 'producao') => 
                    setFormData(prev => ({ ...prev, ambiente: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="homologacao">Homologação (Testes)</SelectItem>
                    <SelectItem value="producao">Produção (Real)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeout">Timeout (ms)</Label>
                <Input
                  id="timeout"
                  type="number"
                  value={formData.timeout_sefaz}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    timeout_sefaz: parseInt(e.target.value) || 30000 
                  }))}
                  min="5000"
                  max="120000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serie_nfe">Série NFe</Label>
                <Input
                  id="serie_nfe"
                  type="number"
                  value={formData.serie_nfe}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    serie_nfe: parseInt(e.target.value) || 1 
                  }))}
                  min="1"
                  max="999"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serie_nfce">Série NFCe</Label>
                <Input
                  id="serie_nfce"
                  type="number"
                  value={formData.serie_nfce}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    serie_nfce: parseInt(e.target.value) || 1 
                  }))}
                  min="1"
                  max="999"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tentativas">Tentativas de Reenvio</Label>
                <Input
                  id="tentativas"
                  type="number"
                  value={formData.tentativas_reenvio}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    tentativas_reenvio: parseInt(e.target.value) || 3 
                  }))}
                  min="1"
                  max="10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configurações NFCe (CSC)</CardTitle>
            <CardDescription>
              Código de Segurança do Contribuinte para NFCe
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="csc_id">CSC ID</Label>
                <Input
                  id="csc_id"
                  value={formData.csc_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, csc_id: e.target.value }))}
                  placeholder="Identificador do CSC"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="csc_token">CSC Token</Label>
                <Input
                  id="csc_token"
                  type="password"
                  value={formData.csc_token}
                  onChange={(e) => setFormData(prev => ({ ...prev, csc_token: e.target.value }))}
                  placeholder="Token do CSC"
                />
              </div>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                O CSC é obrigatório apenas para emissão de NFCe. Consulte a SEFAZ do seu estado para obter esses dados.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={updateConfiguracoes.isPending}>
            {updateConfiguracoes.isPending ? 'Salvando...' : 'Salvar Configurações'}
          </Button>

          <Button 
            type="button" 
            variant="outline"
            onClick={handleTestarConexao}
            disabled={testarConexao.isPending}
            className="flex items-center gap-2"
          >
            <TestTube className="h-4 w-4" />
            {testarConexao.isPending ? 'Testando...' : 'Testar Conexão'}
          </Button>
        </div>
      </form>
    </div>
  );
};
