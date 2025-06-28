
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePrestadoresServico } from '@/hooks/usePrestadoresServico';
import { useConfiguracaoNfse, useCreateOrUpdateConfiguracaoNfse } from '@/hooks/useConfiguracaoNfse';
import { useEmpresasManager } from '@/hooks/useEmpresasManager';
import { toast } from '@/hooks/use-toast';

export const ConfiguracaoNfseForm = () => {
  const { data: empresas } = useEmpresasManager();
  const empresaId = empresas?.[0]?.id || '';
  const { data: prestadores } = usePrestadoresServico(empresaId);
  const updateConfig = useCreateOrUpdateConfiguracaoNfse();
  
  const [selectedPrestador, setSelectedPrestador] = useState('');
  const { data: config } = useConfiguracaoNfse(selectedPrestador);
  
  const [formData, setFormData] = useState({
    prestador_id: '',
    municipio_codigo: '3550308', // São Paulo por padrão
    municipio_nome: 'São Paulo',
    padrao_nfse: 'ginfes',
    url_webservice: 'https://homologacao.ginfes.com.br/ServiceGinfesImpl',
    ambiente: 'homologacao',
    serie_rps: 'RPS'
  });

  useEffect(() => {
    if (config) {
      setFormData({
        prestador_id: config.prestador_id,
        municipio_codigo: config.municipio_codigo,
        municipio_nome: config.municipio_nome,
        padrao_nfse: config.padrao_nfse,
        url_webservice: config.url_webservice,
        ambiente: config.ambiente,
        serie_rps: config.serie_rps
      });
    }
  }, [config]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPrestador) {
      toast({
        title: "Erro",
        description: "Selecione um prestador de serviço",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateConfig.mutateAsync({
        ...formData,
        prestador_id: selectedPrestador
      });
    } catch (error) {
      // Error handled by hook
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuração NFSe</CardTitle>
        <CardDescription>
          Configure as informações do município para emissão de NFSe
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prestador">Prestador de Serviço</Label>
            <Select value={selectedPrestador} onValueChange={setSelectedPrestador}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o prestador" />
              </SelectTrigger>
              <SelectContent>
                {prestadores?.map((prestador) => (
                  <SelectItem key={prestador.id} value={prestador.id}>
                    {prestador.cnpj} - {prestador.inscricao_municipal}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="municipio_codigo">Código do Município</Label>
              <Input
                id="municipio_codigo"
                value={formData.municipio_codigo}
                onChange={(e) => setFormData({...formData, municipio_codigo: e.target.value})}
                placeholder="3550308"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="municipio_nome">Nome do Município</Label>
              <Input
                id="municipio_nome"
                value={formData.municipio_nome}
                onChange={(e) => setFormData({...formData, municipio_nome: e.target.value})}
                placeholder="São Paulo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="padrao_nfse">Padrão NFSe</Label>
              <Select value={formData.padrao_nfse} onValueChange={(value) => 
                setFormData({...formData, padrao_nfse: value})
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ginfes">Ginfes</SelectItem>
                  <SelectItem value="issnet">ISSNet</SelectItem>
                  <SelectItem value="nfse_sp">NFSe SP</SelectItem>
                  <SelectItem value="betha">Betha</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ambiente">Ambiente</Label>
              <Select value={formData.ambiente} onValueChange={(value) => 
                setFormData({...formData, ambiente: value})
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="homologacao">Homologação</SelectItem>
                  <SelectItem value="producao">Produção</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="url_webservice">URL do Webservice</Label>
            <Input
              id="url_webservice"
              value={formData.url_webservice}
              onChange={(e) => setFormData({...formData, url_webservice: e.target.value})}
              placeholder="https://homologacao.ginfes.com.br/ServiceGinfesImpl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="serie_rps">Série RPS</Label>
            <Input
              id="serie_rps"
              value={formData.serie_rps}
              onChange={(e) => setFormData({...formData, serie_rps: e.target.value})}
              placeholder="RPS"
            />
          </div>

          <Button type="submit" disabled={updateConfig.isPending}>
            {updateConfig.isPending ? 'Salvando...' : 'Salvar Configuração'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
