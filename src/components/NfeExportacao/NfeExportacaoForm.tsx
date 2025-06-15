
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { FiltrosBusca } from "./FiltrosBusca";
import { ListaNotas } from "./ListaNotas";
import { OpcoesExportacao } from "./OpcoesExportacao";

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
      await new Promise(resolve => setTimeout(resolve, 1500));
      
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
          <FiltrosBusca
            dataInicio={dataInicio}
            setDataInicio={setDataInicio}
            dataFim={dataFim}
            setDataFim={setDataFim}
            numeroNFe={numeroNFe}
            setNumeroNFe={setNumeroNFe}
            chaveAcesso={chaveAcesso}
            setChaveAcesso={setChaveAcesso}
            statusFiltro={statusFiltro}
            setStatusFiltro={setStatusFiltro}
            isLoading={isLoading}
            onBuscar={buscarNotas}
          />

          <ListaNotas
            notas={notasEncontradas}
            todasSelecionadas={todasSelecionadas}
            onToggleSelecaoTodas={toggleSelecaoTodas}
            onToggleSelecaoNota={toggleSelecaoNota}
          />
        </TabsContent>

        <TabsContent value="exportacao" className="space-y-4">
          <OpcoesExportacao
            formatoExportacao={formatoExportacao}
            setFormatoExportacao={setFormatoExportacao}
            totalNotas={notasEncontradas.length}
            notasSelecionadas={notasEncontradas.filter(nota => nota.selecionada).length}
            isLoading={isLoading}
            onExportar={exportarNotas}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
