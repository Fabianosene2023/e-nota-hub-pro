
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useCteDesacordo } from "@/hooks/useCte";
import { toast } from "@/hooks/use-toast";

interface CteDesacordoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cteId: string | null;
}

export function CteDesacordoDialog({ open, onOpenChange, cteId }: CteDesacordoDialogProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<{ justificativa: string }>();
  const desacordoMutation = useCteDesacordo();

  React.useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = (data: { justificativa: string }) => {
    if (!cteId) return;

    desacordoMutation.mutate({
      cte_id: cteId,
      justificativa: data.justificativa,
    }, {
      onSuccess: () => {
        toast({ title: "Manifestação de Desacordo enviada com sucesso!" });
        onOpenChange(false);
      },
      onError: (error: any) => {
        toast({
          title: "Erro ao enviar desacordo",
          description: error.message || "Ocorreu um erro desconhecido.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manifestar Desacordo do CT-e</DialogTitle>
          <DialogDescription>
            Descreva o motivo do desacordo. Esta ação será registrada e, em um sistema real, enviada para a SEFAZ.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="py-4">
            <Textarea
              placeholder="Justificativa (mínimo 15 caracteres)"
              {...register("justificativa", { required: "Justificativa é obrigatória.", minLength: { value: 15, message: "A justificativa deve ter no mínimo 15 caracteres." } })}
              className={`w-full ${errors.justificativa ? "border-destructive" : ""}`}
              disabled={desacordoMutation.isPending}
            />
            {errors.justificativa && (
              <p className="text-sm text-destructive mt-1">{errors.justificativa.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)} disabled={desacordoMutation.isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={desacordoMutation.isPending}>
              {desacordoMutation.isPending ? "Enviando..." : "Confirmar Desacordo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
