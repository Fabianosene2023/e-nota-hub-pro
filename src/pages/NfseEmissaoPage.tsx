
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

export default function NfseEmissaoPage() {
  const [form, setForm] = useState({
    tomador: "",
    descricao: "",
    valor: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      toast({ title: "NFSe emitida com sucesso!", description: "Uma nota fiscal de serviço foi emitida (simulado)." });
      setForm({ tomador: "", descricao: "", valor: "" });
    }, 800);
  };

  return (
    <div className="max-w-xl mx-auto mt-8 bg-background rounded shadow px-6 py-6">
      <h1 className="text-2xl font-bold mb-4">Emissão de NFSe</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Tomador do serviço</label>
          <Input
            name="tomador"
            value={form.tomador}
            onChange={handleChange}
            required
            placeholder="Nome do tomador"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Descrição do serviço</label>
          <Textarea
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            required
            placeholder="Descrição detalhada"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Valor (R$)</label>
          <Input
            name="valor"
            value={form.valor}
            onChange={handleChange}
            required
            placeholder="0,00"
            type="number"
            min="0"
            step="0.01"
          />
        </div>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Emitindo..." : "Emitir NFSe"}
        </Button>
      </form>
    </div>
  );
}
