
import { useEmpresas } from '@/hooks/useEmpresas';
import { useClientes } from '@/hooks/useClientes';
import { useNotasFiscais } from '@/hooks/useNotasFiscais';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, Users, FileText, TrendingUp, Loader2 } from "lucide-react";

export const Dashboard = () => {
  const { data: empresas, isLoading: loadingEmpresas } = useEmpresas();
  const { data: clientes, isLoading: loadingClientes } = useClientes();
  const { data: notasFiscais, isLoading: loadingNotas } = useNotasFiscais();

  if (loadingEmpresas || loadingClientes || loadingNotas) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const totalEmpresas = empresas?.length || 0;
  const totalClientes = clientes?.length || 0;
  const totalNotasFiscais = notasFiscais?.length || 0;
  const valorTotalNotas = notasFiscais?.reduce((acc, nota) => acc + Number(nota.valor_total), 0) || 0;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button>Baixar Relatório</Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empresas</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmpresas}</div>
            <p className="text-xs text-muted-foreground">
              Total de empresas cadastradas
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClientes}</div>
            <p className="text-xs text-muted-foreground">
              Total de clientes cadastrados
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notas Fiscais</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalNotasFiscais}</div>
            <p className="text-xs text-muted-foreground">
              Notas fiscais emitidas
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {valorTotalNotas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Valor total das notas fiscais
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Empresas Cadastradas</CardTitle>
            <CardDescription>Lista das empresas ativas no sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {empresas?.map((empresa) => (
              <div key={empresa.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">{empresa.nome_fantasia || empresa.razao_social}</h3>
                  <p className="text-sm text-muted-foreground">CNPJ: {empresa.cnpj}</p>
                  <p className="text-sm text-muted-foreground">{empresa.cidade} - {empresa.estado}</p>
                </div>
                <Badge variant={empresa.ambiente_sefaz === 'producao' ? 'default' : 'secondary'}>
                  {empresa.ambiente_sefaz === 'producao' ? 'Produção' : 'Homologação'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Últimas Notas Fiscais</CardTitle>
            <CardDescription>Notas fiscais emitidas recentemente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {notasFiscais?.slice(0, 5).map((nota) => (
              <div key={nota.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">NFe #{nota.numero}</p>
                  <p className="text-sm text-muted-foreground">
                    {nota.clientes?.nome_razao_social}
                  </p>
                  <p className="text-sm font-semibold text-green-600">
                    R$ {Number(nota.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <Badge 
                  variant={
                    nota.status === 'autorizada' ? 'default' : 
                    nota.status === 'rascunho' ? 'secondary' : 'destructive'
                  }
                >
                  {nota.status.charAt(0).toUpperCase() + nota.status.slice(1)}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
