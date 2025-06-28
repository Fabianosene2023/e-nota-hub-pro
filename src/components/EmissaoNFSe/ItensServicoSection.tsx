
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useServicosManager } from '@/hooks/useServicosManager';
import { ServicoFormSection } from './components/ServicoFormSection';
import { ServicosTable } from './components/ServicosTable';

interface ItemNFSe {
  servico_id: string;
  item_nome: string;
  quantidade: number;
  valor_servico: number;
  valor_total: number;
  codigo_servico: string;
  aliquota_iss: number;
}

interface ItensServicoSectionProps {
  itens: ItemNFSe[];
  setItens: (itens: ItemNFSe[]) => void;
  empresaId: string;
  valorTotalNota: number;
}

export const ItensServicoSection = ({ itens, setItens, empresaId, valorTotalNota }: ItensServicoSectionProps) => {
  const { data: servicos } = useServicosManager(empresaId);

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
          servicos={servicos}
          onAddItem={handleAddItem}
          empresaId={empresaId}
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
