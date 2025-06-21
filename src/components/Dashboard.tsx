
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, FileText, TrendingUp } from 'lucide-react';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useAtividadesRecentes } from '@/hooks/useAtividadesRecentes';
import { useStatusSistema } from '@/hooks/useStatusSistema';

const Dashboard = () => {
  const { data: stats, isLoading: loadingStats } = useDashboardStats();
  const { data: atividades, isLoading: loadingAtividades } = useAtividadesRecentes();
  const { data: status, isLoading: loadingStatus } = useStatusSistema();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Visão geral do sistema fiscal
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              NFe Emitidas
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loadingStats ? '...' : stats?.nfesEmitidas || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.crescimentoNfe > 0 ? '+' : ''}{stats?.crescimentoNfe?.toFixed(1) || 0}% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Clientes Ativos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loadingStats ? '...' : stats?.clientesAtivos || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              +{stats?.crescimentoClientes?.toFixed(1) || 0}% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Receita Total
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {loadingStats ? '...' : (stats?.receitaTotal || 0).toLocaleString('pt-BR', { 
                minimumFractionDigits: 2,
                maximumFractionDigits: 2 
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              +{stats?.crescimentoReceita?.toFixed(1) || 0}% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Relatórios
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loadingStats ? '...' : stats?.relatoriosGerados || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Gerados este mês
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>
              Últimas operações realizadas no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loadingAtividades ? (
                <div className="text-center py-4">Carregando atividades...</div>
              ) : atividades && atividades.length > 0 ? (
                atividades.map((atividade) => (
                  <div key={atividade.id} className="flex items-center space-x-4">
                    <div className={`w-2 h-2 ${atividade.cor} rounded-full`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{atividade.descricao}</p>
                      <p className="text-xs text-muted-foreground">{atividade.tempo}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  Nenhuma atividade recente encontrada
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Status do Sistema</CardTitle>
            <CardDescription>
              Monitoramento dos serviços
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loadingStatus ? (
                <div className="text-center py-4">Verificando status...</div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">SEFAZ</span>
                    <span className={`text-sm ${status?.sefaz === 'Online' ? 'text-green-600' : 'text-red-600'}`}>
                      {status?.sefaz || 'Offline'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Certificado Digital</span>
                    <span className={`text-sm ${status?.certificado === 'Válido' ? 'text-green-600' : 'text-red-600'}`}>
                      {status?.certificado || 'Inválido'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Banco de Dados</span>
                    <span className="text-sm text-green-600">
                      {status?.bancoDados || 'Conectado'}
                    </span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
