
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useCtes() {
  return useQuery({
    queryKey: ["ctes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cte")
        .select("*")
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
      const { data, error } = await supabase
        .from("cte")
        .upsert([values])
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
