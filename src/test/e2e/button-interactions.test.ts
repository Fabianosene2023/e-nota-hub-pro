
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { EmissaoNFe } from '@/components/EmissaoNFe';
import { CadastroClientes } from '@/components/CadastroClientes';
import { Empresas } from '@/components/Empresas';
import { ConfiguracoesFiscais } from '@/components/ConfiguracoesFiscais';
import { AuthContext } from '@/contexts/AuthContext';

// Mock do Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => Promise.resolve({ data: [], error: null })),
      insert: vi.fn(() => Promise.resolve({ data: [], error: null })),
      update: vi.fn(() => Promise.resolve({ data: [], error: null })),
      delete: vi.fn(() => Promise.resolve({ data: [], error: null }))
    })),
    functions: {
      invoke: vi.fn(() => Promise.resolve({ data: { success: true }, error: null }))
    }
  }
}));

// Mock do contexto de autenticação
const mockAuthContext = {
  user: { id: '123', email: 'test@test.com' },
  signIn: vi.fn(),
  signOut: vi.fn(),
  signUp: vi.fn(),
  loading: false
};

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={mockAuthContext}>
          {children}
        </AuthContext.Provider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

describe('Button Interactions E2E Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('EmissaoNFe Component', () => {
    it('should show loading state when emitting NFe', async () => {
      render(
        <TestWrapper>
          <EmissaoNFe />
        </TestWrapper>
      );

      // Procura pelo botão de emitir NFe
      const emitButton = screen.getByRole('button', { name: /emitir/i });
      expect(emitButton).toBeInTheDocument();

      // Simula clique
      fireEvent.click(emitButton);

      // Verifica se o estado de loading aparece
      await waitFor(() => {
        expect(emitButton).toBeDisabled();
      });
    });

    it('should show success toast after successful NFe emission', async () => {
      render(
        <TestWrapper>
          <EmissaoNFe />
        </TestWrapper>
      );

      const emitButton = screen.getByRole('button', { name: /emitir/i });
      fireEvent.click(emitButton);

      // Aguarda o toast de sucesso
      await waitFor(() => {
        expect(screen.getByText(/sucesso/i)).toBeInTheDocument();
      });
    });
  });

  describe('CadastroClientes Component', () => {
    it('should validate form and show feedback on save button click', async () => {
      render(
        <TestWrapper>
          <CadastroClientes />
        </TestWrapper>
      );

      const saveButton = screen.getByRole('button', { name: /salvar/i });
      expect(saveButton).toBeInTheDocument();

      fireEvent.click(saveButton);

      // Verifica validação do formulário
      await waitFor(() => {
        expect(screen.getByText(/campo obrigatório/i)).toBeInTheDocument();
      });
    });

    it('should show loading state during client creation', async () => {
      render(
        <TestWrapper>
          <CadastroClientes />
        </TestWrapper>
      );

      // Preenche campos obrigatórios
      const nomeInput = screen.getByLabelText(/nome/i);
      const cpfInput = screen.getByLabelText(/cpf/i);
      
      fireEvent.change(nomeInput, { target: { value: 'João Silva' } });
      fireEvent.change(cpfInput, { target: { value: '123.456.789-00' } });

      const saveButton = screen.getByRole('button', { name: /salvar/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(saveButton).toBeDisabled();
      });
    });
  });

  describe('Empresas Component', () => {
    it('should handle empresa creation with proper feedback', async () => {
      render(
        <TestWrapper>
          <Empresas />
        </TestWrapper>
      );

      const createButton = screen.getByRole('button', { name: /nova empresa/i });
      fireEvent.click(createButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });
  });

  describe('ConfiguracoesFiscais Component', () => {
    it('should handle certificate upload with visual feedback', async () => {
      render(
        <TestWrapper>
          <ConfiguracoesFiscais />
        </TestWrapper>
      );

      const uploadButton = screen.getByRole('button', { name: /upload certificado/i });
      expect(uploadButton).toBeInTheDocument();

      fireEvent.click(uploadButton);

      // Verifica se o modal de upload aparece
      await waitFor(() => {
        expect(screen.getByText(/selecione o certificado/i)).toBeInTheDocument();
      });
    });
  });
});
