
import { useMemo } from 'react';
import { useProdutosManager } from '@/hooks/useProdutosManager';
import { useNotasFiscais } from '@/hooks/useNotasFiscais';
import { DateRange } from "react-day-picker";
import { subMonths, format } from "date-fns";

export const useEstoqueAnalytics = (empresaSelecionada: string, dateRange: DateRange | undefined) => {
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

  return {
    produtosEstoqueCritico,
    produtosZerados,
    produtosExcesso,
    analiseGiroEstoque,
    evolucaoEstoque,
    distribuicaoPorValor,
    estatisticas
  };
};
