
import * as React from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm, useFieldArray } from "react-hook-form";
import { useCteUpsert } from "@/hooks/useCte";
import { Plus, Trash } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type CteFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: any;
};

export function CteForm({ open, onOpenChange, initialData }: CteFormProps) {
  const upsert = useCteUpsert();
  const { register, handleSubmit, reset, formState: { isSubmitting }, control, watch, setValue } = useForm({
    defaultValues: initialData || {
      numero: "",
      valor_total: 0,
      natureza_operacao: "",
      items: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  React.useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        items: initialData.itens_cte || [],
      });
    } else {
      reset({ numero: "", valor_total: 0, natureza_operacao: "", items: [] });
    }
  }, [initialData, reset]);

  // Watch for changes in items to calculate total value
  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name && name.startsWith("items")) {
        const items = value.items || [];
        const total = items.reduce((acc: number, item: any) => {
          const quantity = parseFloat(item.quantidade || 0);
          const unitPrice = parseFloat(item.valor_unitario || 0);
          const itemTotal = quantity * unitPrice;
          return acc + (isNaN(itemTotal) ? 0 : itemTotal);
        }, 0);
        setValue("valor_total", parseFloat(total.toFixed(2)));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  const onSubmit = async (values: any) => {
    try {
      await upsert.mutateAsync(values);
      toast({ title: "CT-e salvo com sucesso!" });
      onOpenChange(false);
      reset();
    } catch (e) {
      toast({ title: "Erro ao salvar CT-e", variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar CT-e" : "Novo CT-e"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input type="number" placeholder="Número" {...register("numero", { required: true, valueAsNumber: true })} />
            <Input type="number" step="any" placeholder="Valor Total" {...register("valor_total", { required: true, valueAsNumber: true })} readOnly className="bg-muted/30" />
            <Input type="text" placeholder="Natureza da Operação" {...register("natureza_operacao")} />
          </div>

          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Itens do CT-e</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ descricao: "", quantidade: 1, valor_unitario: 0.00 })}
              >
                <Plus className="mr-2 h-4 w-4" /> Adicionar Item
              </Button>
            </div>
            <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2 p-2 border rounded-md">
                  <Input
                    placeholder="Descrição do item"
                    {...register(`items.${index}.descricao`, { required: true })}
                    className="flex-grow"
                  />
                  <Input
                    type="number"
                    step="any"
                    placeholder="Qtd."
                    {...register(`items.${index}.quantidade`, { valueAsNumber: true, required: true, min: 0.01 })}
                    className="w-24"
                  />
                  <Input
                    type="number"
                    step="any"
                    placeholder="Vl. Unit."
                    {...register(`items.${index}.valor_unitario`, { valueAsNumber: true, required: true, min: 0 })}
                    className="w-28"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              {fields.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                      Nenhum item adicionado.
                  </p>
              )}
            </div>
          </div>
          
          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
