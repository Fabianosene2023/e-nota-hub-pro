
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Listagem de NFCe
export function useNfceList() {
  return useQuery({
    queryKey: ["nfce"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nfce")
        .select(`
          *,
          clientes:cliente_id (nome_razao_social, cpf_cnpj),
          empresa:empresa_id (razao_social)
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

// Inserção/edição de NFCe
export function useNfceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dados: any) => {
      if (dados.id) {
        // update
        const { error } = await supabase.from("nfce").update(dados).eq("id", dados.id);
        if (error) throw error;
        return { update: true };
      } else {
        // insert
        const { error } = await supabase.from("nfce").insert([dados]);
        if (error) throw error;
        return { created: true };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nfce"] });
      toast({ title: "Sucesso!", description: "Nota NFC-e salva.", variant: "default" });
    },
    onError: (error: any) => {
      toast({ title: "Erro", description: error.message || "Falha ao salvar NFCe", variant: "destructive" });
    }
  });
}

// Deleção NFCe
export function useNfceDelete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("nfce").delete().eq("id", id);
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nfce"] });
      toast({ title: "NFC-e excluída", variant: "default" });
    },
    onError: (error: any) => {
      toast({ title: "Erro ao excluir NFC-e", description: error.message, variant: "destructive" });
    },
  });
}

// Emissão NFCe (simulação)
export function useNfceEmitir() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (nfceId: string) => {
      // Atualiza status e data_autorizacao simulada
      const { error } = await supabase
        .from("nfce")
        .update({
          status: "autorizada",
          data_autorizacao: new Date().toISOString(),
        })
        .eq("id", nfceId);
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nfce"] });
      toast({ title: "NFC-e emitida (simulação)", description: "Status atualizado com sucesso." });
    },
    onError: (error: any) => {
      toast({ title: "Erro de emissão", description: error.message, variant: "destructive" });
    }
  });
}
