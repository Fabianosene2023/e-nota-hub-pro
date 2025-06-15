
import React from "react";
import { useNfceList, useNfceDelete } from "@/hooks/useNfce";
import { Button } from "@/components/ui/button";
import { EmitirNfceButton } from "./EmitirNfceButton";
import { Pencil, Trash2 } from "lucide-react";

export function NfceTable({ onEdit }: { onEdit: (nfce: any) => void }) {
  const { data, isLoading } = useNfceList();
  const del = useNfceDelete();

  if (isLoading) return <div>Carregando NFC-e...</div>;
  if (!data?.length) return <div>Nenhuma NFC-e cadastrada.</div>;

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Número</th>
            <th className="p-2 text-left">Cliente</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Valor Total</th>
            <th className="p-2 text-left">Emitida em</th>
            <th className="p-2 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {data.map((nfce: any) => (
            <tr key={nfce.id}>
              <td className="p-2">{nfce.numero}</td>
              <td className="p-2">{nfce.clientes?.nome_razao_social || "-"}</td>
              <td className="p-2">{nfce.status}</td>
              <td className="p-2">{nfce.valor_total?.toLocaleString?.("pt-BR", { style: "currency", currency: "BRL" }) || "0,00"}</td>
              <td className="p-2">{nfce.data_emissao && new Date(nfce.data_emissao).toLocaleString()}</td>
              <td className="p-2 flex gap-1">
                <Button variant="outline" size="icon" onClick={() => onEdit(nfce)}>
                  <Pencil size={16} />
                </Button>
                <EmitirNfceButton nfceId={nfce.id} status={nfce.status} />
                <Button variant="destructive" size="icon" onClick={() => del.mutate(nfce.id)}>
                  <Trash2 size={16} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
