
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Login } from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import { Empresas } from "./components/Empresas";
import { TesteApiNfe } from "./components/TesteApiNfe";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="p-8 text-center">
    <h2 className="text-2xl font-bold mb-4">{title}</h2>
    <p className="text-muted-foreground">Página em desenvolvimento</p>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/" element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="empresas" element={<Empresas />} />
            
            {/* Notas Fiscais Routes */}
            <Route path="notas" element={<PlaceholderPage title="Notas Fiscais" />} />
            <Route path="notas/nfe" element={<PlaceholderPage title="Emissão NFe" />} />
            <Route path="notas/nfce" element={<PlaceholderPage title="Emissão NFCe" />} />
            <Route path="notas/cte" element={<PlaceholderPage title="Emissão CTe" />} />
            <Route path="notas/cte-desacordo" element={<PlaceholderPage title="Emissão Desacordo de CTe" />} />
            <Route path="notas/nfse" element={<PlaceholderPage title="Emissão NFSe" />} />
            <Route path="notas/nfe-ajuste" element={<PlaceholderPage title="Emissão NFe Ajuste" />} />
            <Route path="notas/nfe-complementar" element={<PlaceholderPage title="Emissão NFe Complementar" />} />
            <Route path="notas/nfe-importacao" element={<PlaceholderPage title="Emissão NFe Importação" />} />
            <Route path="notas/nfe-exportacao" element={<PlaceholderPage title="Emissão NFe Exportação" />} />
            <Route path="notas/consulta" element={<PlaceholderPage title="Consulta de Documentos" />} />
            <Route path="notas/recebidas" element={<PlaceholderPage title="Notas Recebidas (MDF-e)" />} />
            
            {/* Produtos Routes */}
            <Route path="produtos" element={<PlaceholderPage title="Produtos" />} />
            <Route path="produtos/lista" element={<PlaceholderPage title="Lista de Produtos" />} />
            <Route path="produtos/servicos" element={<PlaceholderPage title="Serviços" />} />
            <Route path="produtos/marcas" element={<PlaceholderPage title="Marcas" />} />
            <Route path="produtos/categorias" element={<PlaceholderPage title="Categorias" />} />
            <Route path="produtos/unidades" element={<PlaceholderPage title="Unidades de Medida" />} />
            <Route path="produtos/fornecedores" element={<PlaceholderPage title="Fornecedores" />} />
            <Route path="produtos/transportadoras" element={<PlaceholderPage title="Transportadoras" />} />
            <Route path="clientes" element={<PlaceholderPage title="Clientes" />} />
            
            {/* Configurações Routes */}
            <Route path="configuracoes" element={<PlaceholderPage title="Configurações" />} />
            <Route path="configuracoes/empresa" element={<PlaceholderPage title="Configurações da Empresa" />} />
            <Route path="configuracoes/usuarios" element={<PlaceholderPage title="Cadastro de Usuários" />} />
            <Route path="configuracoes/permissoes" element={<PlaceholderPage title="Configuração de Permissões" />} />
            <Route path="configuracoes/logs" element={<PlaceholderPage title="Consulta de Log de Uso" />} />
            <Route path="configuracoes/fiscais" element={<PlaceholderPage title="Configurações Fiscais" />} />
            <Route path="configuracoes/nfe" element={<PlaceholderPage title="Configuração NF-E" />} />
            <Route path="configuracoes/cte" element={<PlaceholderPage title="Configuração CT-E" />} />
            <Route path="configuracoes/nfce" element={<PlaceholderPage title="Configuração NFC-E" />} />
            <Route path="configuracoes/nfse" element={<PlaceholderPage title="Configuração NFS-E" />} />
            <Route path="configuracoes/matriz-fiscal" element={<PlaceholderPage title="Matriz Fiscal" />} />
            <Route path="configuracoes/natureza-operacao" element={<PlaceholderPage title="Natureza de Operação" />} />
            
            {/* Relatórios Routes */}
            <Route path="relatorios" element={<PlaceholderPage title="Relatórios" />} />
            <Route path="relatorios/produtos" element={<PlaceholderPage title="Relatório de Produtos" />} />
            <Route path="relatorios/clientes" element={<PlaceholderPage title="Relatório de Clientes" />} />
            <Route path="relatorios/estoque" element={<PlaceholderPage title="Relatório de Estoque" />} />
            
            <Route path="teste-api" element={<TesteApiNfe />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
