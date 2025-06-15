
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { Download, FileText, FileSpreadsheet, Search, Loader2, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface NFEParaExportar {
  id: string;
  numero: string;
  serie: string;
  chave_acesso: string;
  data_emissao: string;
  valor_total: number;
  cliente_nome: string;
  status: string;
  selecionada: boolean;
}

export const NfeExportacaoForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formatoExportacao, setFormatoExportacao] = useState<string>("");
  const [dataInicio, setDataInicio] = useState<Date>();
  const [dataFim, setDataFim] = useState<Date>();
  const [numeroNFe, setNumeroNFe] = useState("");
  const [chaveAcesso, setChaveAcesso] = useState("");
  const [statusFiltro, setStatusFiltro] = useState<string>("");
  const [notasEncontradas, setNotasEncontradas] = useState<NFEParaExportar[]>([]);
  const [todasSelecionadas, setTodasSelecionadas] = useState(false);

  const buscarNotas = async () => {
    setIsLoading(true);
    
    try {
      // Simular busca de notas
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Dados simulados
      const notasSimuladas: NFEParaExportar[] = [
        {
          id: "1",
          numero: "123",
          serie: "1",
          chave_acesso: "35240123456789000123550010000000123456789012",
          data_emissao: new Date().toISOString(),
          valor_total: 1500.00,
          cliente_nome: "Cliente Exemplo Ltda",
          status: "autorizada",
          selecionada: false
        },
        {
          id: "2",
          numero: "124",
          serie: "1",
          chave_acesso: "35240123456789000123550010000000124567890123",
          data_emissao: new Date(Date.now() - 86400000).toISOString(),
          valor_total: 2300.50,
          cliente_nome: "Outro Cliente S/A",
          status: "autorizada",
          selecionada: false
        },
        {
          id: "3",
          numero: "125",
          serie: "1",
          chave_acesso: "35240123456789000123550010000000125678901234",
          data_emissao: new Date(Date.now() - 172800000).toISOString(),
          valor_total: 850.75,
          cliente_nome: "Terceiro Cliente ME",
          status: "autorizada",
          selecionada: false
        }
      ];

      setNotasEncontradas(notasSimuladas);
      
      toast({
        title: "Busca Concluída",
        description: `${notasSimuladas.length} nota(s) encontrada(s)`,
      });
      
    } catch (error) {
      toast({
        title: "Erro na Busca",
        description: "Erro ao buscar notas fiscais",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportarNotas = async () => {
    const notasSelecionadas = notasEncontradas.filter(nota => nota.selecionada);
    
    if (notasSelecionadas.length === 0) {
      toast({
        title: "Nenhuma Nota Selecionada",
        description: "Selecione pelo menos uma nota para exportar",
        variant: "destructive",
      });
      return;
    }

    if (!formatoExportacao) {
      toast({
        title: "Formato Não Selecionado",
        description: "Selecione o formato de exportação",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simular exportação
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const nomeArquivo = `nfe_exportacao_${new Date().toISOString().split('T')[0]}.${formatoExportacao}`;
      
      toast({
        title: "Exportação Concluída!",
        description: `${notasSelecionadas.length} nota(s) exportada(s) em ${nomeArquivo}`,
      });
      
    } catch (error) {
      toast({
        title: "Erro na Exportação",
        description: "Erro ao exportar notas fiscais",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelecaoTodas = () => {
    const novoEstado = !todasSelecionadas;
    setTodasSelecionadas(novoEstado);
    setNotasEncontradas(notas => 
      notas.map(nota => ({ ...nota, selecionada: novoEstado }))
    );
  };

  const toggleSelecaoNota = (id: string) => {
    setNotasEncontradas(notas => 
      notas.map(nota => 
        nota.id === id ? { ...nota, selecionada: !nota.selecionada } : nota
      )
    );
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'autorizada':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'cancelada':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'erro':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="filtros" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="filtros" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Filtros e Busca
          </TabsTrigger>
          <TabsTrigger value="exportacao" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="filtros" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Filtros de Busca</CardTitle>
              <CardDescription>
                Defina os critérios para buscar as notas fiscais que deseja exportar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <Label htmlFor="numero-nfe">Número da NFe</Label>
                  <Input
                    id="numero-nfe"
                    placeholder="Ex: 123"
                    value={numeroNFe}
                    onChange={(e) => setNumeroNFe(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="status-filtro">Status</Label>
                  <Select value={statusFiltro} onValueChange={setStatusFiltro}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
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
                onClick={buscarNotas}
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
                    Buscar Notas
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {notasEncontradas.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Notas Encontradas</CardTitle>
                    <CardDescription>
                      {notasEncontradas.length} nota(s) encontrada(s)
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="selecionar-todas"
                      checked={todasSelecionadas}
                      onCheckedChange={toggleSelecaoTodas}
                    />
                    <Label htmlFor="selecionar-todas">Selecionar todas</Label>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notasEncontradas.map((nota) => (
                    <div key={nota.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Checkbox
                        checked={nota.selecionada}
                        onCheckedChange={() => toggleSelecaoNota(nota.id)}
                      />
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-2 text-sm">
                        <div>
                          <strong>NFe {nota.numero}</strong> - Série {nota.serie}
                        </div>
                        <div>
                          {nota.cliente_nome}
                        </div>
                        <div>
                          R$ {nota.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <div>
                          <span className={`px-2 py-1 rounded text-xs border ${getStatusBadgeColor(nota.status)}`}>
                            {nota.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="exportacao" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Opções de Exportação</CardTitle>
              <CardDescription>
                Escolha o formato desejado para exportar as notas selecionadas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="formato-exportacao">Formato de Exportação</Label>
                <Select value={formatoExportacao} onValueChange={setFormatoExportacao}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="xml">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        XML - Arquivos originais da SEFAZ
                      </div>
                    </SelectItem>
                    <SelectItem value="pdf">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        PDF - DANFE das notas
                      </div>
                    </SelectItem>
                    <SelectItem value="xlsx">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="h-4 w-4" />
                        Excel - Planilha com dados das notas
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {notasEncontradas.length > 0 && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    {notasEncontradas.filter(nota => nota.selecionada).length} de {notasEncontradas.length} nota(s) selecionada(s) para exportação
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={exportarNotas}
                disabled={isLoading || notasEncontradas.length === 0}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Exportando...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Exportar Notas Selecionadas
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
