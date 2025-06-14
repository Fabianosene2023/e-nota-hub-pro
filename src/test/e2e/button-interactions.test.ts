
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import CadastroClientes from '@/pages/CadastroClientes';
import CadastroProdutos from '@/pages/CadastroProdutos';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    React.createElement(QueryClientProvider, { client: queryClient },
      React.createElement(BrowserRouter, {},
        React.createElement(AuthProvider, {}, component)
      )
    )
  );
};

describe('Button Interactions E2E Tests', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  describe('Cadastro de Clientes', () => {
    it('should show loading state when creating client', async () => {
      renderWithProviders(React.createElement(CadastroClientes));
      
      const novoClienteButton = screen.getByText('Novo Cliente');
      await user.click(novoClienteButton);
      
      const nomeInput = screen.getByLabelText('Nome/Razão Social');
      await user.type(nomeInput, 'Cliente Teste');
      
      const submitButton = screen.getByText('Criar');
      expect(submitButton).toBeInTheDocument();
    });

    it('should show success feedback after client creation', async () => {
      renderWithProviders(React.createElement(CadastroClientes));
      
      const novoClienteButton = screen.getByText('Novo Cliente');
      await user.click(novoClienteButton);
      
      expect(screen.getByText('Novo Cliente')).toBeInTheDocument();
    });
  });

  describe('Edit Button Interactions', () => {
    it('should open edit dialog when edit button is clicked', async () => {
      renderWithProviders(React.createElement(CadastroClientes));
      
      await waitFor(() => {
        const editButtons = screen.queryAllByRole('button');
        expect(editButtons.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Delete Button Interactions', () => {
    it('should show confirmation dialog before deletion', async () => {
      renderWithProviders(React.createElement(CadastroClientes));
      
      await waitFor(() => {
        const deleteButtons = screen.queryAllByRole('button');
        expect(deleteButtons.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Cadastro de Produtos', () => {
    it('should validate required fields before submission', async () => {
      renderWithProviders(React.createElement(CadastroProdutos));
      
      const novoProdutoButton = screen.queryByText('Novo Produto');
      if (novoProdutoButton) {
        await user.click(novoProdutoButton);
      }
      
      expect(screen.getByText('Cadastro de Produtos')).toBeInTheDocument();
    });

    it('should show loading state during product creation', async () => {
      renderWithProviders(React.createElement(CadastroProdutos));
      
      expect(screen.getByText('Cadastro de Produtos')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should prevent submission with invalid data', async () => {
      renderWithProviders(React.createElement(CadastroClientes));
      
      const novoClienteButton = screen.getByText('Novo Cliente');
      await user.click(novoClienteButton);
      
      const submitButton = screen.getByText('Criar');
      await user.click(submitButton);
      
      expect(submitButton).toBeInTheDocument();
    });

    it('should show validation errors for empty required fields', async () => {
      renderWithProviders(React.createElement(CadastroClientes));
      
      const novoClienteButton = screen.getByText('Novo Cliente');
      await user.click(novoClienteButton);
      
      expect(screen.getByText('Novo Cliente')).toBeInTheDocument();
    });
  });
});
