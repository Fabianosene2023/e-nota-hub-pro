
import { supabase } from "@/integrations/supabase/client";

/**
 * Checa no banco se já existe CPF/CNPJ duplicado para a empresa.
 * Retorna TRUE se existir DUPLICADO (ignorando cliente atual em edição).
 */
export async function checkClienteDuplicado({
  empresaId,
  cpfCnpj,
  ignoreClienteId, // se edição, ignora o próprio registro
}: { empresaId: string, cpfCnpj: string, ignoreClienteId?: string }) {
  const cpfCnpjLimpo = cpfCnpj.replace(/\D/g, "");
  let query = supabase
    .from("clientes")
    .select("id")
    .eq("empresa_id", empresaId)
    .eq("cpf_cnpj", cpfCnpjLimpo);

  if (ignoreClienteId) {
    query = query.neq("id", ignoreClienteId);
  }

  const { data, error } = await query;
  if (error) {
    // Retorne falso (deixar processamento seguir) se erro inesperado.
    if (process.env.NODE_ENV === "development") console.error("Erro ao checar duplicidade de CPF/CNPJ:", error);
    return false;
  }
  return (data && data.length > 0);
}
