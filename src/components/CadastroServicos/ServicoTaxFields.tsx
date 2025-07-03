
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ServicoTaxFieldsProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function ServicoTaxFields({ formData, setFormData }: ServicoTaxFieldsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Valor Aproximado dos Tributos</h3>
      <RadioGroup
        value={formData.opcao_tributos}
        onValueChange={(value) => setFormData({...formData, opcao_tributos: value})}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="1" id="opcao1" />
          <Label htmlFor="opcao1">Preencher os valores monetários em cada NFS-e emitida</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="2" id="opcao2" />
          <Label htmlFor="opcao2">Configurar os valores percentuais correspondentes</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="3" id="opcao3" />
          <Label htmlFor="opcao3">Não informar nenhum valor estimado para os Tributos (Decreto 8.264/2014)</Label>
        </div>
      </RadioGroup>

      {formData.opcao_tributos === "1" && (
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="valor_tributos_federais">Valor Tributos Federais (R$)</Label>
            <Input 
              id="valor_tributos_federais" 
              placeholder="0,00"
              type="number"
              step="0.01"
              value={formData.valor_tributos_federais}
              onChange={(e) => setFormData({...formData, valor_tributos_federais: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="valor_tributos_estaduais">Valor Tributos Estaduais (R$)</Label>
            <Input 
              id="valor_tributos_estaduais" 
              placeholder="0,00"
              type="number"
              step="0.01"
              value={formData.valor_tributos_estaduais}
              onChange={(e) => setFormData({...formData, valor_tributos_estaduais: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="valor_tributos_municipais">Valor Tributos Municipais (R$)</Label>
            <Input 
              id="valor_tributos_municipais" 
              placeholder="0,00"
              type="number"
              step="0.01"
              value={formData.valor_tributos_municipais}
              onChange={(e) => setFormData({...formData, valor_tributos_municipais: e.target.value})}
            />
          </div>
        </div>
      )}

      {formData.opcao_tributos === "2" && (
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="percentual_tributos_federais">Federal (%)</Label>
            <Input 
              id="percentual_tributos_federais" 
              placeholder="0,00"
              type="number"
              step="0.01"
              value={formData.percentual_tributos_federais}
              onChange={(e) => setFormData({...formData, percentual_tributos_federais: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="percentual_tributos_estaduais">Estadual (%)</Label>
            <Input 
              id="percentual_tributos_estaduais" 
              placeholder="0,00"
              type="number"
              step="0.01"
              value={formData.percentual_tributos_estaduais}
              onChange={(e) => setFormData({...formData, percentual_tributos_estaduais: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="percentual_tributos_municipais">Municipal (%)</Label>
            <Input 
              id="percentual_tributos_municipais" 
              placeholder="0,00"
              type="number"
              step="0.01"
              value={formData.percentual_tributos_municipais}
              onChange={(e) => setFormData({...formData, percentual_tributos_municipais: e.target.value})}
            />
          </div>
        </div>
      )}
    </div>
  );
}
