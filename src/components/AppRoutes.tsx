
import { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Layout } from "@/components/Layout";
import Index from "../pages/Index";
import NotFound from "../pages/NotFound";
import { Login } from "@/components/Login";
import * as LazyComponents from "../config/routes";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

export const AppRoutes = () => {
  return (
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
            <LazyComponents.Dashboard />
          </Suspense>
        } />
        <Route path="empresas" element={
          <Suspense fallback={<LoadingSpinner />}>
            <LazyComponents.Empresas />
          </Suspense>
        } />
        
        {/* Notas Fiscais */}
        <Route path="notas/nfe" element={
          <Suspense fallback={<LoadingSpinner />}>
            <LazyComponents.EmissaoNFe />
          </Suspense>
        } />
        <Route path="notas/nfe-ajuste" element={
          <Suspense fallback={<LoadingSpinner />}>
            <LazyComponents.NfeAjuste />
          </Suspense>
        } />
        <Route path="notas/nfe-complementar" element={
          <Suspense fallback={<LoadingSpinner />}>
            <LazyComponents.NfeComplementar />
          </Suspense>
        } />
        <Route path="notas/nfe-importacao" element={
          <Suspense fallback={<LoadingSpinner />}>
            <LazyComponents.NfeImportacao />
          </Suspense>
        } />
        <Route path="notas/nfe-exportacao" element={
          <Suspense fallback={<LoadingSpinner />}>
            <LazyComponents.NfeExportacao />
          </Suspense>
        } />
        <Route path="notas/consulta" element={
          <Suspense fallback={<LoadingSpinner />}>
            <LazyComponents.ConsultaDocumentos />
          </Suspense>
        } />
        <Route path="notas/nfce" element={
          <Suspense fallback={<LoadingSpinner />}>
            <LazyComponents.NfcePage />
          </Suspense>
        } />
        <Route path="notas/cte" element={
          <Suspense fallback={<LoadingSpinner />}>
            <LazyComponents.CtePage />
          </Suspense>
        } />
        <Route path="notas/nfse" element={
          <Suspense fallback={<LoadingSpinner />}>
            <LazyComponents.NfseEmissao />
          </Suspense>
        } />
        
        {/* Cadastros */}
        <Route path="clientes" element={
          <Suspense fallback={<LoadingSpinner />}>
            <LazyComponents.CadastroClientes />
          </Suspense>
        } />
        <Route path="usuarios" element={
          <Suspense fallback={<LoadingSpinner />}>
            <LazyComponents.CadastroUsuarios />
          </Suspense>
        } />
        <Route path="produtos/lista" element={
          <Suspense fallback={<LoadingSpinner />}>
            <LazyComponents.CadastroProdutos />
          </Suspense>
        } />
        <Route path="produtos/servicos" element={
          <Suspense fallback={<LoadingSpinner />}>
            <LazyComponents.CadastroServicos />
          </Suspense>
        } />
        <Route path="produtos/fornecedores" element={
          <Suspense fallback={<LoadingSpinner />}>
            <LazyComponents.CadastroFornecedores />
          </Suspense>
        } />
        <Route path="produtos/transportadoras" element={
          <Suspense fallback={<LoadingSpinner />}>
            <LazyComponents.CadastroTransportadoras />
          </Suspense>
        } />
        <Route path="produtos/marcas" element={
          <Suspense fallback={<LoadingSpinner />}>
            <LazyComponents.CadastroMarcas />
          </Suspense>
        } />
        <Route path="produtos/categorias" element={
          <Suspense fallback={<LoadingSpinner />}>
            <LazyComponents.CadastroCategorias />
          </Suspense>
        } />
        <Route path="produtos/unidades" element={
          <Suspense fallback={<LoadingSpinner />}>
            <LazyComponents.CadastroUnidades />
          </Suspense>
        } />

        {/* Configurações */}
        <Route path="configuracoes/empresa" element={
          <Suspense fallback={<LoadingSpinner />}>
            <LazyComponents.ConfiguracoesEmpresa />
          </Suspense>
        } />
        <Route path="configuracoes/usuarios" element={
          <Suspense fallback={<LoadingSpinner />}>
            <LazyComponents.CadastroUsuarios />
          </Suspense>
        } />
        <Route path="configuracoes/permissoes" element={
          <Suspense fallback={<LoadingSpinner />}>
            <LazyComponents.ConfiguracaoPermissoes />
          </Suspense>
        } />
        <Route path="configuracoes/fiscais" element={
          <Suspense fallback={<LoadingSpinner />}>
            <LazyComponents.ConfiguracoesFiscais />
          </Suspense>
        } />
        
        {/* Relatórios */}
        <Route path="relatorios" element={
          <Suspense fallback={<LoadingSpinner />}>
            <LazyComponents.Relatorios />
          </Suspense>
        } />
        <Route path="relatorios/produtos" element={
          <Suspense fallback={<LoadingSpinner />}>
            <LazyComponents.RelatoriosProdutos />
          </Suspense>
        } />
        <Route path="relatorios/clientes" element={
          <Suspense fallback={<LoadingSpinner />}>
            <LazyComponents.RelatoriosClientes />
          </Suspense>
        } />
        <Route path="relatorios/estoque" element={
          <Suspense fallback={<LoadingSpinner />}>
            <LazyComponents.RelatoriosEstoque />
          </Suspense>
        } />
        
        {/* Teste API */}
        <Route path="teste-api" element={
          <Suspense fallback={<LoadingSpinner />}>
            <LazyComponents.TesteApiNfe />
          </Suspense>
        } />

        {/* Redirecionamento padrão */}
        <Route index element={<Navigate to="/dashboard" replace />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
