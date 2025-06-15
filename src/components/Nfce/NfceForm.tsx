
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNfceMutation } from "@/hooks/useNfce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NfceForm({ onClose, nfce }: { onClose: () => void, nfce?: any }) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: nfce || { numero: "", valor_total: "", cliente_id: "", observacoes: "" }
  });
  const mut = useNfceMutation();

  useEffect(() => {
    reset(nfce || { numero: "", valor_total: "", cliente_id: "", observacoes: "" });
  }, [nfce]);

  const onSubmit = (dados: any) => {
    mut.mutate({ ...nfce, ...dados });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 p-4">
      <input type="hidden" {...register("id")} />
      <div>
        <label>Número</label>
        <Input {...register("numero")} required />
      </div>
      <div>
        <label>Valor total</label>
        <Input type="number" {...register("valor_total")} required />
      </div>
      <div>
        <label>Cliente ID</label>
        <Input {...register("cliente_id")} required />
        {/* Em produção, pode virar um select de clientes */}
      </div>
      <div>
        <label>Observações</label>
        <Input {...register("observacoes")} />
      </div>
      <div className="flex gap-2 mt-2">
        <Button type="submit">{nfce ? "Salvar" : "Cadastrar"} NFC-e</Button>
        <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
      </div>
    </form>
  );
}
