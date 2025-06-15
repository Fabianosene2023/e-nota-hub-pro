
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePicker } from "@/components/ui/date-picker";
import { Search, Loader2, FileText, Download, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface DocumentoFiscal {
  id: string;
  tipo: 'NFe' | 'NFCe' | 'CTe' | 'NFSe';
  numero: string;
  serie: string;
  chave_acesso?: string;
  data_emissao: string;
  valor_total: number;
  cliente_nome: string;
  status: string;
  protocolo?: string;
}

export const ConsultaDocumentosForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tipoDocumento, setTipoDocumento] = useState<string>("");
  const [dataInicio, setDataInicio] = useState<Date>();
  const [dataFim, setDataFim] = useState<Date>();
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [chaveAcesso, setChaveAcesso] = useState("");
  const [statusFiltro, setStatusFiltro] = useState<string>("");
  const [documentosEncontrados, setDocumentosEncontrados] = useState<DocumentoFiscal[]>([]);

  const buscarDocumentos = async () => {
    setIsLoading(true);
    
    try {
      // Simular busca de documentos
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Dados simulados
      const documentosSimulados: DocumentoFiscal[] = [
        {
          id: "1",
          tipo: "NFe",
          numero: "123",
          serie: "1",
          chave_acesso: "35240123456789000123550010000000123456789012",
          data_emissao: new Date().toISOString(),
          valor_total: 1500.00,
          cliente_nome: "Cliente Exemplo Ltda",
          status: "autorizada",
          protocolo: "135123456789"
        },
        {
          id: "2",
          tipo: "NFCe",
          numero: "45",
          serie: "1",
          chave_acesso: "35240123456789000123650010000000045678901234",
          data_emissao: new Date(Date.now() - 86400000).toISOString(),
          valor_total: 125.50,
          cliente_nome: "Consumidor Final",
          status: "autorizada",
          protocolo: "135987654321"
        },
        {
          id: "3",
          tipo: "CTe",
          numero: "67",
          serie: "1",
          chave_acesso: "35240123456789000123570010000000067890123456",
          data_emissao: new Date(Date.now() - 172800000).toISOString(),
          valor_total: 850.75,
          cliente_nome: "Transportadora ABC",
          status: "autorizada"
        }
      ];

      setDocumentosEncontrados(documentosSimulados);
      
      toast({
        title: "Busca Concluída",
        description: `${documentosSimulados.length} documento(s) encontrado(s)`,
      });
      
    } catch (error) {
      toast({
        title: "Erro na Busca",
        description: "Erro ao buscar documentos fiscais",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const visualizarDocumento = (documento: DocumentoFiscal) => {
    toast({
      title: "Visualizando Documento",
      description: `Abrindo ${documento.tipo} ${documento.numero}`,
    });
  };

  const baixarDocumento = (documento: DocumentoFiscal) => {
    toast({
      title: "Download Iniciado",
      description: `Baixando ${documento.tipo} ${documento.numero}`,
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'autorizada':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelada':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'erro':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTipoDocumentoBadge = (tipo: string) => {
    const colors = {
      'NFe': 'bg-blue-100 text-blue-800',
      'NFCe': 'bg-purple-100 text-purple-800',
      'CTe': 'bg-orange-100 text-orange-800',
      'NFSe': 'bg-green-100 text-green-800'
    };
    return colors[tipo as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="filtros" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="filtros" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Filtros de Busca
          </TabsTrigger>
          <TabsTrigger value="resultados" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Resultados
          </TabsTrigger>
        </TabsList>

        <TabsContent value="filtros" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Critérios de Busca</CardTitle>
              <CardDescription>
                Defina os critérios para consultar documentos fiscais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="tipo-documento">Tipo de Documento</Label>
                  <Select value={tipoDocumento} onValueChange={setTipoDocumento}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="nfe">NFe</SelectItem>
                      <SelectItem value="nfce">NFCe</SelectItem>
                      <SelectItem value="cte">CTe</SelectItem>
                      <SelectItem value="nfse">NFSe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="data-inicio">Data Início</Label>
                  <DatePicker
                    date={dataInicio}
                    onDateChange={setDataInicio}
                    placeholder="Selecione a data de início"
                  />
                </div>
                
                <div>
                  <Label htmlFor="data-fim">Data Fim</Label>
                  <DatePicker
                    date={dataFim}
                    onDateChange={setDataFim}
                    placeholder="Selecione a data de fim"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="numero-documento">Número do Documento</Label>
                  <Input
                    id="numero-documento"
                    placeholder="Ex: 123"
                    value={numeroDocumento}
                    onChange={(e) => setNumeroDocumento(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="status-filtro">Status</Label>
                  <Select value={statusFiltro} onValueChange={setStatusFiltro}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="autorizada">Autorizada</SelectItem>
                      <SelectItem value="cancelada">Cancelada</SelectItem>
                      <SelectItem value="erro">Erro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="chave-acesso">Chave de Acesso</Label>
                <Input
                  id="chave-acesso"
                  placeholder="Ex: 35240123456789000123550010000000123456789012"
                  value={chaveAcesso}
                  onChange={(e) => setChaveAcesso(e.target.value.replace(/\D/g, ''))}
                  maxLength={44}
                  className="font-mono"
                />
              </div>

              <Button 
                onClick={buscarDocumentos}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Buscar Documentos
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resultados" className="space-y-4">
          {documentosEncontrados.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Documentos Encontrados</CardTitle>
                <CardDescription>
                  {documentosEncontrados.length} documento(s) encontrado(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documentosEncontrados.map((documento) => (
                    <div key={documento.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Badge className={getTipoDocumentoBadge(documento.tipo)}>
                            {documento.tipo}
                          </Badge>
                          <span className="font-medium">{documento.numero}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Cliente:</span>
                          <br />
                          {documento.cliente_nome}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Data:</span>
                          <br />
                          {new Date(documento.data_emissao).toLocaleDateString('pt-BR')}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Valor:</span>
                          <br />
                          R$ {documento.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <div>
                          <Badge className={getStatusBadgeColor(documento.status)}>
                            {documento.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => visualizarDocumento(documento)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => baixarDocumento(documento)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Nenhum documento encontrado. Use os filtros para buscar documentos.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
