import React, { useState, useMemo } from 'react';
import { useNotasFiscais } from '@/hooks/useNotasFiscais';
import { useClientesManager } from '@/hooks/useClientesManager';
import { useProdutosManager } from '@/hooks/useProdutosManager';
import { useEmpresas } from '@/hooks/useEmpresas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { FileText, TrendingUp, Users, Package, Download, Calendar } from "lucide-react";
import { DateRange } from "react-day-picker";
import { addDays, format, startOfMonth, endOfMonth } from "date-fns";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export const Relatorios = () => {
  const { data: empresas } = useEmpresas();
  const [empresaSelecionada, setEmpresaSelecionada] = useState<string>('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  });

  const { data: notas } = useNotasFiscais();
  const { data: clientes } = useClientesManager();
  const { data: produtos } = useProdutosManager();

  // Filtrar notas por empresa e período
  const notasFiltradas = useMemo(() => {
    if (!notas) return [];
    
    let filtradas = notas;
    
    // Filtrar por empresa se selecionada
    if (empresaSelecionada) {
      filtradas = filtradas.filter(nota => nota.empresa_id === empresaSelecionada);
    }
    
    // Filtrar por período
    if (dateRange?.from && dateRange?.to) {
      filtradas = filtradas.filter(nota => {
        const dataEmissao = new Date(nota.data_emissao);
        return dataEmissao >= dateRange.from! && dataEmissao <= dateRange.to!;
      });
    }
    
    return filtradas;
  }, [notas, empresaSelecionada, dateRange]);

  // Filtrar clientes e produtos por empresa
  const clientesFiltrados = useMemo(() => {
    if (!clientes || !empresaSelecionada) return clientes || [];
    return clientes.filter(cliente => cliente.empresa_id === empresaSelecionada);
  }, [clientes, empresaSelecionada]);

  const produtosFiltrados = useMemo(() => {
    if (!produtos || !empresaSelecionada) return produtos || [];
    return produtos.filter(produto => produto.empresa_id === empresaSelecionada);
  }, [produtos, empresaSelecionada]);

  // Dados para gráficos
  const dadosVendas = useMemo(() => {
    if (!notasFiltradas.length) return [];
    
    const vendasPorMes = notasFiltradas.reduce((acc, nota) => {
      const mes = format(new Date(nota.data_emissao), 'MM/yyyy');
      if (!acc[mes]) {
        acc[mes] = { mes, valor: 0, quantidade: 0 };
      }
      acc[mes].valor += nota.valor_total;
      acc[mes].quantidade += 1;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(vendasPorMes);
  }, [notasFiltradas]);

  const dadosStatus = useMemo(() => {
    if (!notasFiltradas.length) return [];
    
    const statusCount = notasFiltradas.reduce((acc, nota) => {
      if (!acc[nota.status]) {
        acc[nota.status] = 0;
      }
      acc[nota.status]++;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCount).map(([status, count]) => ({
      name: status,
      value: count
    }));
  }, [notasFiltradas]);

  const dadosClientes = useMemo(() => {
    if (!notasFiltradas.length || !clientesFiltrados) return [];
    
    const vendasPorCliente = notasFiltradas.reduce((acc, nota) => {
      const cliente = clientesFiltrados.find(c => c.id === nota.cliente_id);
      const nomeCliente = cliente?.nome_razao_social || 'Cliente não encontrado';
      
      if (!acc[nomeCliente]) {
        acc[nomeCliente] = 0;
      }
      acc[nomeCliente] += nota.valor_total;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(vendasPorCliente)
      .map(([cliente, valor]) => ({ cliente, valor }))
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 10);
  }, [notasFiltradas, clientesFiltrados]);

  // Estatísticas gerais
  const estatisticas = useMemo(() => {
    const totalVendas = notasFiltradas.reduce((sum, nota) => sum + nota.valor_total, 0);
    const totalNotas = notasFiltradas.length;
    const ticketMedio = totalNotas > 0 ? totalVendas / totalNotas : 0;
    const notasAutorizadas = notasFiltradas.filter(n => n.status === 'autorizada').length;

    return {
      totalVendas,
      totalNotas,
      ticketMedio,
      notasAutorizadas,
      totalClientes: clientesFiltrados?.length || 0,
      totalProdutos: produtosFiltrados?.length || 0
    };
  }, [notasFiltradas, clientesFiltrados, produtosFiltrados]);

  const exportarRelatorio = () => {
    const csvContent = [
      ['Nota', 'Cliente', 'Data', 'Valor', 'Status'],
      ...notasFiltradas.map(nota => {
        const cliente = clientesFiltrados?.find(c => c.id === nota.cliente_id);
        return [
          nota.numero.toString(),
          cliente?.nome_razao_social || '',
          format(new Date(nota.data_emissao), 'dd/MM/yyyy'),
          nota.valor_total.toString(),
          nota.status
        ];
      })
    ].map(row => row.join(';')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio-vendas-${format(new Date(), 'dd-MM-yyyy')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Relatórios</h2>
          <p className="text-muted-foreground">
            Análise de vendas, produtos e clientes
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
              Período
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
                <CardTitle className="text-sm font-medium">Total Vendas</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(estatisticas.totalVendas)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">NFe Emitidas</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{estatisticas.totalNotas}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(estatisticas.ticketMedio)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Autorizadas</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{estatisticas.notasAutorizadas}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clientes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{estatisticas.totalClientes}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Produtos</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{estatisticas.totalProdutos}</div>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Vendas por Mês</CardTitle>
                <CardDescription>Evolução das vendas no período</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dadosVendas}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'valor' 
                          ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value as number)
                          : value,
                        name === 'valor' ? 'Valor' : 'Quantidade'
                      ]}
                    />
                    <Legend />
                    <Bar dataKey="valor" fill="#8884d8" name="Valor" />
                    <Bar dataKey="quantidade" fill="#82ca9d" name="Quantidade" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status das Notas</CardTitle>
                <CardDescription>Distribuição por status</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dadosStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {dadosStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Top 10 Clientes</CardTitle>
                    <CardDescription>Clientes com maior volume de vendas</CardDescription>
                  </div>
                  <Button onClick={exportarRelatorio} className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Exportar CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={dadosClientes} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="cliente" type="category" width={150} />
                    <Tooltip 
                      formatter={(value) => [
                        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value as number),
                        'Valor'
                      ]}
                    />
                    <Bar dataKey="valor" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};
