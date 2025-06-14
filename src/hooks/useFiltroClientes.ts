
import { useMemo } from "react";

export function useFiltroClientes(clientes: any[], searchTerm: string) {
  return useMemo(() => {
    if (!clientes) return [];
    return clientes.filter(cliente =>
      cliente.nome_razao_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.cpf_cnpj.includes(searchTerm)
    );
  }, [clientes, searchTerm]);
}
