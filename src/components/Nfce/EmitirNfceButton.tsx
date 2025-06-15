
import React from "react";
import { Button } from "@/components/ui/button";
import { useNfceEmitir } from "@/hooks/useNfce";
import { PlayCircle } from "lucide-react";

export function EmitirNfceButton({ nfceId, status }: { nfceId: string; status: string }) {
  const emitir = useNfceEmitir();

  // Mudando de isLoading para isPending (React Query v5)
  if (status === "autorizada") {
    return (
      <Button disabled variant="secondary" className="text-green-700 border-green-600">
        Já Emitida
      </Button>
    );
  }

  return (
    <Button variant="default" onClick={() => emitir.mutate(nfceId)} disabled={emitir.isPending}>
      <PlayCircle className="mr-1" size={18} /> {emitir.isPending ? "Emitindo..." : "Emitir"}
    </Button>
  );
}
