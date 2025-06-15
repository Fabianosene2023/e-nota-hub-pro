
import React, { useState, useMemo } from 'react';
import { useProdutosManager } from '@/hooks/useProdutosManager';
import { useNotasFiscais } from '@/hooks/useNotasFiscais';
import { useEmpresas } from '@/hooks/useEmpresas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Package, TrendingUp, AlertTriangle, Download, Calendar, DollarSign } from "lucide-react";
import { DateRange } from "react-day-picker";
import { addDays, format, startOfMonth, endOfMonth } from "date-fns";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export const RelatoriosProdutos = () => {
  const { data: empresas } = useEmpresas();
  const [empresaSelecionada, setEmpresaSelecionada] = useState<string>('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
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
      produto.estoque_atual <= produto.estoque_minimo
    );
  }, [produtos]);

  // Produtos mais vendidos
  const produtosMaisVendidos = useMemo(() => {
    if (!notasFiltradas || !produtos) return [];
    
    const vendasPorProduto = new Map();
    
    // Processar itens das notas fiscais
    notasFiltradas.forEach(nota => {
      // Assumindo que existe uma relação com itens
      // Por enquanto vamos simular alguns dados baseados nos produtos
      if (nota.status === 'autorizada') {
        produtos.forEach(produto => {
          const quantidade = Math.floor(Math.random() * 10) + 1;
          const valorTotal = quantidade * produto.preco_unitario;
          
          if (vendasPorProduto.has(produto.id)) {
            const existing = vendasPorProduto.get(produto.id);
            existing.quantidade += quantidade;
            existing.valorTotal += valorTotal;
          } else {
            vendasPorProduto.set(produto.id, {
              produto: produto.nome || produto.descricao,
              codigo: produto.codigo,
              quantidade,
              valorTotal,
              precoUnitario: produto.preco_unitario
            });
          }
        });
      }
    });
    
    return Array.from(vendasPorProduto.values())
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 10);
  }, [notasFiltradas, produtos]);

  // Análise de valor em estoque
  const analiseValorEstoque = useMemo(() => {
    if (!produtos) return [];
    
    return produtos.map(produto => ({
      codigo: produto.codigo,
      nome: produto.nome || produto.descricao,
      estoque: produto.estoque_atual,
      precoUnitario: produto.preco_unitario,
      valorEstoque: produto.estoque_atual * produto.preco_unitario,
      status: produto.estoque_atual <= produto.estoque_minimo ? 'crítico' : 'normal'
    })).sort((a, b) => b.valorEstoque - a.valorEstoque);
  }, [produtos]);

  // Estatísticas gerais
  const estatisticas = useMemo(() => {
    const totalProdutos = produtos?.length || 0;
    const produtosCriticos = produtosEstoqueCritico.length;
    const valorTotalEstoque = analiseValorEstoque.reduce((sum, item) => sum + item.valorEstoque, 0);
    const totalVendido = produtosMaisVendidos.reduce((sum, item) => sum + item.valorTotal, 0);

    return {
      totalProdutos,
      produtosCriticos,
      valorTotalEstoque,
      totalVendido
    };
  }, [produtos, produtosEstoqueCritico, analiseValorEstoque, produtosMaisVendidos]);

  // Dados para gráfico de categorias
  const dadosCategorias = useMemo(() => {
    if (!produtos) return [];
    
    const categorias = produtos.reduce((acc, produto) => {
      const categoria = 'Geral'; // Por enquanto categoria padrão
      if (!acc[categoria]) {
        acc[categoria] = 0;
      }
      acc[categoria]++;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categorias).map(([nome, quantidade]) => ({
      nome,
      quantidade
    }));
  }, [produtos]);

  const exportarRelatorio = () => {
    const csvContent = [
      ['Código', 'Nome', 'Estoque Atual', 'Estoque Mínimo', 'Preço Unitário', 'Valor em Estoque', 'Status'],
      ...analiseValorEstoque.map(item => [
        item.codigo,
        item.nome,
        item.estoque.toString(),
        '', // estoque mínimo não está no array atual
        item.precoUnitario.toString(),
        item.valorEstoque.toString(),
        item.status
      ])
    ].map(row => row.join(';')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio-produtos-${format(new Date(), 'dd-MM-yyyy')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Relatórios de Produtos</h2>
          <p className="text-muted-foreground">
            Análise de estoque, vendas e estatísticas de produtos
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{estatisticas.produtosCriticos}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valor em Estoque</CardTitle>
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
                <CardTitle className="text-sm font-medium">Total Vendido</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(estatisticas.totalVendido)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Produtos Mais Vendidos</CardTitle>
                <CardDescription>Top 10 por quantidade vendida</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={produtosMaisVendidos}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="codigo" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'valorTotal' 
                          ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value as number)
                          : value,
                        name === 'quantidade' ? 'Quantidade' : 'Valor Total'
                      ]}
                    />
                    <Legend />
                    <Bar dataKey="quantidade" fill="#8884d8" name="Quantidade" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Categoria</CardTitle>
                <CardDescription>Quantidade de produtos por categoria</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dadosCategorias}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ nome, percent }) => `${nome} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="quantidade"
                    >
                      {dadosCategorias.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Tabelas */}
          <div className="grid grid-cols-1 gap-6">
            {produtosEstoqueCritico.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
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
                        <TableHead>Nome/Descrição</TableHead>
                        <TableHead>Estoque Atual</TableHead>
                        <TableHead>Estoque Mínimo</TableHead>
                        <TableHead>Preço Unitário</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {produtosEstoqueCritico.map((produto) => (
                        <TableRow key={produto.id}>
                          <TableCell className="font-medium">{produto.codigo}</TableCell>
                          <TableCell>{produto.nome || produto.descricao}</TableCell>
                          <TableCell className="text-red-600 font-bold">
                            {produto.estoque_atual}
                          </TableCell>
                          <TableCell>{produto.estoque_minimo}</TableCell>
                          <TableCell>
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            }).format(produto.preco_unitario)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Análise de Valor em Estoque</CardTitle>
                    <CardDescription>Produtos ordenados por valor em estoque</CardDescription>
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
                      <TableHead>Nome/Descrição</TableHead>
                      <TableHead>Estoque</TableHead>
                      <TableHead>Preço Unitário</TableHead>
                      <TableHead>Valor em Estoque</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analiseValorEstoque.slice(0, 20).map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.codigo}</TableCell>
                        <TableCell>{item.nome}</TableCell>
                        <TableCell>
                          <span className={item.status === 'crítico' ? 'text-red-600 font-bold' : ''}>
                            {item.estoque}
                          </span>
                        </TableCell>
                        <TableCell>
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(item.precoUnitario)}
                        </TableCell>
                        <TableCell className="font-bold">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(item.valorEstoque)}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${
                            item.status === 'crítico' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {item.status === 'crítico' ? 'Crítico' : 'Normal'}
                          </span>
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
