
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Shield, FileText, Settings, Globe } from "lucide-react";
import { RegimeFiscalTab } from './RegimeFiscalTab';
import { CertificadoDigitalTab } from './CertificadoDigitalTab';
import { SeriesNumeracaoTab } from './SeriesNumeracaoTab';
import { ConfiguracoesGeraisTab } from './ConfiguracoesGeraisTab';
import { ConfiguracoesSefazTab } from './ConfiguracoesSefazTab';
import { ConfiguracoesFiscaisFormData } from './types';

interface ConfiguracoesFiscaisTabsProps {
  formData: ConfiguracoesFiscaisFormData;
  onFormDataChange: (data: Partial<ConfiguracoesFiscaisFormData>) => void;
  empresaId?: string;
}

export const ConfiguracoesFiscaisTabs: React.FC<ConfiguracoesFiscaisTabsProps> = ({
  formData,
  onFormDataChange,
  empresaId
}) => {
  return (
    <Tabs defaultValue="regime" className="space-y-4">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="regime" className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          Regime Fiscal
        </TabsTrigger>
        <TabsTrigger value="sefaz" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          SEFAZ
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

      <TabsContent value="sefaz">
        {empresaId ? (
          <ConfiguracoesSefazTab empresaId={empresaId} />
        ) : (
          <div className="text-center text-muted-foreground py-8">
            Selecione uma empresa para configurar a SEFAZ
          </div>
        )}
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
