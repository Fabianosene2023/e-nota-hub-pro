
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNotasFiscais } from "@/hooks/useNotasFiscais";
import { useProdutos } from "@/hooks/useProdutos";
import { useContatos } from "@/hooks/useContatos";
import { useEmpresas } from "@/hooks/useEmpresas";
import { useTestarConexaoSefaz } from "@/hooks/useConfiguracoesSefaz";
import { toast } from "@/hooks/use-toast";
import {
  FileText,
  Package,
  Users,
  AlertTriangle,
  Plus,
  TrendingUp,
  Activity,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export const Dashboard = () => {
  const { data: notasFiscais } = useNotasFiscais();
  const { data: produtos } = useProdutos();
  const { data: clientes } = useContatos('cliente');
  const { data: empresas } = useEmpresas();

  // Botão de testar conexão SEFAZ
  const [showEmpresaSelect, setShowEmpresaSelect] = useState(false);
  const [empresaIdTeste, setEmpresaIdTeste] = useState<string | undefined>(undefined);

  const { mutate: testarConexao, isPending: isTesting } = useTestarConexaoSefaz();

  // Lógica do botão e select
  const onClickTestConnection = () => {
    if (!empresas) {
      toast({
        title: "Atenção",
        description: "Nenhuma empresa encontrada",
        variant: "destructive",
      });
      return;
    }
    if (empresas.length === 1) {
      testarConexao(empresas[0].id);
    } else {
      setShowEmpresaSelect(true);
    }
  };

  const handleSelectEmpresa = (empresaId: string) => {
    setEmpresaIdTeste(empresaId);
    setShowEmpresaSelect(false);
    testarConexao(empresaId);
  };

  // Calcular estatísticas
  const totalNFsDoMes = notasFiscais?.filter(nf => {
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();
    const dataNF = new Date(nf.data_emissao);
    return dataNF.getMonth() === mesAtual && dataNF.getFullYear() === anoAtual;
  }).length || 0;

  const valorTotalMes = notasFiscais?.filter(nf => {
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();
    const dataNF = new Date(nf.data_emissao);
    return dataNF.getMonth() === mesAtual && dataNF.getFullYear() === anoAtual;
  }).reduce((total, nf) => total + Number(nf.valor_total), 0) || 0;

  const produtosEstoqueBaixo = produtos?.filter(p =>
    (p.estoque_atual || 0) <= (p.estoque_minimo || 0)
  ) || [];

  const estatisticas = [
    {
      title: "NFs do Mês",
      value: totalNFsDoMes.toString(),
      description: "Notas fiscais emitidas",
      icon: FileText,
      color: "text-blue-600"
    },
    {
      title: "Valor Total",
      value: `R$ ${valorTotalMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      description: "Faturamento do mês",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Produtos",
      value: produtos?.length.toString() || "0",
      description: "Produtos cadastrados",
      icon: Package,
      color: "text-purple-600"
    },
    {
      title: "Clientes",
      value: clientes?.length.toString() || "0",
      description: "Clientes cadastrados",
      icon: Users,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Visão geral do sistema fiscal
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/notas/nfe">
              <Plus className="mr-2 h-4 w-4" />
              Nova NFe
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/produtos/lista">
              <Package className="mr-2 h-4 w-4" />
              Novo Produto
            </Link>
          </Button>
        </div>
      </div>

      {/* Botão de Testar Conexão SEFAZ */}
      <div>
        <Button
          variant="secondary"
          size="sm"
          className="mb-2"
          onClick={onClickTestConnection}
          disabled={isTesting}
        >
          <Activity className="h-4 w-4 mr-2" />
          {isTesting ? "Testando conexão..." : "Testar Conexão SEFAZ"}
        </Button>
        {showEmpresaSelect && empresas && empresas.length > 1 && (
          <div className="mt-2 max-w-xs">
            <Select onValueChange={handleSelectEmpresa}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a empresa" />
              </SelectTrigger>
              <SelectContent>
                {empresas.map((empresa) => (
                  <SelectItem key={empresa.id} value={empresa.id}>
                    {empresa.nome_fantasia || empresa.razao_social}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {estatisticas.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alertas de Estoque Baixo */}
      {produtosEstoqueBaixo.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Alertas de Estoque
            </CardTitle>
            <CardDescription>
              Produtos com estoque baixo que precisam de atenção
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {produtosEstoqueBaixo.slice(0, 5).map((produto) => (
                <div key={produto.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium">{produto.nome || produto.descricao}</p>
                    <p className="text-sm text-muted-foreground">
                      Código: {produto.codigo}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="destructive">
                      Estoque: {produto.estoque_atual || 0}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      Mín: {produto.estoque_minimo || 0}
                    </p>
                  </div>
                </div>
              ))}
              {produtosEstoqueBaixo.length > 5 && (
                <p className="text-sm text-muted-foreground text-center pt-2">
                  E mais {produtosEstoqueBaixo.length - 5} produtos...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notas Fiscais Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Notas Fiscais Recentes</CardTitle>
          <CardDescription>
            Últimas notas fiscais emitidas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {notasFiscais?.slice(0, 5).map((nf) => (
              <div key={nf.id} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <p className="font-medium">NF-e Nº {nf.numero}</p>
                  <p className="text-sm text-muted-foreground">
                    {nf.clientes?.nome_razao_social || 'Cliente não encontrado'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">
                    R$ {Number(nf.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <Badge variant={nf.status === 'autorizada' ? 'default' : 'secondary'}>
                    {nf.status}
                  </Badge>
                </div>
              </div>
            )) || (
              <p className="text-muted-foreground text-center py-4">
                Nenhuma nota fiscal encontrada
              </p>
            )}
          </div>
          {notasFiscais && notasFiscais.length > 5 && (
            <div className="pt-4">
              <Button variant="outline" className="w-full" asChild>
                <Link to="/notas">Ver todas as notas fiscais</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
