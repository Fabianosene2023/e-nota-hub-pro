
import React, { useState, useMemo } from 'react';
import { useClientesManager } from '@/hooks/useClientesManager';
import { useNotasFiscais } from '@/hooks/useNotasFiscais';
import { useEmpresas } from '@/hooks/useEmpresas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, UserCheck, MapPin, Download, Calendar, DollarSign } from "lucide-react";
import { DateRange } from "react-day-picker";
import { addDays, format, startOfMonth, endOfMonth } from "date-fns";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export const RelatoriosClientes = () => {
  const { data: empresas } = useEmpresas();
  const [empresaSelecionada, setEmpresaSelecionada] = useState<string>('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  });

  const { data: clientes } = useClientesManager(empresaSelecionada);
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

  // Análise de clientes ativos
  const clientesAtivos = useMemo(() => {
    if (!clientes || !notasFiltradas) return [];
    
    const clientesComCompras = new Set(
      notasFiltradas
        .filter(nota => nota.status === 'autorizada')
        .map(nota => nota.cliente_id)
    );
    
    return clientes.filter(cliente => clientesComCompras.has(cliente.id));
  }, [clientes, notasFiltradas]);

  // Clientes por tipo (PF/PJ)
  const clientesPorTipo = useMemo(() => {
    if (!clientes) return [];
    
    const tipos = clientes.reduce((acc, cliente) => {
      const tipo = cliente.tipo_pessoa === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica';
      if (!acc[tipo]) {
        acc[tipo] = 0;
      }
      acc[tipo]++;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(tipos).map(([tipo, quantidade]) => ({
      tipo,
      quantidade
    }));
  }, [clientes]);

  // Clientes por estado
  const clientesPorEstado = useMemo(() => {
    if (!clientes) return [];
    
    const estados = clientes.reduce((acc, cliente) => {
      const estado = cliente.estado;
      if (!acc[estado]) {
        acc[estado] = 0;
      }
      acc[estado]++;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(estados)
      .map(([estado, quantidade]) => ({ estado, quantidade }))
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 10);
  }, [clientes]);

  // Top clientes por valor de compras
  const topClientesPorValor = useMemo(() => {
    if (!clientes || !notasFiltradas) return [];
    
    const vendaPorCliente = new Map();
    
    notasFiltradas.forEach(nota => {
      if (nota.status === 'autorizada') {
        const clienteId = nota.cliente_id;
        const valor = nota.valor_total || 0;
        
        if (vendaPorCliente.has(clienteId)) {
          vendaPorCliente.set(clienteId, vendaPorCliente.get(clienteId) + valor);
        } else {
          vendaPorCliente.set(clienteId, valor);
        }
      }
    });
    
    return Array.from(vendaPorCliente.entries())
      .map(([clienteId, valorTotal]) => {
        const cliente = clientes.find(c => c.id === clienteId);
        return {
          cliente: cliente?.nome_razao_social || 'Cliente não encontrado',
          cpfCnpj: cliente?.cpf_cnpj || '',
          valorTotal,
          tipo: cliente?.tipo_pessoa === 'fisica' ? 'PF' : 'PJ'
        };
      })
      .sort((a, b) => b.valorTotal - a.valorTotal)
      .slice(0, 10);
  }, [clientes, notasFiltradas]);

  // Estatísticas gerais
  const estatisticas = useMemo(() => {
    const totalClientes = clientes?.length || 0;
    const clientesAtivosCount = clientesAtivos.length;
    const pessoasFisicas = clientes?.filter(c => c.tipo_pessoa === 'fisica').length || 0;
    const pessoasJuridicas = clientes?.filter(c => c.tipo_pessoa === 'juridica').length || 0;
    const valorTotalVendas = topClientesPorValor.reduce((sum, item) => sum + item.valorTotal, 0);

    return {
      totalClientes,
      clientesAtivosCount,
      pessoasFisicas,
      pessoasJuridicas,
      valorTotalVendas
    };
  }, [clientes, clientesAtivos, topClientesPorValor]);

  const exportarRelatorio = () => {
    const csvContent = [
      ['Nome/Razão Social', 'CPF/CNPJ', 'Tipo Pessoa', 'Cidade', 'Estado', 'Telefone', 'Email'],
      ...(clientes || []).map(cliente => [
        cliente.nome_razao_social,
        cliente.cpf_cnpj,
        cliente.tipo_pessoa === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica',
        cliente.cidade,
        cliente.estado,
        cliente.telefone || '',
        cliente.email || ''
      ])
    ].map(row => row.join(';')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio-clientes-${format(new Date(), 'dd-MM-yyyy')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCpfCnpj = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 11) {
      return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Relatórios de Clientes</h2>
          <p className="text-muted-foreground">
            Análise de clientes, vendas e estatísticas detalhadas
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
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{estatisticas.totalClientes}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
                <UserCheck className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{estatisticas.clientesAtivosCount}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pessoas Físicas</CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{estatisticas.pessoasFisicas}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pessoas Jurídicas</CardTitle>
                <Users className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{estatisticas.pessoasJuridicas}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Vendas</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(estatisticas.valorTotalVendas)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Tipo</CardTitle>
                <CardDescription>Pessoa física vs pessoa jurídica</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={clientesPorTipo}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ tipo, percent }) => `${tipo} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="quantidade"
                    >
                      {clientesPorTipo.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Estados</CardTitle>
                <CardDescription>Clientes por estado (Top 10)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={clientesPorEstado}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="estado" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="quantidade" fill="#8884d8" name="Quantidade" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Tabelas */}
          <div className="grid grid-cols-1 gap-6">
            {topClientesPorValor.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Top Clientes por Valor de Compras
                  </CardTitle>
                  <CardDescription>
                    Clientes que mais compraram no período selecionado
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Posição</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>CPF/CNPJ</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Valor Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topClientesPorValor.map((cliente, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">#{index + 1}</TableCell>
                          <TableCell>{cliente.cliente}</TableCell>
                          <TableCell>{formatCpfCnpj(cliente.cpfCnpj)}</TableCell>
                          <TableCell>
                            <Badge variant={cliente.tipo === 'PF' ? 'default' : 'secondary'}>
                              {cliente.tipo}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-bold">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            }).format(cliente.valorTotal)}
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
                    <CardTitle>Lista Completa de Clientes</CardTitle>
                    <CardDescription>Todos os clientes cadastrados na empresa</CardDescription>
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
                      <TableHead>Nome/Razão Social</TableHead>
                      <TableHead>CPF/CNPJ</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Cidade/UF</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientes?.slice(0, 20).map((cliente) => {
                      const isAtivo = clientesAtivos.some(c => c.id === cliente.id);
                      return (
                        <TableRow key={cliente.id}>
                          <TableCell className="font-medium">{cliente.nome_razao_social}</TableCell>
                          <TableCell>{formatCpfCnpj(cliente.cpf_cnpj)}</TableCell>
                          <TableCell>
                            <Badge variant={cliente.tipo_pessoa === 'fisica' ? 'default' : 'secondary'}>
                              {cliente.tipo_pessoa === 'fisica' ? 'PF' : 'PJ'}
                            </Badge>
                          </TableCell>
                          <TableCell>{cliente.cidade}/{cliente.estado}</TableCell>
                          <TableCell>{cliente.telefone || cliente.email || '-'}</TableCell>
                          <TableCell>
                            <Badge variant={isAtivo ? 'default' : 'outline'}>
                              {isAtivo ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {(!clientes || clientes.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                          Nenhum cliente cadastrado
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                {clientes && clientes.length > 20 && (
                  <div className="mt-4 text-sm text-muted-foreground text-center">
                    Mostrando primeiros 20 clientes de {clientes.length} total
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};
