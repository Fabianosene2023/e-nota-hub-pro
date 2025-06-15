
import { lazy } from "react";

// Lazy loading dos componentes
export const Dashboard = lazy(() => import("../components/Dashboard").then(module => ({ default: module.Dashboard })));
export const Empresas = lazy(() => import("../components/Empresas").then(module => ({ default: module.Empresas })));
export const EmissaoNFe = lazy(() => import("../components/EmissaoNFe").then(module => ({ default: module.EmissaoNFe })));
export const TesteApiNfe = lazy(() => import("../components/TesteApiNfe").then(module => ({ default: module.TesteApiNfe })));
export const ConfiguracoesFiscais = lazy(() => import("../components/ConfiguracoesFiscais").then(module => ({ default: module.ConfiguracoesFiscais })));
export const CadastroClientes = lazy(() => import("../pages/CadastroClientes"));
export const CadastroProdutos = lazy(() => import("../pages/CadastroProdutos"));
export const CadastroServicos = lazy(() => import("../pages/CadastroServicos"));
export const CadastroFornecedores = lazy(() => import("../pages/CadastroFornecedores"));
export const CadastroTransportadoras = lazy(() => import("../pages/CadastroTransportadoras"));
export const CadastroMarcas = lazy(() => import("../pages/CadastroMarcas"));
export const Relatorios = lazy(() => import("../components/Relatorios").then(module => ({ default: module.Relatorios })));
export const NfcePage = lazy(() => import("../components/Nfce").then(m => ({ default: m.default })));
export const CtePage = lazy(() => import("../pages/CtePage"));
export const CadastroCategorias = lazy(() => import("../pages/CadastroCategorias"));
export const CadastroUnidades = lazy(() => import("../pages/CadastroUnidades"));
export const ConfiguracoesEmpresa = lazy(() => import("../components/ConfiguracoesEmpresa").then(module => ({ default: module.ConfiguracoesEmpresa })));
export const CadastroUsuarios = lazy(() => import("../pages/CadastroUsuarios"));
export const ConfiguracaoPermissoes = lazy(() => import("../pages/ConfiguracaoPermissoes"));
export const RelatoriosProdutos = lazy(() => import("../pages/RelatoriosProdutos"));
export const RelatoriosClientes = lazy(() => import("../pages/RelatoriosClientes"));
export const RelatoriosEstoque = lazy(() => import("../pages/RelatoriosEstoque"));
