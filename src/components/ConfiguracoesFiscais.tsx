
import React, { useState } from 'react';
import { useConfiguracoes, useUpdateConfiguracoes } from '@/hooks/useConfiguracoes';
import { useEmpresas } from '@/hooks/useEmpresas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from '@/hooks/use-toast';
import { Loader2, Settings, Shield, FileText, Building2 } from "lucide-react";

export const ConfiguracoesFiscais = () => {
  const { data: empresas } = useEmpresas();
  const [empresaSelecionada, setEmpresaSelecionada] = useState<string>('');
  const { data: configuracoes } = useConfiguracoes(empresaSelecionada);
  const updateConfiguracoes = useUpdateConfiguracoes();
  
  const [formData, setFormData] = useState({
    certificado_a1_data: '',
    certificado_a1_senha: '',
    serie_nfe: 1,
    serie_nfce: 1,
    csc_id: '',
    csc_token: '',
    email_padrao_envio: '',
    layout_danfe: 'retrato',
    proxima_num_nf: 1,
    regime_fiscal: 'simples_nacional',
    regime_tributario: 'simples_nacional',
    enviar_nfe_por_email: false
  });

  // Atualizar form quando configurações carregarem
  React.useEffect(() => {
    if (configuracoes) {
      setFormData({
        certificado_a1_data: configuracoes.certificado_a1_data || '',
        certificado_a1_senha: configuracoes.certificado_a1_senha || '',
        serie_nfe: configuracoes.serie_nfe || 1,
        serie_nfce: configuracoes.serie_nfce || 1,
        csc_id: configuracoes.csc_id || '',
        csc_token: configuracoes.csc_token || '',
        email_padrao_envio: configuracoes.email_padrao_envio || '',
        layout_danfe: configuracoes.layout_danfe || 'retrato',
        proxima_num_nf: configuracoes.proxima_num_nf || 1,
        regime_fiscal: configuracoes.regime_fiscal || 'simples_nacional',
        regime_tributario: configuracoes.regime_tributario || 'simples_nacional',
        enviar_nfe_por_email: configuracoes.enviar_nfe_por_email || false
      });
    }
  }, [configuracoes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!empresaSelecionada) {
      toast({
        title: "Erro",
        description: "Selecione uma empresa primeiro",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateConfiguracoes.mutateAsync({
        empresaId: empresaSelecionada,
        configuracoes: formData
      });
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setFormData({...formData, certificado_a1_data: base64});
        toast({
          title: "Sucesso!",
          description: "Certificado carregado com sucesso",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Configurações Fiscais</h2>
          <p className="text-muted-foreground">
            Configure certificados digitais, séries e parâmetros fiscais
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Selecionar Empresa</CardTitle>
          <CardDescription>
            Escolha a empresa para configurar os parâmetros fiscais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={empresaSelecionada} onValueChange={setEmpresaSelecionada}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione uma empresa" />
            </SelectTrigger>
            <SelectContent>
              {empresas?.map((empresa) => (
                <SelectItem key={empresa.id} value={empresa.id}>
                  {empresa.nome_fantasia || empresa.razao_social}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {empresaSelecionada && (
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="regime" className="space-y-4">
            <TabsList>
              <TabsTrigger value="regime" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Regime Fiscal
              </TabsTrigger>
              <TabsTrigger value="certificado" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Certificado Digital
              </TabsTrigger>
              <TabsTrigger value="series" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Séries e Numeração
              </TabsTrigger>
              <TabsTrigger value="geral" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configurações Gerais
              </TabsTrigger>
            </TabsList>

            <TabsContent value="regime">
              <Card>
                <CardHeader>
                  <CardTitle>Regime Fiscal e Tributário</CardTitle>
                  <CardDescription>
                    Configure o regime fiscal e tributário da empresa
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="regime_fiscal">Regime Fiscal</Label>
                    <Select 
                      value={formData.regime_fiscal} 
                      onValueChange={(value) => setFormData({...formData, regime_fiscal: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="simples_nacional">Simples Nacional</SelectItem>
                        <SelectItem value="simples_nacional_mei">Simples Nacional - MEI</SelectItem>
                        <SelectItem value="lucro_presumido">Lucro Presumido</SelectItem>
                        <SelectItem value="lucro_real">Lucro Real</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="regime_tributario">Regime Tributário</Label>
                    <Select 
                      value={formData.regime_tributario} 
                      onValueChange={(value) => setFormData({...formData, regime_tributario: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="simples_nacional">Simples Nacional</SelectItem>
                        <SelectItem value="simples_nacional_excesso">Simples Nacional - Excesso de Sublimite de Receita Bruta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enviar_nfe_por_email">Enviar NFe por E-mail</Label>
                      <p className="text-sm text-muted-foreground">
                        Enviar automaticamente as notas fiscais por e-mail para os clientes
                      </p>
                    </div>
                    <Switch
                      id="enviar_nfe_por_email"
                      checked={formData.enviar_nfe_por_email}
                      onCheckedChange={(checked) => setFormData({...formData, enviar_nfe_por_email: checked})}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="certificado">
              <Card>
                <CardHeader>
                  <CardTitle>Certificado Digital A1</CardTitle>
                  <CardDescription>
                    Configure o certificado digital para assinatura das NFe
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="certificado">Arquivo do Certificado (.p12/.pfx)</Label>
                    <Input
                      id="certificado"
                      type="file"
                      accept=".p12,.pfx"
                      onChange={handleFileUpload}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="senha">Senha do Certificado</Label>
                    <Input
                      id="senha"
                      type="password"
                      placeholder="Digite a senha do certificado"
                      value={formData.certificado_a1_senha}
                      onChange={(e) => setFormData({...formData, certificado_a1_senha: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="series">
              <Card>
                <CardHeader>
                  <CardTitle>Séries e Numeração</CardTitle>
                  <CardDescription>
                    Configure as séries e próximos números para NFe e NFCe
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="serie_nfe">Série NFe</Label>
                      <Input
                        id="serie_nfe"
                        type="number"
                        min="1"
                        max="999"
                        value={formData.serie_nfe}
                        onChange={(e) => setFormData({...formData, serie_nfe: parseInt(e.target.value)})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="serie_nfce">Série NFCe</Label>
                      <Input
                        id="serie_nfce"
                        type="number"
                        min="1"
                        max="999"
                        value={formData.serie_nfce}
                        onChange={(e) => setFormData({...formData, serie_nfce: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="proxima_num_nf">Próximo Número NFe</Label>
                    <Input
                      id="proxima_num_nf"
                      type="number"
                      min="1"
                      value={formData.proxima_num_nf}
                      onChange={(e) => setFormData({...formData, proxima_num_nf: parseInt(e.target.value)})}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="geral">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações Gerais</CardTitle>
                  <CardDescription>
                    Configure CSC, email padrão e layout do DANFE
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="csc_id">CSC ID (NFCe)</Label>
                      <Input
                        id="csc_id"
                        placeholder="Ex: 000001"
                        value={formData.csc_id}
                        onChange={(e) => setFormData({...formData, csc_id: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="csc_token">CSC Token (NFCe)</Label>
                      <Input
                        id="csc_token"
                        placeholder="Token fornecido pela SEFAZ"
                        value={formData.csc_token}
                        onChange={(e) => setFormData({...formData, csc_token: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Padrão para Envio</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="fiscal@empresa.com"
                      value={formData.email_padrao_envio}
                      onChange={(e) => setFormData({...formData, email_padrao_envio: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="layout">Layout do DANFE</Label>
                    <Select 
                      value={formData.layout_danfe} 
                      onValueChange={(value) => setFormData({...formData, layout_danfe: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="retrato">Retrato</SelectItem>
                        <SelectItem value="paisagem">Paisagem</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-6">
            <Button 
              type="submit" 
              disabled={updateConfiguracoes.isPending}
              className="min-w-[150px]"
            >
              {updateConfiguracoes.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Settings className="mr-2 h-4 w-4" />
                  Salvar Configurações
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
