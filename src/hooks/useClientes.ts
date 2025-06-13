
import { useContatos } from './useContatos';

// Alias para manter compatibilidade
export const useClientes = () => {
  return useContatos('cliente');
};
