import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Re-export for backward compatibility and cleaner API
export { useNotasFiscaisQuery as useNotasFiscais } from './nfe/useNotasFiscaisQuery';
export { 
  useCreateNotaFiscalMutation as useCreateNotaFiscal,
  useCancelarNotaFiscalMutation as useCancelarNotaFiscal,
  useConsultarNotaFiscalMutation as useConsultarNotaFiscal
} from './nfe/useNotasFiscaisMutations';
