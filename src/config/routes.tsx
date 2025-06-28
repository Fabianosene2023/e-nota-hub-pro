
import { lazy } from "react";

// Lazy loading de componentes
export const Dashboard = lazy(() => import("../components/Dashboard"));
export const Empresas = lazy(() => import("../components/Empresas").then(module => ({ default: module.Empresas })));

// Notas Fiscais - Todas as rotas integradas
export const EmissaoNFe = lazy(() => import("../components/EmissaoNFe").then(module => ({ default: module.EmissaoNFe })));
export const NfcePage = lazy(() => import("../components/Nfce"));
export const CtePage = lazy(() => import("../pages/CtePage"));
export const EmissaoNFSe = lazy(() => import("../components/EmissaoNFSe").then(module => ({ default: module.EmissaoNFSe })));
export const NfeAjuste = lazy(() => import("../pages/NfeAjuste"));
export const NfeComplementar = lazy(() => import("../pages/NfeComplementar"));
export const NfeImportacao = lazy(() => import("../pages/NfeImportacao"));
export const NfeExportacao = lazy(() => import("../pages/NfeExportacao"));
export const ConsultaDocumentos = lazy(() => import("../pages/ConsultaDocumentos"));
export const NotasRecebidas = lazy(() => import("../pages/NotasRecebidas"));

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

// Configurações - Todas as rotas integradas
export const ConfiguracoesEmpresa = lazy(() => import("../components/ConfiguracoesEmpresa").then(module => ({ default: module.ConfiguracoesEmpresa })));
export const ConfiguracaoPermissoes = lazy(() => import("../pages/ConfiguracaoPermissoes"));
export const ConfiguracoesFiscais = lazy(() => import("../components/ConfiguracoesFiscais").then(module => ({ default: module.ConfiguracoesFiscais })));
export const ConsultaLogs = lazy(() => import("../pages/ConsultaLogs"));
export const ConfiguracaoNfe = lazy(() => import("../pages/ConfiguracaoNfe"));
export const ConfiguracaoCte = lazy(() => import("../pages/ConfiguracaoCte"));
export const ConfiguracaoNfce = lazy(() => import("../pages/ConfiguracaoNfce"));
export const ConfiguracaoNfse = lazy(() => import("../pages/ConfiguracaoNfse"));
export const MatrizFiscal = lazy(() => import("../pages/MatrizFiscal"));
export const NaturezaOperacao = lazy(() => import("../pages/NaturezaOperacao"));

// Relatórios
export const Relatorios = lazy(() => import("../components/Relatorios").then(module => ({ default: module.Relatorios })));
export const RelatoriosProdutos = lazy(() => import("../pages/RelatoriosProdutos"));
export const RelatoriosClientes = lazy(() => import("../pages/RelatoriosClientes"));
export const RelatoriosEstoque = lazy(() => import("../pages/RelatoriosEstoque"));

// Teste API
export const TesteApiNfe = lazy(() => import("../components/TesteApiNfe").then(module => ({ default: module.TesteApiNfe })));
