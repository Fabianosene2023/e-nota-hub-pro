
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { Calendar } from "lucide-react";
import { DateRange } from "react-day-picker";

interface EstoqueFiltersProps {
  empresas: any[];
  empresaSelecionada: string;
  setEmpresaSelecionada: (value: string) => void;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
}

export const EstoqueFilters = ({
  empresas,
  empresaSelecionada,
  setEmpresaSelecionada,
  dateRange,
  setDateRange
}: EstoqueFiltersProps) => {
  return (
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
  );
};
