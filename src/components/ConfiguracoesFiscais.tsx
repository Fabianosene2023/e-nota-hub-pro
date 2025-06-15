
import React, { useState } from 'react';
import { useConfiguracoes, useUpdateConfiguracoes } from '@/hooks/useConfiguracoes';
import { useEmpresas } from '@/hooks/useEmpresas';
import { Button } from "@/components/ui/button";
import { toast } from '@/hooks/use-toast';
import { Loader2, Settings } from "lucide-react";
import { EmpresaSelector } from './ConfiguracoesFiscais/EmpresaSelector';
import { ConfiguracoesFiscaisTabs } from './ConfiguracoesFiscais/ConfiguracoesFiscaisTabs';
import { ConfiguracoesFiscaisFormData } from './ConfiguracoesFiscais/types';

export const ConfiguracoesFiscais = () => {
  const { data: empresas } = useEmpresas();
  const [empresaSelecionada, setEmpresaSelecionada] = useState<string>('');
  const { data: configuracoes } = useConfiguracoes(empresaSelecionada);
  const updateConfiguracoes = useUpdateConfiguracoes();
  
  const [formData, setFormData] = useState<ConfiguracoesFiscaisFormData>({
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

  const handleFormDataChange = (data: Partial<ConfiguracoesFiscaisFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Configurações Fiscais</h2>
          <p className="text-muted-foreground">
            Configure certificados digitais, séries, SEFAZ e parâmetros fiscais
          </p>
        </div>
      </div>

      <EmpresaSelector
        empresas={empresas}
        empresaSelecionada={empresaSelecionada}
        onEmpresaChange={setEmpresaSelecionada}
      />

      {empresaSelecionada && (
        <form onSubmit={handleSubmit}>
          <ConfiguracoesFiscaisTabs
            formData={formData}
            onFormDataChange={handleFormDataChange}
            empresaId={empresaSelecionada}
          />

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
