
import React from 'react';
import { useConfiguracoesSefaz } from '@/hooks/useConfiguracoesSefaz';
import { ModoSefazSelector } from './ModoSefazSelector';
import { SefazConfigForm } from './SefazConfigForm';
import { CscConfigForm } from './CscConfigForm';
import { SefazTestButton } from './SefazTestButton';

interface ConfiguracoesSefazTabProps {
  empresaId: string;
}

export const ConfiguracoesSefazTab: React.FC<ConfiguracoesSefazTabProps> = ({ empresaId }) => {
  const { data: configs, isLoading } = useConfiguracoesSefaz(empresaId);
  
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

  const handleModoChange = (producao: boolean) => {
    setFormData(prev => ({
      ...prev,
      modo_producao: producao,
      ambiente: producao ? 'producao' : 'homologacao'
    }));
  };

  const handleFormDataChange = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
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

      <SefazConfigForm
        formData={formData}
        onFormDataChange={handleFormDataChange}
      />

      <CscConfigForm
        formData={formData}
        onFormDataChange={handleFormDataChange}
      />

      <div className="flex gap-4">
        <SefazTestButton empresaId={empresaId} />
      </div>
    </div>
  );
};
