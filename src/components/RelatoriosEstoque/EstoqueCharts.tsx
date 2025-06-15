
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

interface EstoqueChartsProps {
  evolucaoEstoque: any[];
  distribuicaoPorValor: any[];
}

export const EstoqueCharts = ({ evolucaoEstoque, distribuicaoPorValor }: EstoqueChartsProps) => {
  return (
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
  );
};
