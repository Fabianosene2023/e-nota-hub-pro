
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { FileUp, Key, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface NFEImportada {
  chave_acesso: string;
  numero: string;
  serie: string;
  data_emissao: string;
  valor_total: number;
  emitente: {
    cnpj: string;
    razao_social: string;
  };
  destinatario: {
    cnpj: string;
    nome: string;
  };
  status: 'sucesso' | 'erro' | 'duplicada';
  mensagem?: string;
}

export const NfeImportacaoForm: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [xmlContent, setXmlContent] = useState("");
  const [chaveAcesso, setChaveAcesso] = useState("");
  const [resultados, setResultados] = useState<NFEImportada[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== "text/xml" && !file.name.endsWith('.xml')) {
        toast({
          title: "Erro",
          description: "Por favor, selecione um arquivo XML válido",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setXmlContent(content);
      };
      reader.readAsText(file);
    }
  };

  const processarXML = async () => {
    if (!xmlContent.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo XML ou cole o conteúdo",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simular processamento do XML
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Extrair dados básicos do XML (simulação)
      const nfeImportada: NFEImportada = {
        chave_acesso: "35240123456789000123550010000000123456789012",
        numero: "123",
        serie: "1",
        data_emissao: new Date().toISOString().split('T')[0],
        valor_total: 1500.00,
        emitente: {
          cnpj: "12.345.678/0001-90",
          razao_social: "Empresa Emitente Ltda"
        },
        destinatario: {
          cnpj: "98.765.432/0001-10",
          nome: "Empresa Destinatário Ltda"
        },
        status: 'sucesso',
        mensagem: 'NFe importada com sucesso'
      };

      setResultados([nfeImportada]);
      
      toast({
        title: "Sucesso!",
        description: "NFe importada com sucesso",
      });
      
    } catch (error) {
      toast({
        title: "Erro na Importação",
        description: "Erro ao processar o arquivo XML",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const consultarPorChave = async () => {
    if (!chaveAcesso.trim() || chaveAcesso.length !== 44) {
      toast({
        title: "Erro",
        description: "Por favor, informe uma chave de acesso válida (44 dígitos)",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simular consulta na SEFAZ
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const nfeConsultada: NFEImportada = {
        chave_acesso: chaveAcesso,
        numero: "456",
        serie: "1",
        data_emissao: new Date().toISOString().split('T')[0],
        valor_total: 2500.00,
        emitente: {
          cnpj: "11.222.333/0001-44",
          razao_social: "Fornecedor ABC Ltda"
        },
        destinatario: {
          cnpj: "55.666.777/0001-88",
          nome: "Minha Empresa Ltda"
        },
        status: 'sucesso',
        mensagem: 'NFe consultada e importada com sucesso'
      };

      setResultados([nfeConsultada]);
      
      toast({
        title: "Sucesso!",
        description: "NFe consultada e importada com sucesso",
      });
      
    } catch (error) {
      toast({
        title: "Erro na Consulta",
        description: "Erro ao consultar NFe pela chave de acesso",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sucesso':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'erro':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'duplicada':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sucesso':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'erro':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'duplicada':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="xml" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="xml" className="flex items-center gap-2">
            <FileUp className="h-4 w-4" />
            Importar XML
          </TabsTrigger>
          <TabsTrigger value="chave" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Consultar por Chave
          </TabsTrigger>
        </TabsList>

        <TabsContent value="xml" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Importar NFe via XML</CardTitle>
              <CardDescription>
                Faça upload de um arquivo XML ou cole o conteúdo diretamente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="xml-file">Arquivo XML</Label>
                <Input
                  id="xml-file"
                  type="file"
                  accept=".xml"
                  onChange={handleFileUpload}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="xml-content">Ou cole o conteúdo XML</Label>
                <Textarea
                  id="xml-content"
                  placeholder="Cole aqui o conteúdo do XML da NFe..."
                  value={xmlContent}
                  onChange={(e) => setXmlContent(e.target.value)}
                  rows={8}
                  className="mt-1 font-mono text-sm"
                />
              </div>

              <Button 
                onClick={processarXML}
                disabled={isProcessing || !xmlContent.trim()}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando XML...
                  </>
                ) : (
                  <>
                    <FileUp className="mr-2 h-4 w-4" />
                    Importar NFe
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chave" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Consultar NFe por Chave de Acesso</CardTitle>
              <CardDescription>
                Informe a chave de acesso para consultar e importar a NFe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="chave-acesso">Chave de Acesso (44 dígitos)</Label>
                <Input
                  id="chave-acesso"
                  placeholder="Ex: 35240123456789000123550010000000123456789012"
                  value={chaveAcesso}
                  onChange={(e) => setChaveAcesso(e.target.value.replace(/\D/g, ''))}
                  maxLength={44}
                  className="mt-1 font-mono"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {chaveAcesso.length}/44 dígitos
                </p>
              </div>

              <Button 
                onClick={consultarPorChave}
                disabled={isProcessing || chaveAcesso.length !== 44}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Consultando...
                  </>
                ) : (
                  <>
                    <Key className="mr-2 h-4 w-4" />
                    Consultar e Importar
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {resultados.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados da Importação</CardTitle>
            <CardDescription>
              NFes processadas na importação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {resultados.map((nfe, index) => (
                <Alert key={index} className={getStatusColor(nfe.status)}>
                  <div className="flex items-start gap-3">
                    {getStatusIcon(nfe.status)}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">
                          NFe {nfe.numero} - Série {nfe.serie}
                        </h4>
                        <span className="text-sm font-medium">
                          R$ {nfe.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p><strong>Chave:</strong> {nfe.chave_acesso}</p>
                          <p><strong>Data:</strong> {new Date(nfe.data_emissao).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <div>
                          <p><strong>Emitente:</strong> {nfe.emitente.razao_social}</p>
                          <p><strong>CNPJ:</strong> {nfe.emitente.cnpj}</p>
                        </div>
                      </div>
                      
                      {nfe.mensagem && (
                        <AlertDescription className="mt-2">
                          {nfe.mensagem}
                        </AlertDescription>
                      )}
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
