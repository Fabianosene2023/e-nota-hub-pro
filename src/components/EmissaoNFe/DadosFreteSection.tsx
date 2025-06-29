
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTransportadoras } from "@/hooks/useTransportadoras";

interface DadosFreteSectionProps {
  freightMode: string;
  setFreightMode: (mode: string) => void;
  freightValue: string;
  setFreightValue: (value: string) => void;
  insuranceValue: string;
  setInsuranceValue: (value: string) => void;
  volumeQuantity: string;
  setVolumeQuantity: (quantity: string) => void;
  weightGross: string;
  setWeightGross: (weight: string) => void;
  weightNet: string;
  setWeightNet: (weight: string) => void;
  transporterId: string;
  setTransporterId: (id: string) => void;
}

export const DadosFreteSection = ({
  freightMode,
  setFreightMode,
  freightValue,
  setFreightValue,
  insuranceValue,
  setInsuranceValue,
  volumeQuantity,
  setVolumeQuantity,
  weightGross,
  setWeightGross,
  weightNet,
  setWeightNet,
  transporterId,
  setTransporterId,
}: DadosFreteSectionProps) => {
  const { data: transportadoras } = useTransportadoras();

  const freightModeOptions = [
    { value: "0", label: "0 - Contratação do Frete por conta do Remetente (CIF)" },
    { value: "1", label: "1 - Contratação do Frete por conta do Destinatário (FOB)" },
    { value: "2", label: "2 - Contratação do Frete por conta de Terceiros" },
    { value: "3", label: "3 - Transporte Próprio por conta do Remetente" },
    { value: "4", label: "4 - Transporte Próprio por conta do Destinatário" },
    { value: "9", label: "9 - Sem Ocorrência de Transporte" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados de Frete e Transporte</CardTitle>
        <CardDescription>
          Informações sobre transporte e frete da mercadoria conforme padrão SEFAZ
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="freight_mode">Modalidade do Frete *</Label>
            <Select value={freightMode} onValueChange={setFreightMode}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a modalidade" />
              </SelectTrigger>
              <SelectContent>
                {freightModeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {freightMode !== "9" && (
            <div>
              <Label htmlFor="transporter">Transportadora</Label>
              <Select value={transporterId} onValueChange={setTransporterId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a transportadora" />
                </SelectTrigger>
                <SelectContent>
                  {transportadoras?.map((transportadora) => (
                    <SelectItem key={transportadora.id} value={transportadora.id}>
                      {transportadora.nome_razao_social}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="freight_value">Valor do Frete (R$)</Label>
            <Input
              id="freight_value"
              type="number"
              value={freightValue}
              onChange={(e) => setFreightValue(e.target.value)}
              placeholder="0,00"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <Label htmlFor="insurance_value">Valor do Seguro (R$)</Label>
            <Input
              id="insurance_value"
              type="number"
              value={insuranceValue}
              onChange={(e) => setInsuranceValue(e.target.value)}
              placeholder="0,00"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <Label htmlFor="volume_quantity">Quantidade de Volumes</Label>
            <Input
              id="volume_quantity"
              type="number"
              value={volumeQuantity}
              onChange={(e) => setVolumeQuantity(e.target.value)}
              placeholder="1"
              min="0"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="weight_gross">Peso Bruto (Kg)</Label>
            <Input
              id="weight_gross"
              type="number"
              value={weightGross}
              onChange={(e) => setWeightGross(e.target.value)}
              placeholder="0,000"
              min="0"
              step="0.001"
            />
          </div>

          <div>
            <Label htmlFor="weight_net">Peso Líquido (Kg)</Label>
            <Input
              id="weight_net"
              type="number"
              value={weightNet}
              onChange={(e) => setWeightNet(e.target.value)}
              placeholder="0,000"
              min="0"
              step="0.001"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
