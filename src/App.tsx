
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Login } from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import { Empresas } from "./components/Empresas";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

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
            <Route path="clientes" element={<div className="p-8 text-center text-muted-foreground">Página de Clientes em desenvolvimento</div>} />
            <Route path="produtos" element={<div className="p-8 text-center text-muted-foreground">Página de Produtos em desenvolvimento</div>} />
            <Route path="notas" element={<div className="p-8 text-center text-muted-foreground">Página de Notas Fiscais em desenvolvimento</div>} />
            <Route path="configuracoes" element={<div className="p-8 text-center text-muted-foreground">Página de Configurações em desenvolvimento</div>} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
