
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTransportadoras } from "@/hooks/useTransportadoras";

interface DadosFreteSectionProps {
  modalidadeFrete: string;
  setModalidadeFrete: (modalidade: string) => void;
  valorFrete: string;
  setValorFrete: (valor: string) => void;
  valorSeguro: string;
  setValorSeguro: (valor: string) => void;
  quantidadeVolumes: string;
  setQuantidadeVolumes: (quantidade: string) => void;
  pesoBruto: string;
  setPesoBruto: (peso: string) => void;
  pesoLiquido: string;
  setPesoLiquido: (peso: string) => void;
  transportadoraId: string;
  setTransportadoraId: (id: string) => void;
}

export const DadosFreteSection = ({
  modalidadeFrete,
  setModalidadeFrete,
  valorFrete,
  setValorFrete,
  valorSeguro,
  setValorSeguro,
  quantidadeVolumes,
  setQuantidadeVolumes,
  pesoBruto,
  setPesoBruto,
  pesoLiquido,
  setPesoLiquido,
  transportadoraId,
  setTransportadoraId,
}: DadosFreteSectionProps) => {
  const { data: transportadoras } = useTransportadoras();

  const modalidadesFreteOptions = [
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
          Informações sobre o transporte e frete da mercadoria
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="modalidade-frete">Modalidade do Frete</Label>
            <Select value={modalidadeFrete} onValueChange={setModalidadeFrete}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a modalidade" />
              </SelectTrigger>
              <SelectContent>
                {modalidadesFreteOptions.map((opcao) => (
                  <SelectItem key={opcao.value} value={opcao.value}>
                    {opcao.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="transportadora">Transportadora</Label>
            <Select value={transportadoraId} onValueChange={setTransportadoraId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma transportadora" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Nenhuma</SelectItem>
                {transportadoras?.map((transportadora) => (
                  <SelectItem key={transportadora.id} value={transportadora.id}>
                    {transportadora.nome_razao_social}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="valor-frete">Valor do Frete (R$)</Label>
            <Input
              id="valor-frete"
              type="number"
              step="0.01"
              min="0"
              value={valorFrete}
              onChange={(e) => setValorFrete(e.target.value)}
              placeholder="0,00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="valor-seguro">Valor do Seguro (R$)</Label>
            <Input
              id="valor-seguro"
              type="number"
              step="0.01"
              min="0"
              value={valorSeguro}
              onChange={(e) => setValorSeguro(e.target.value)}
              placeholder="0,00"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="quantidade-volumes">Quantidade de Volumes</Label>
            <Input
              id="quantidade-volumes"
              type="number"
              min="0"
              value={quantidadeVolumes}
              onChange={(e) => setQuantidadeVolumes(e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="peso-bruto">Peso Bruto (kg)</Label>
            <Input
              id="peso-bruto"
              type="number"
              step="0.001"
              min="0"
              value={pesoBruto}
              onChange={(e) => setPesoBruto(e.target.value)}
              placeholder="0,000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="peso-liquido">Peso Líquido (kg)</Label>
            <Input
              id="peso-liquido"
              type="number"
              step="0.001"
              min="0"
              value={pesoLiquido}
              onChange={(e) => setPesoLiquido(e.target.value)}
              placeholder="0,000"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
