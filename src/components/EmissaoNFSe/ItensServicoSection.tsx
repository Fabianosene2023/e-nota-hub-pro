
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
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
  setItens: React.Dispatch<React.SetStateAction<ItemNFSe[]>>;
  valorTotalNota: number;
  prestadorId: string;
}

export const ItensServicoSection = ({ itens, setItens, valorTotalNota, prestadorId }: ItensServicoSectionProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const addItem = (item: ItemNFSe) => {
    if (editingIndex !== null) {
      const updatedItens = [...itens];
      updatedItens[editingIndex] = item;
      setItens(updatedItens);
      setEditingIndex(null);
    } else {
      setItens([...itens, item]);
    }
    setIsFormOpen(false);
  };

  const editItem = (index: number) => {
    setEditingIndex(index);
    setIsFormOpen(true);
  };

  const removeItem = (index: number) => {
    setItens(itens.filter((_, i) => i !== index));
  };

  const currentItem = editingIndex !== null ? itens[editingIndex] : undefined;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Itens de Serviço</CardTitle>
            <CardDescription>
              Adicione os serviços que serão incluídos na NFSe
            </CardDescription>
          </div>
          <Button 
            onClick={() => setIsFormOpen(true)}
            disabled={!prestadorId}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Adicionar Serviço
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!prestadorId && (
          <div className="text-center py-8 text-muted-foreground">
            Selecione uma empresa prestadora para adicionar serviços
          </div>
        )}

        {prestadorId && (
          <>
            {isFormOpen && (
              <div className="mb-6 p-4 border rounded-lg bg-muted/50">
                <ServicoFormSection
                  onAddItem={addItem}
                  onCancel={() => {
                    setIsFormOpen(false);
                    setEditingIndex(null);
                  }}
                  empresaId={prestadorId}
                  editingItem={currentItem}
                />
              </div>
            )}

            {itens.length > 0 ? (
              <>
                <ServicosTable 
                  itens={itens}
                  onEdit={editItem}
                  onRemove={removeItem}
                />
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-end">
                    <div className="text-lg font-semibold">
                      Total: R$ {valorTotalNota.toFixed(2)}
                    </div>
                  </div>
                </div>
              </>
            ) : !isFormOpen && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum serviço adicionado. Clique em "Adicionar Serviço" para começar.
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
