
import React, { useState } from 'react';
import { useEmpresas } from '@/hooks/useEmpresas';
import { useEstoqueAnalytics } from '@/hooks/useEstoqueAnalytics';
import { EstoqueFilters } from '@/components/RelatoriosEstoque/EstoqueFilters';
import { EstoqueStats } from '@/components/RelatoriosEstoque/EstoqueStats';
import { EstoqueCharts } from '@/components/RelatoriosEstoque/EstoqueCharts';
import { EstoqueTables } from '@/components/RelatoriosEstoque/EstoqueTables';
import { DateRange } from "react-day-picker";
import { addDays, format, startOfMonth, endOfMonth, subMonths } from "date-fns";

export const RelatoriosEstoque = () => {
  const { data: empresas } = useEmpresas();
  const [empresaSelecionada, setEmpresaSelecionada] = useState<string>('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(subMonths(new Date(), 2)),
    to: endOfMonth(new Date())
  });

  const {
    produtosEstoqueCritico,
    analiseGiroEstoque,
    evolucaoEstoque,
    distribuicaoPorValor,
    estatisticas
  } = useEstoqueAnalytics(empresaSelecionada, dateRange);

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

      <EstoqueFilters
        empresas={empresas || []}
        empresaSelecionada={empresaSelecionada}
        setEmpresaSelecionada={setEmpresaSelecionada}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />

      {empresaSelecionada && (
        <>
          <EstoqueStats estatisticas={estatisticas} />
          <EstoqueCharts 
            evolucaoEstoque={evolucaoEstoque} 
            distribuicaoPorValor={distribuicaoPorValor} 
          />
          <EstoqueTables
            produtosEstoqueCritico={produtosEstoqueCritico}
            analiseGiroEstoque={analiseGiroEstoque}
            exportarRelatorio={exportarRelatorio}
            getStatusEstoque={getStatusEstoque}
          />
        </>
      )}
    </div>
  );
};
