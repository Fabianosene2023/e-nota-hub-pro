
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ServicoValuesFieldsProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function ServicoValuesFields({ formData, setFormData }: ServicoValuesFieldsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Valores do Serviço</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="preco">Preço Unitário *</Label>
          <Input 
            id="preco" 
            placeholder="0,00"
            type="number"
            step="0.01"
            value={formData.preco_unitario}
            onChange={(e) => setFormData({...formData, preco_unitario: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="valor_servico_prestado">Valor do Serviço Prestado</Label>
          <Input 
            id="valor_servico_prestado" 
            placeholder="0,00"
            type="number"
            step="0.01"
            value={formData.valor_servico_prestado}
            onChange={(e) => setFormData({...formData, valor_servico_prestado: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="unidade">Unidade</Label>
          <Select value={formData.unidade} onValueChange={(value) => setFormData({...formData, unidade: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a unidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UN">Unidade</SelectItem>
              <SelectItem value="HR">Hora</SelectItem>
              <SelectItem value="DIA">Dia</SelectItem>
              <SelectItem value="MES">Mês</SelectItem>
              <SelectItem value="ANO">Ano</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="aliquota">Alíquota ISS (%)</Label>
        <Input 
          id="aliquota" 
          placeholder="0,00"
          type="number"
          step="0.01"
          value={formData.aliquota_iss}
          onChange={(e) => setFormData({...formData, aliquota_iss: e.target.value})}
        />
      </div>
    </div>
  );
}
