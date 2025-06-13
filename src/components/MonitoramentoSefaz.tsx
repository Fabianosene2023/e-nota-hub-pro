
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useEstatisticasSefaz, useLogsSefaz } from '@/hooks/useLogsSefaz';
import { useEmpresas } from '@/hooks/useEmpresas';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const MonitoramentoSefaz = () => {
  const [empresaSelecionada, setEmpresaSelecionada] = useState<string>('');
  const [periodo, setPeriodo] = useState<'dia' | 'semana' | 'mes'>('semana');
  const [alertasAtivos, setAlertasAtivos] = useState<Array<{
    id: string;
    tipo: 'erro' | 'warning' | 'info';
    titulo: string;
    mensagem: string;
    timestamp: string;
  }>>([]);

  const { data: empresas } = useEmpresas();
  const { data: estatisticas, refetch: refetchEstatisticas } = useEstatisticasSefaz(empresaSelecionada, periodo);
  const { data: logs } = useLogsSefaz(empresaSelecionada, {
    dataInicio: new Date(Date.now() - (periodo === 'dia' ? 24 * 60 * 60 * 1000 : 
                          periodo === 'semana' ? 7 * 24 * 60 * 60 * 1000 : 
                          30 * 24 * 60 * 60 * 1000)).toISOString()
  });

  // Simular dados para o gráfico de desempenho
  const dadosGrafico = logs?.slice(0, 10).map((log, index) => ({
    timestamp: new Date(log.created_at).getHours() + ':00',
    tempo_resposta: log.tempo_resposta_ms || 0,
    status: log.status_operacao === 'sucesso' ? 1 : 0
  })) || [];

  // Verificar alertas críticos
  useEffect(() => {
    if (estatisticas) {
      const novosAlertas = [];
      
      // Alerta de taxa de erro alta
      if (estatisticas.taxaSucesso < 90) {
        novosAlertas.push({
          id: 'taxa_erro_alta',
          tipo: 'erro' as const,
          titulo: 'Taxa de Erro Elevada',
          mensagem: `Taxa de sucesso: ${estatisticas.taxaSucesso.toFixed(1)}% (abaixo de 90%)`,
          timestamp: new Date().toISOString()
        });
      }
      
      // Alerta de tempo de resposta alto
      if (estatisticas.tempoMedioResposta > 5000) {
        novosAlertas.push({
          id: 'tempo_resposta_alto',
          tipo: 'warning' as const,
          titulo: 'Tempo de Resposta Alto',
          mensagem: `Tempo médio: ${estatisticas.tempoMedioResposta}ms (acima de 5s)`,
          timestamp: new Date().toISOString()
        });
      }
      
      // Alerta de volume baixo (possível problema)
      if (estatisticas.totalOperacoes < 5 && periodo === 'dia') {
        novosAlertas.push({
          id: 'volume_baixo',
          tipo: 'info' as const,
          titulo: 'Volume de Operações Baixo',
          mensagem: `Apenas ${estatisticas.totalOperacoes} operações hoje`,
          timestamp: new Date().toISOString()
        });
      }
      
      setAlertasAtivos(novosAlertas);
    }
  }, [estatisticas, periodo]);

  const getStatusColor = (taxaSucesso: number) => {
    if (taxaSucesso >= 95) return 'text-green-600';
    if (taxaSucesso >= 90) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAlertIcon = (tipo: string) => {
    switch (tipo) {
      case 'erro': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Monitoramento SEFAZ</h2>
          <p className="text-muted-foreground">Dashboard de monitoramento em tempo real</p>
        </div>
        <Button 
          onClick={() => refetchEstatisticas()}
          variant="outline"
          size="sm"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex gap-4">
        <Select value={empresaSelecionada} onValueChange={setEmpresaSelecionada}>
          <SelectTrigger className="w-[250px]">
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

        <Select value={periodo} onValueChange={(value: 'dia' | 'semana' | 'mes') => setPeriodo(value)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dia">Último Dia</SelectItem>
            <SelectItem value="semana">Última Semana</SelectItem>
            <SelectItem value="mes">Último Mês</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Alertas Ativos */}
      {alertasAtivos.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Alertas Ativos</h3>
          {alertasAtivos.map((alerta) => (
            <Alert key={alerta.id} variant={alerta.tipo === 'erro' ? 'destructive' : 'default'}>
              {getAlertIcon(alerta.tipo)}
              <AlertTitle>{alerta.titulo}</AlertTitle>
              <AlertDescription>{alerta.mensagem}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Métricas Principais */}
      {estatisticas && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Operações</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estatisticas.totalOperacoes}</div>
              <p className="text-xs text-muted-foreground">
                no período selecionado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getStatusColor(estatisticas.taxaSucesso)}`}>
                {estatisticas.taxaSucesso.toFixed(1)}%
              </div>
              <Progress value={estatisticas.taxaSucesso} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(estatisticas.tempoMedioResposta / 1000).toFixed(1)}s
              </div>
              <p className="text-xs text-muted-foreground">
                tempo de resposta médio
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Erros</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{estatisticas.erros}</div>
              <p className="text-xs text-muted-foreground">
                operações com erro
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Gráfico de Desempenho */}
      {dadosGrafico.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Desempenho das Operações</CardTitle>
            <CardDescription>Tempo de resposta ao longo do tempo</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dadosGrafico}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip 
                  labelFormatter={(label) => `Horário: ${label}`}
                  formatter={(value, name) => [
                    name === 'tempo_resposta' ? `${value}ms` : value,
                    name === 'tempo_resposta' ? 'Tempo de Resposta' : 'Status'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="tempo_resposta" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ fill: '#8884d8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Operações por Tipo */}
      {estatisticas?.operacoesPorTipo && (
        <Card>
          <CardHeader>
            <CardTitle>Operações por Tipo</CardTitle>
            <CardDescription>Distribuição das operações realizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(estatisticas.operacoesPorTipo).map(([tipo, quantidade]) => (
                <div key={tipo} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{tipo}</Badge>
                  </div>
                  <div className="font-semibold">{quantidade}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!empresaSelecionada && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Selecione uma empresa para visualizar o monitoramento</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
