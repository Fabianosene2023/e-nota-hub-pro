
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
import { useForm, FieldErrors } from "react-hook-form";
import { useCteDesacordo } from "@/hooks/useCte";
import { toast } from "@/hooks/use-toast";

interface CteDesacordoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cteId: string | null;
}

type FormValues = {
  justificativa: string;
};

export function CteDesacordoDialog({ open, onOpenChange, cteId }: CteDesacordoDialogProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>();
  const desacordoMutation = useCteDesacordo();

  React.useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onInvalid = (errors: FieldErrors<FormValues>) => {
    console.error("Validation errors: ", errors);
  };

  const onSubmit = (data: FormValues) => {
    console.log("Submitting form with data:", data);
    if (!cteId) {
      console.error("CT-e ID is missing.");
      return;
    }
    console.log(`Sending disagreement for CTE ${cteId}`);

    desacordoMutation.mutate({
      cte_id: cteId,
      justificativa: data.justificativa,
    }, {
      onSuccess: () => {
        console.log("Disagreement sent successfully.");
        toast({ title: "Manifestação de Desacordo enviada com sucesso!" });
        onOpenChange(false);
      },
      onError: (error: any) => {
        console.error("Error sending disagreement:", error);
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
        {/* The <form> element is removed to avoid conflicts with the Dialog. Submission is now handled by the button's onClick. */}
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
          <Button type="button" onClick={handleSubmit(onSubmit, onInvalid)} disabled={desacordoMutation.isPending}>
            {desacordoMutation.isPending ? "Enviando..." : "Confirmar Desacordo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
