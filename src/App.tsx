import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Login } from "@/components/Login";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy loading dos componentes
import { lazy } from "react";

const Dashboard = lazy(() => import("./components/Dashboard").then(module => ({ default: module.Dashboard })));
const Empresas = lazy(() => import("./components/Empresas").then(module => ({ default: module.Empresas })));
const EmissaoNFe = lazy(() => import("./components/EmissaoNFe").then(module => ({ default: module.EmissaoNFe })));
const TesteApiNfe = lazy(() => import("./components/TesteApiNfe").then(module => ({ default: module.TesteApiNfe })));
const ConfiguracoesFiscais = lazy(() => import("./components/ConfiguracoesFiscais").then(module => ({ default: module.ConfiguracoesFiscais })));
const CadastroClientes = lazy(() => import("./pages/CadastroClientes"));
const CadastroProdutos = lazy(() => import("./pages/CadastroProdutos"));
const CadastroServicos = lazy(() => import("./pages/CadastroServicos"));
const CadastroFornecedores = lazy(() => import("./pages/CadastroFornecedores"));
const CadastroTransportadoras = lazy(() => import("./pages/CadastroTransportadoras"));
const CadastroMarcas = lazy(() => import("./pages/CadastroMarcas"));
const Relatorios = lazy(() => import("./components/Relatorios").then(module => ({ default: module.Relatorios })));
const NfcePage = lazy(() => import("./components/Nfce").then(m => ({ default: m.default })));
const CtePage = lazy(() => import("./pages/CtePage"));
const CadastroCategorias = lazy(() => import("./pages/CadastroCategorias"));
const CadastroUnidades = lazy(() => import("./pages/CadastroUnidades"));

const ConfiguracoesEmpresa = lazy(() => import("./components/ConfiguracoesEmpresa").then(module => ({ default: module.ConfiguracoesEmpresa })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const CadastroUsuarios = lazy(() => import("./pages/CadastroUsuarios"));

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              {/* Rota pública */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />

              {/* Rotas protegidas */}
              <Route path="/*" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route path="dashboard" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <Dashboard />
                  </Suspense>
                } />
                <Route path="empresas" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <Empresas />
                  </Suspense>
                } />
                
                {/* Notas Fiscais */}
                <Route path="notas/nfe" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <EmissaoNFe />
                  </Suspense>
                } />
                <Route path="notas/nfce" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <NfcePage />
                  </Suspense>
                } />
                
                {/* Cadastros */}
                <Route path="clientes" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <CadastroClientes />
                  </Suspense>
                } />
                <Route path="usuarios" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <CadastroUsuarios />
                  </Suspense>
                } />
                <Route path="produtos/lista" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <CadastroProdutos />
                  </Suspense>
                } />
                <Route path="produtos/servicos" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <CadastroServicos />
                  </Suspense>
                } />
                <Route path="produtos/fornecedores" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <CadastroFornecedores />
                  </Suspense>
                } />
                <Route path="produtos/transportadoras" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <CadastroTransportadoras />
                  </Suspense>
                } />
                <Route path="produtos/marcas" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <CadastroMarcas />
                  </Suspense>
                } />
                <Route path="produtos/categorias" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <CadastroCategorias />
                  </Suspense>
                } />
                <Route path="produtos/unidades" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <CadastroUnidades />
                  </Suspense>
                } />

                {/* Configurações */}
                <Route path="configuracoes/empresa" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <ConfiguracoesEmpresa />
                  </Suspense>
                } />
                <Route path="configuracoes/usuarios" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <CadastroUsuarios />
                  </Suspense>
                } />
                <Route path="configuracoes/fiscais" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <ConfiguracoesFiscais />
                  </Suspense>
                } />
                
                {/* Relatórios */}
                <Route path="relatorios" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <Relatorios />
                  </Suspense>
                } />
                
                {/* Teste API */}
                <Route path="teste-api" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <TesteApiNfe />
                  </Suspense>
                } />

                {/* Redirecionamento padrão */}
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="notas/cte" element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <CtePage />
                  </Suspense>
                } />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
