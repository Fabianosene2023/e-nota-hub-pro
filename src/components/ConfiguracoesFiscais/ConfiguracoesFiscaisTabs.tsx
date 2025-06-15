
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Shield, FileText, Settings } from "lucide-react";
import { RegimeFiscalTab } from './RegimeFiscalTab';
import { CertificadoDigitalTab } from './CertificadoDigitalTab';
import { SeriesNumeracaoTab } from './SeriesNumeracaoTab';
import { ConfiguracoesGeraisTab } from './ConfiguracoesGeraisTab';
import { ConfiguracoesFiscaisFormData } from './types';

interface ConfiguracoesFiscaisTabsProps {
  formData: ConfiguracoesFiscaisFormData;
  onFormDataChange: (data: Partial<ConfiguracoesFiscaisFormData>) => void;
}

export const ConfiguracoesFiscaisTabs: React.FC<ConfiguracoesFiscaisTabsProps> = ({
  formData,
  onFormDataChange
}) => {
  return (
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
        <RegimeFiscalTab formData={formData} onFormDataChange={onFormDataChange} />
      </TabsContent>

      <TabsContent value="certificado">
        <CertificadoDigitalTab formData={formData} onFormDataChange={onFormDataChange} />
      </TabsContent>

      <TabsContent value="series">
        <SeriesNumeracaoTab formData={formData} onFormDataChange={onFormDataChange} />
      </TabsContent>

      <TabsContent value="geral">
        <ConfiguracoesGeraisTab formData={formData} onFormDataChange={onFormDataChange} />
      </TabsContent>
    </Tabs>
  );
};
