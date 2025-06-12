
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Plus,
  Download,
  Filter
} from "lucide-react";

export function Dashboard() {
  const stats = [
    {
      title: "Notas Emitidas (Mês)",
      value: "1,247",
      change: "+12%",
      changeType: "positive" as const,
      icon: FileText,
    },
    {
      title: "Faturamento Total",
      value: "R$ 2.847.320,45",
      change: "+8.2%",
      changeType: "positive" as const,
      icon: TrendingUp,
    },
    {
      title: "Notas Pendentes",
      value: "23",
      change: "-5%",
      changeType: "negative" as const,
      icon: Clock,
    },
    {
      title: "Taxa de Rejeição",
      value: "0.8%",
      change: "-2.1%",
      changeType: "positive" as const,
      icon: AlertTriangle,
    },
  ];

  const recentNotes = [
    {
      id: "NFe-001234",
      cliente: "Tech Solutions Ltda",
      valor: "R$ 15.430,50",
      status: "aprovada",
      data: "2024-12-12",
    },
    {
      id: "NFe-001235",
      cliente: "Inovação Digital SA",
      valor: "R$ 8.720,00",
      status: "pendente",
      data: "2024-12-12",
    },
    {
      id: "NFe-001236",
      cliente: "Consultoria Empresarial",
      valor: "R$ 3.245,80",
      status: "aprovada",
      data: "2024-12-11",
    },
    {
      id: "NFe-001237",
      cliente: "Sistemas Integrados Ltda",
      valor: "R$ 22.100,00",
      status: "rejeitada",
      data: "2024-12-11",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "aprovada":
        return <Badge className="fiscal-success">Aprovada</Badge>;
      case "pendente":
        return <Badge className="fiscal-pending">Pendente</Badge>;
      case "rejeitada":
        return <Badge className="fiscal-error">Rejeitada</Badge>;
      default:
        return <Badge className="fiscal-neutral">Desconhecido</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral do seu sistema fiscal
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Nova Nota
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <span className={`${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                } font-medium mr-1`}>
                  {stat.change}
                </span>
                em relação ao mês anterior
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Notes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Notas Fiscais Recentes</CardTitle>
              <CardDescription>
                Últimas notas emitidas no sistema
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              Ver todas
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentNotes.map((note) => (
              <div
                key={note.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{note.id}</p>
                    <p className="text-sm text-muted-foreground">{note.cliente}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">{note.valor}</p>
                    <p className="text-sm text-muted-foreground">{note.data}</p>
                  </div>
                  {getStatusBadge(note.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Emitir NF-e
            </CardTitle>
            <CardDescription>
              Criar nova Nota Fiscal Eletrônica
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Consultar Status
            </CardTitle>
            <CardDescription>
              Verificar situação das notas na SEFAZ
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-blue-600" />
              Relatórios
            </CardTitle>
            <CardDescription>
              Gerar relatórios fiscais e gerenciais
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
