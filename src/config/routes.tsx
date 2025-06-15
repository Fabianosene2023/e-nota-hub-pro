
import { lazy } from "react";

// Lazy loading de componentes
export const Dashboard = lazy(() => import("../pages/Index"));
export const Empresas = lazy(() => import("../components/Empresas").then(module => ({ default: module.Empresas })));

// Notas Fiscais
export const EmissaoNFe = lazy(() => import("../components/EmissaoNFe").then(module => ({ default: module.EmissaoNFe })));
export const NfcePage = lazy(() => import("../components/Nfce"));
export const CtePage = lazy(() => import("../pages/CtePage"));
export const NfseEmissao = lazy(() => import("../pages/NfseEmissao"));

// Cadastros
export const CadastroClientes = lazy(() => import("../pages/CadastroClientes"));
export const CadastroUsuarios = lazy(() => import("../pages/CadastroUsuarios"));
export const CadastroProdutos = lazy(() => import("../pages/CadastroProdutos"));
export const CadastroServicos = lazy(() => import("../pages/CadastroServicos"));
export const CadastroFornecedores = lazy(() => import("../pages/CadastroFornecedores"));
export const CadastroTransportadoras = lazy(() => import("../pages/CadastroTransportadoras"));
export const CadastroMarcas = lazy(() => import("../pages/CadastroMarcas"));
export const CadastroCategorias = lazy(() => import("../pages/CadastroCategorias"));
export const CadastroUnidades = lazy(() => import("../pages/CadastroUnidades"));

// Configurações
export const ConfiguracoesEmpresa = lazy(() => import("../components/ConfiguracoesEmpresa").then(module => ({ default: module.ConfiguracoesEmpresa })));
export const ConfiguracaoPermissoes = lazy(() => import("../pages/ConfiguracaoPermissoes"));
export const ConfiguracoesFiscais = lazy(() => import("../components/ConfiguracoesFiscais").then(module => ({ default: module.ConfiguracoesFiscais })));

// Relatórios
export const Relatorios = lazy(() => import("../components/Relatorios").then(module => ({ default: module.Relatorios })));
export const RelatoriosProdutos = lazy(() => import("../pages/RelatoriosProdutos"));
export const RelatoriosClientes = lazy(() => import("../pages/RelatoriosClientes"));
export const RelatoriosEstoque = lazy(() => import("../pages/RelatoriosEstoque"));

// Teste API
export const TesteApiNfe = lazy(() => import("../components/TesteApiNfe").then(module => ({ default: module.TesteApiNfe })));
