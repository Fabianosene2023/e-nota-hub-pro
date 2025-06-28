
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ServicoFormSection } from './components/ServicoFormSection';
import { ServicosTable } from './components/ServicosTable';

interface ItemNFSe {
  servico_id?: string;
  descricao: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  codigo_servico?: string;
  aliquota_iss: number;
}

interface ItensServicoSectionProps {
  itens: ItemNFSe[];
  setItens: (itens: ItemNFSe[]) => void;
  valorTotalNota: number;
}

export const ItensServicoSection = ({ itens, setItens, valorTotalNota }: ItensServicoSectionProps) => {
  const handleAddItem = (novoItem: ItemNFSe) => {
    setItens([...itens, novoItem]);
  };

  const handleRemoveItem = (index: number) => {
    setItens(itens.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Serviços da NFSe</CardTitle>
        <CardDescription>
          Adicione os serviços da nota fiscal de serviços eletrônica
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ServicoFormSection 
          onAddItem={handleAddItem}
        />

        <ServicosTable 
          itens={itens}
          valorTotalNota={valorTotalNota}
          onRemoveItem={handleRemoveItem}
        />
      </CardContent>
    </Card>
  );
};
