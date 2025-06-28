
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useProdutosManager } from '@/hooks/useProdutosManager';
import { ProdutoFormSection } from './components/ProdutoFormSection';
import { ProdutosTable } from './components/ProdutosTable';

interface ItemNFe {
  produto_id: string;
  item_nome: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  cfop: string;
  tipo: 'produto';
}

interface ItensSectionProps {
  itens: ItemNFe[];
  setItens: (itens: ItemNFe[]) => void;
  empresaId: string;
  valorTotalNota: number;
}

export const ItensSection = ({ itens, setItens, empresaId, valorTotalNota }: ItensSectionProps) => {
  const { data: produtos } = useProdutosManager(empresaId);

  const handleAddItem = (novoItem: ItemNFe) => {
    setItens([...itens, novoItem]);
  };

  const handleRemoveItem = (index: number) => {
    setItens(itens.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Produtos da NFe</CardTitle>
        <CardDescription>
          Adicione os produtos da nota fiscal eletrônica
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ProdutoFormSection 
          produtos={produtos}
          onAddItem={handleAddItem}
          empresaId={empresaId}
        />

        <ProdutosTable 
          itens={itens}
          valorTotalNota={valorTotalNota}
          onRemoveItem={handleRemoveItem}
        />
      </CardContent>
    </Card>
  );
};
