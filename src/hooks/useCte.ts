import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { emitirCte } from "@/utils/cteSefazSimulator";

export function useCtes() {
  return useQuery({
    queryKey: ["ctes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cte")
        .select("*, itens_cte(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
}

// For create/update (upsert)
export function useCteUpsert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: any) => {
      const { items, ...cteData } = values;

      // Upsert the CTE record
      const { data: savedCte, error: cteError } = await supabase
        .from("cte")
        .upsert([cteData])
        .select()
        .single();
      
      if (cteError) throw cteError;

      const cteId = savedCte.id;

      // Delete old items for this CTE to handle updates/removals
      const { error: deleteError } = await supabase
        .from("itens_cte")
        .delete()
        .eq("cte_id", cteId);

      if (deleteError) throw deleteError;

      // Insert new items if there are any
      if (items && items.length > 0) {
        const itemsToInsert = items.map(({ id, ...item }: any) => ({
          ...item,
          cte_id: cteId,
        }));
        
        const { error: itemsError } = await supabase
          .from("itens_cte")
          .insert(itemsToInsert);
        
        if (itemsError) throw itemsError;
      }

      return savedCte;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ctes"] });
    },
  });
}

// For emitting a CTE
export function useCteEmit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (cte_id: string) => {
      const sefazResponse = await emitirCte(cte_id);

      if (!sefazResponse.success) {
        throw new Error(sefazResponse.motivo || "Erro desconhecido ao emitir CT-e.");
      }

      const { data, error } = await supabase
        .from("cte")
        .update({
          status: "emitido",
          chave_acesso: sefazResponse.chave_acesso,
          protocolo_autorizacao: sefazResponse.protocolo,
          data_autorizacao: new Date().toISOString(),
        })
        .eq("id", cte_id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ctes"] });
    },
  });
}

// For delete
export function useCteDelete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (cte_id: string) => {
      const { error } = await supabase.from("cte").delete().eq("id", cte_id);
      if (error) throw error;
      return cte_id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ctes"] });
    },
  });
}
