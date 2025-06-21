
import React, { useState } from 'react';
import { FileText, Calendar, User, Activity, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLogsOperacoes } from '@/hooks/useLogsOperacoes';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from "@/components/ui/badge";

const ConsultaLogs = () => {
  const { profile } = useAuth();
  const [filtroTipo, setFiltroTipo] = useState<string>('');
  const [busca, setBusca] = useState<string>('');
  
  const { data: logs, isLoading, error } = useLogsOperacoes(profile?.empresa_id || '');

  // Filtrar logs baseado nos filtros
  const logsFiltrados = logs?.filter(log => {
    const matchTipo = !filtroTipo || log.tipo_operacao === filtroTipo;
    const matchBusca = !busca || log.descricao.toLowerCase().includes(busca.toLowerCase());
    return matchTipo && matchBusca;
  }) || [];

  // Calcular estatísticas
  const totalLogs = logs?.length || 0;
  const usuariosAtivos = new Set(logs?.map(log => log.usuario_id).filter(Boolean)).size;
  const acoesHoje = logs?.filter(log => {
    const hoje = new Date();
    const logDate = new Date(log.created_at);
    return logDate.toDateString() === hoje.toDateString();
  }).length || 0;

  const ultimaAtividade = logs && logs.length > 0 ? logs[0] : null;
  const tempoUltimaAtividade = ultimaAtividade ? (() => {
    const agora = new Date();
    const tempo = new Date(ultimaAtividade.created_at);
    const diff = Math.floor((agora.getTime() - tempo.getTime()) / (1000 * 60));
    return diff < 60 ? `${diff}min` : `${Math.floor(diff / 60)}h`;
  })() : 'N/A';

  const getBadgeVariant = (tipo: string) => {
    switch (tipo) {
      case 'nfe_emissao': return 'default';
      case 'cliente_cadastro': return 'secondary';
      case 'produto_atualizado': return 'outline';
      default: return 'secondary';
    }
  };

  const formatarTempo = (timestamp: string) => {
    const data = new Date(timestamp);
    const agora = new Date();
    const diff = agora.getTime() - data.getTime();
    const minutos = Math.floor(diff / (1000 * 60));
    const horas = Math.floor(diff / (1000 * 60 * 60));
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (dias > 0) return `${dias} ${dias === 1 ? 'dia' : 'dias'} atrás`;
    if (horas > 0) return `${horas} ${horas === 1 ? 'hora' : 'horas'} atrás`;
    return `${minutos} ${minutos === 1 ? 'minuto' : 'minutos'} atrás`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Consulta de Log de Uso</h2>
          <p className="text-muted-foreground">
            Visualize e monitore as atividades do sistema
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Logs
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : totalLogs}</div>
            <p className="text-xs text-muted-foreground">
              Registros no sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Usuários Ativos
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : usuariosAtivos}</div>
            <p className="text-xs text-muted-foreground">
              Com atividades registradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ações Hoje
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : acoesHoje}</div>
            <p className="text-xs text-muted-foreground">
              Operações realizadas hoje
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Última Atividade
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? '...' : tempoUltimaAtividade}</div>
            <p className="text-xs text-muted-foreground">
              {ultimaAtividade?.descricao?.substring(0, 20) || 'Nenhuma atividade'}...
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Refine sua busca nos logs do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar nos logs..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Tipo de operação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os tipos</SelectItem>
                <SelectItem value="nfe_emissao">Emissão NFe</SelectItem>
                <SelectItem value="cliente_cadastro">Cadastro Cliente</SelectItem>
                <SelectItem value="produto_atualizado">Produto Atualizado</SelectItem>
                <SelectItem value="configuracao">Configuração</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => { setBusca(''); setFiltroTipo(''); }}>
              Limpar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Logs do Sistema</CardTitle>
          <CardDescription>
            Histórico detalhado das operações realizadas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <Activity className="h-8 w-8 mx-auto mb-4 opacity-50 animate-spin" />
              <p>Carregando logs...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Erro ao carregar logs</p>
              <p className="text-sm">{error.message}</p>
            </div>
          ) : logsFiltrados.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Nenhum log encontrado</p>
              <p className="text-sm">
                {busca || filtroTipo ? 'Tente ajustar os filtros de busca' : 'Ainda não há atividades registradas'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {logsFiltrados.slice(0, 50).map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={getBadgeVariant(log.tipo_operacao)}>
                        {log.tipo_operacao.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatarTempo(log.created_at)}
                      </span>
                    </div>
                    <p className="text-sm font-medium">{log.descricao}</p>
                    {log.ip_origem && (
                      <p className="text-xs text-muted-foreground">IP: {log.ip_origem}</p>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(log.created_at).toLocaleString('pt-BR')}
                  </div>
                </div>
              ))}
              {logsFiltrados.length > 50 && (
                <div className="text-center py-4 text-muted-foreground">
                  <p>Mostrando os primeiros 50 resultados de {logsFiltrados.length} logs encontrados</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsultaLogs;
