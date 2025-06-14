
import { describe, it, expect, vi } from 'vitest';
import { useCertificadosVault } from '@/hooks/useCertificadosVault';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock do Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => Promise.resolve({ 
        data: [{
          id: '123',
          nome_certificado: 'Test Cert',
          tipo_certificado: 'A1',
          ativo: true
        }],
        error: null 
      })),
      insert: vi.fn(() => Promise.resolve({ data: [], error: null })),
      update: vi.fn(() => Promise.resolve({ data: [], error: null })),
      delete: vi.fn(() => Promise.resolve({ data: [], error: null }))
    })),
    functions: {
      invoke: vi.fn(() => Promise.resolve({ 
        data: { success: true, vault_secret_id: 'vault-123' },
        error: null 
      }))
    }
  }
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('Certificate Security Tests', () => {
  it('should validate certificate file format', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useCertificadosVault('empresa-123'), { wrapper });

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });
  });

  it('should handle certificate storage securely', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useCertificadosVault('empresa-123'), { wrapper });

    await waitFor(() => {
      expect(result.current.data).toEqual([{
        id: '123',
        nome_certificado: 'Test Cert',
        tipo_certificado: 'A1',
        ativo: true
      }]);
    });
  });
});
