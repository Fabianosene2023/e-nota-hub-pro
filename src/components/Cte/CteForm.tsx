
import * as React from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useCteUpsert } from "@/hooks/useCte";

type CteFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: any;
};

export function CteForm({ open, onOpenChange, initialData }: CteFormProps) {
  const upsert = useCteUpsert();
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: initialData || {
      numero: "",
      valor_total: "",
      natureza_operacao: "",
    },
  });

  React.useEffect(() => {
    if (initialData) reset(initialData);
    else reset({ numero: "", valor_total: "", natureza_operacao: "" });
  }, [initialData, reset]);

  const onSubmit = async (values: any) => {
    try {
      await upsert.mutateAsync(values);
      onOpenChange(false);
      reset();
    } catch (e) {
      alert("Erro ao salvar CT-e");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar CT-e" : "Novo CT-e"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 pt-2">
          <Input type="number" placeholder="Número" {...register("numero", { required: true })} />
          <Input type="number" step="any" placeholder="Valor Total" {...register("valor_total", { required: true })} />
          <Input type="text" placeholder="Natureza da Operação" {...register("natureza_operacao")} />
          <div className="flex gap-2 justify-end">
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
