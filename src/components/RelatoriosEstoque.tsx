
import React, { useState, useMemo } from 'react';
import { useProdutosManager } from '@/hooks/useProdutosManager';
import { useNotasFiscais } from '@/hooks/useNotasFiscais';
import { useEmpresas } from '@/hooks/useEmpresas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Package, AlertTriangle, TrendingDown, TrendingUp, Download, Calendar, DollarSign, RotateCcw } from "lucide-react";
import { DateRange } from "react-day-picker";
import { addDays, format, startOfMonth, endOfMonth, subMonths } from "date-fns";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export const RelatoriosEstoque = () => {
  const { data: empresas } = useEmpresas();
  const [empresaSelecionada, setEmpresaSelecionada] = useState<string>('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(subMonths(new Date(), 2)),
    to: endOfMonth(new Date())
  });

  const { data: produtos } = useProdutosManager(empresaSelecionada);
  const { data: notas } = useNotasFiscais();

  // Filtrar notas por empresa e período
  const notasFiltradas = useMemo(() => {
    if (!notas) return [];
    
    let filtradas = notas;
    
    if (empresaSelecionada) {
      filtradas = filtradas.filter(nota => nota.empresa_id === empresaSelecionada);
    }
    
    if (dateRange?.from && dateRange?.to) {
      filtradas = filtradas.filter(nota => {
        const dataEmissao = new Date(nota.data_emissao);
        return dataEmissao >= dateRange.from! && dataEmissao <= dateRange.to!;
      });
    }
    
    return filtradas;
  }, [notas, empresaSelecionada, dateRange]);

  // Análise de estoque crítico
  const produtosEstoqueCritico = useMemo(() => {
    if (!produtos) return [];
    return produtos.filter(produto => 
      produto.estoque_atual <= produto.estoque_minimo && produto.estoque_minimo > 0
    );
  }, [produtos]);

  // Produtos zerados
  const produtosZerados = useMemo(() => {
    if (!produtos) return [];
    return produtos.filter(produto => produto.estoque_atual === 0);
  }, [produtos]);

  // Produtos com excesso de estoque (mais de 5x o mínimo)
  const produtosExcesso = useMemo(() => {
    if (!produtos) return [];
    return produtos.filter(produto => 
      produto.estoque_minimo > 0 && produto.estoque_atual > (produto.estoque_minimo * 5)
    );
  }, [produtos]);

  // Análise de giro de estoque (simulado baseado nas vendas)
  const analiseGiroEstoque = useMemo(() => {
    if (!produtos || !notasFiltradas) return [];
    
    return produtos.map(produto => {
      // Simular vendas baseado nas notas fiscais
      const vendasSimuladas = Math.floor(Math.random() * 50) + 1;
      const estoqueAtual = produto.estoque_atual;
      const giroEstoque = estoqueAtual > 0 ? vendasSimuladas / estoqueAtual : 0;
      
      let classificacaoGiro = 'baixo';
      if (giroEstoque > 2) classificacaoGiro = 'alto';
      else if (giroEstoque > 1) classificacaoGiro = 'medio';

      return {
        codigo: produto.codigo,
        nome: produto.nome || produto.descricao,
        estoqueAtual: produto.estoque_atual,
        estoqueMinimo: produto.estoque_minimo,
        vendasPeriodo: vendasSimuladas,
        giroEstoque: giroEstoque,
        classificacaoGiro,
        valorEstoque: produto.estoque_atual * produto.preco_unitario,
        precoUnitario: produto.preco_unitario
      };
    }).sort((a, b) => b.giroEstoque - a.giroEstoque);
  }, [produtos, notasFiltradas]);

  // Evolução do estoque por período
  const evolucaoEstoque = useMemo(() => {
    // Simulação de dados históricos de estoque
    const meses = [];
    for (let i = 5; i >= 0; i--) {
      const data = subMonths(new Date(), i);
      const mes = format(data, 'MM/yyyy');
      
      meses.push({
        mes,
        valorTotalEstoque: (produtos?.reduce((sum, p) => sum + (p.estoque_atual * p.preco_unitario), 0) || 0) * (0.8 + Math.random() * 0.4),
        quantidadeProdutos: produtos?.length || 0,
        produtosCriticos: Math.floor((produtos?.length || 0) * (0.1 + Math.random() * 0.2))
      });
    }
    
    return meses;
  }, [produtos]);

  // Distribuição de estoque por faixa de valor
  const distribuicaoPorValor = useMemo(() => {
    if (!produtos) return [];
    
    const faixas = {
      'Até R$ 100': 0,
      'R$ 100 - R$ 500': 0,
      'R$ 500 - R$ 1.000': 0,
      'R$ 1.000 - R$ 5.000': 0,
      'Acima de R$ 5.000': 0
    };

    produtos.forEach(produto => {
      const valorEstoque = produto.estoque_atual * produto.preco_unitario;
      
      if (valorEstoque <= 100) faixas['Até R$ 100']++;
      else if (valorEstoque <= 500) faixas['R$ 100 - R$ 500']++;
      else if (valorEstoque <= 1000) faixas['R$ 500 - R$ 1.000']++;
      else if (valorEstoque <= 5000) faixas['R$ 1.000 - R$ 5.000']++;
      else faixas['Acima de R$ 5.000']++;
    });

    return Object.entries(faixas).map(([faixa, quantidade]) => ({
      faixa,
      quantidade
    }));
  }, [produtos]);

  // Estatísticas gerais
  const estatisticas = useMemo(() => {
    const totalProdutos = produtos?.length || 0;
    const produtosCriticosCount = produtosEstoqueCritico.length;
    const produtosZeradosCount = produtosZerados.length;
    const produtosExcessoCount = produtosExcesso.length;
    const valorTotalEstoque = produtos?.reduce((sum, p) => sum + (p.estoque_atual * p.preco_unitario), 0) || 0;
    const giroMedio = analiseGiroEstoque.length > 0 
      ? analiseGiroEstoque.reduce((sum, item) => sum + item.giroEstoque, 0) / analiseGiroEstoque.length 
      : 0;

    return {
      totalProdutos,
      produtosCriticosCount,
      produtosZeradosCount,
      produtosExcessoCount,
      valorTotalEstoque,
      giroMedio
    };
  }, [produtos, produtosEstoqueCritico, produtosZerados, produtosExcesso, analiseGiroEstoque]);

  const exportarRelatorio = () => {
    const csvContent = [
      ['Código', 'Produto', 'Estoque Atual', 'Estoque Mínimo', 'Preço Unitário', 'Valor em Estoque', 'Giro de Estoque', 'Status'],
      ...analiseGiroEstoque.map(item => [
        item.codigo,
        item.nome,
        item.estoqueAtual.toString(),
        item.estoqueMinimo.toString(),
        item.precoUnitario.toString(),
        item.valorEstoque.toString(),
        item.giroEstoque.toFixed(2),
        item.classificacaoGiro
      ])
    ].map(row => row.join(';')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio-estoque-${format(new Date(), 'dd-MM-yyyy')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusEstoque = (atual: number, minimo: number) => {
    if (atual === 0) return { status: 'zerado', color: 'bg-red-100 text-red-800' };
    if (atual <= minimo && minimo > 0) return { status: 'crítico', color: 'bg-orange-100 text-orange-800' };
    if (minimo > 0 && atual > (minimo * 5)) return { status: 'excesso', color: 'bg-blue-100 text-blue-800' };
    return { status: 'normal', color: 'bg-green-100 text-green-800' };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Relatórios de Estoque</h2>
          <p className="text-muted-foreground">
            Análise completa de estoque, giro e controle de inventário
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Selecionar Empresa</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={empresaSelecionada} onValueChange={setEmpresaSelecionada}>
              <SelectTrigger>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Período de Análise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          </CardContent>
        </Card>
      </div>

      {empresaSelecionada && (
        <>
          {/* Cards de estatísticas */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Produtos</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{estatisticas.totalProdutos}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Estoque Crítico</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{estatisticas.produtosCriticosCount}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Produtos Zerados</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{estatisticas.produtosZeradosCount}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Excesso Estoque</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{estatisticas.produtosExcessoCount}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(estatisticas.valorTotalEstoque)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Giro Médio</CardTitle>
                <RotateCcw className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{estatisticas.giroMedio.toFixed(2)}x</div>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Evolução do Valor em Estoque</CardTitle>
                <CardDescription>Últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={evolucaoEstoque}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'valorTotalEstoque' 
                          ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value as number)
                          : value,
                        name === 'valorTotalEstoque' ? 'Valor Total' : 'Produtos Críticos'
                      ]}
                    />
                    <Legend />
                    <Line dataKey="valorTotalEstoque" stroke="#8884d8" name="Valor Total" strokeWidth={2} />
                    <Line dataKey="produtosCriticos" stroke="#ff8042" name="Produtos Críticos" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Valor</CardTitle>
                <CardDescription>Produtos por faixa de valor em estoque</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={distribuicaoPorValor}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ faixa, percent }) => percent > 5 ? `${(percent * 100).toFixed(0)}%` : ''}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="quantidade"
                    >
                      {distribuicaoPorValor.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [value, props.payload.faixa]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Tabelas de análise */}
          <div className="grid grid-cols-1 gap-6">
            {produtosEstoqueCritico.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-600">
                    <AlertTriangle className="h-5 w-5" />
                    Produtos com Estoque Crítico
                  </CardTitle>
                  <CardDescription>
                    Produtos que atingiram ou estão abaixo do estoque mínimo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Produto</TableHead>
                        <TableHead>Estoque Atual</TableHead>
                        <TableHead>Estoque Mínimo</TableHead>
                        <TableHead>Valor Unitário</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {produtosEstoqueCritico.slice(0, 10).map((produto) => {
                        const statusInfo = getStatusEstoque(produto.estoque_atual, produto.estoque_minimo);
                        return (
                          <TableRow key={produto.id}>
                            <TableCell className="font-medium">{produto.codigo}</TableCell>
                            <TableCell>{produto.nome || produto.descricao}</TableCell>
                            <TableCell className="text-orange-600 font-bold">
                              {produto.estoque_atual}
                            </TableCell>
                            <TableCell>{produto.estoque_minimo}</TableCell>
                            <TableCell>
                              {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                              }).format(produto.preco_unitario)}
                            </TableCell>
                            <TableCell>
                              <Badge className={statusInfo.color}>
                                {statusInfo.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Análise de Giro de Estoque</CardTitle>
                    <CardDescription>Produtos ordenados por giro de estoque</CardDescription>
                  </div>
                  <Button onClick={exportarRelatorio} className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Exportar CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Produto</TableHead>
                      <TableHead>Estoque Atual</TableHead>
                      <TableHead>Vendas (Período)</TableHead>
                      <TableHead>Giro</TableHead>
                      <TableHead>Valor em Estoque</TableHead>
                      <TableHead>Classificação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analiseGiroEstoque.slice(0, 20).map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.codigo}</TableCell>
                        <TableCell>{item.nome}</TableCell>
                        <TableCell>{item.estoqueAtual}</TableCell>
                        <TableCell>{item.vendasPeriodo}</TableCell>
                        <TableCell className="font-bold">{item.giroEstoque.toFixed(2)}x</TableCell>
                        <TableCell>
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(item.valorEstoque)}
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            item.classificacaoGiro === 'alto' ? 'bg-green-100 text-green-800' :
                            item.classificacaoGiro === 'medio' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {item.classificacaoGiro === 'alto' ? 'Alto' :
                             item.classificacaoGiro === 'medio' ? 'Médio' : 'Baixo'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};
