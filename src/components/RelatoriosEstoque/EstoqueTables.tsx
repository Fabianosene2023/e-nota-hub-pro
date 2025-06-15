
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Download } from "lucide-react";

interface EstoqueTablesProps {
  produtosEstoqueCritico: any[];
  analiseGiroEstoque: any[];
  exportarRelatorio: () => void;
  getStatusEstoque: (atual: number, minimo: number) => { status: string; color: string };
}

export const EstoqueTables = ({ 
  produtosEstoqueCritico, 
  analiseGiroEstoque, 
  exportarRelatorio, 
  getStatusEstoque 
}: EstoqueTablesProps) => {
  return (
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
  );
};
