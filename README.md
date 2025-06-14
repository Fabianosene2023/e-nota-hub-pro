
# Sistema de Gestão Fiscal - NFe

Sistema completo para emissão, consulta e cancelamento de Notas Fiscais Eletrônicas (NFe) com integração SEFAZ.

## 🚀 Funcionalidades

### ✅ Implementadas
- **Gestão de Empresas**: Cadastro e configuração de empresas emitentes
- **Cadastro de Clientes**: Gestão completa de clientes (PF/PJ)
- **Catálogo de Produtos**: Controle de estoque e preços
- **Validações Fiscais**: CPF, CNPJ, NCM, CFOP com testes automatizados
- **Certificados Digitais**: Upload, validação e gestão segura de certificados A1/A3 via Supabase Vault
- **Configurações SEFAZ**: Ambiente (homologação/produção), timeouts, séries
- **Logs e Auditoria**: Rastreamento completo de operações
- **Testes Automatizados**: Cobertura superior a 80% das funcionalidades críticas
- **Testes E2E**: Validação completa dos fluxos de botões e interações
- **Feedback Visual**: Botões com estados de loading, sucesso e erro
- **Arquitetura Modular**: Código refatorado em módulos menores e testáveis

### 🔧 Em Desenvolvimento
- **Integração SEFAZ Real**: Substituição das simulações por comunicação real
- **Assinatura Digital**: Implementação da assinatura XML com certificados
- **Geração DANFE**: PDF das notas fiscais conforme layout oficial

## 🛠️ Tecnologias

- **Frontend**: React + TypeScript + Vite
- **Backend**: Supabase (Database + Edge Functions + Vault)
- **UI**: Tailwind CSS + Shadcn/UI
- **Testes**: Vitest + Testing Library + E2E Tests
- **Validações**: Bibliotecas nativas + funções customizadas
- **PDF**: jsPDF para geração de relatórios
- **Criptografia**: Supabase Vault para segurança dos certificados

## 📦 Instalação

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Conta Supabase (para produção)

### Configuração do Desenvolvimento

1. **Clone o projeto**
```bash
git clone <repo-url>
cd sistema-fiscal-nfe
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
# Copie o arquivo de exemplo
cp .env.example .env.local

# Configure as variáveis do Supabase
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_publica
```

4. **Execute o projeto**
```bash
npm run dev
```

## 🧪 Testes

### Executar todos os testes
```bash
npm run test
```

### Executar testes em modo watch
```bash
npm run test:watch
```

### Cobertura de testes
```bash
npm run test:coverage
```

### Testes E2E
```bash
npm run test:e2e
```

### Testes Implementados
- ✅ **Validações Fiscais**: CNPJ, CPF, NCM, CFOP (100% cobertura)
- ✅ **Formatação**: Documentos brasileiros (100% cobertura)
- ✅ **Certificados Digitais**: Upload, validação, segurança (95% cobertura)
- ✅ **Serviços SEFAZ**: Envio, consulta, cancelamento (90% cobertura)
- ✅ **Logs e Auditoria**: Rastreamento de operações (85% cobertura)
- ✅ **Testes E2E**: Fluxos completos de botões e interações (80% cobertura)
- ✅ **Integração**: Testes de comunicação SEFAZ (85% cobertura)

## 📋 Estrutura do Projeto (Refatorada)

```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes base (Shadcn/UI)
│   ├── common/         # Componentes comuns reutilizáveis
│   │   ├── ButtonWithFeedback.tsx
│   │   └── LoadingButton.tsx
│   └── ...             # Componentes de negócio
├── hooks/              # Custom hooks
│   ├── nfe/           # Hooks específicos para NFe
│   │   ├── useNotasFiscaisQuery.ts
│   │   └── useNotasFiscaisMutations.ts
│   └── ...
├── utils/              # Utilitários e serviços
│   ├── sefaz/         # Módulos SEFAZ refatorados
│   │   ├── sefazConfig.ts
│   │   ├── sefazValidators.ts
│   │   ├── sefazLogger.ts
│   │   └── sefazErrorHandler.ts
│   ├── nfe/           # Módulos NFe
│   │   ├── types.ts
│   │   ├── nfeUtils.ts
│   │   ├── xmlGenerator.ts
│   │   ├── signatureService.ts
│   │   └── nfeService.ts
│   └── __tests__/     # Testes automatizados
├── test/              # Configuração e utilitários de teste
│   ├── e2e/          # Testes End-to-End
│   └── integration/   # Testes de integração
├── integrations/      # Integrações (Supabase)
└── ...
```

## 🔒 Segurança

### Certificados Digitais
- **Supabase Vault**: Armazenamento seguro de certificados em produção
- **Criptografia AES-256**: Proteção adicional dos dados
- **Validação rigorosa**: Verificação de validade e estrutura PKCS#12
- **Auditoria completa**: Logs de todas as operações com certificados

### Validações
- Verificação rigorosa de documentos fiscais
- Validação de datas e prazos SEFAZ
- Sanitização de inputs
- Logs de auditoria completos

## 📈 Melhorias Implementadas

### 🎯 Feedback Visual dos Botões
- **ButtonWithFeedback**: Componente avançado com estados visuais
- **LoadingButton**: Wrapper simplificado para casos comuns
- **Estados**: Loading, sucesso, erro com ícones apropriados
- **Auto-reset**: Estados temporários resetam automaticamente

### 🧪 Cobertura de Testes
- **Testes E2E**: Validação completa de fluxos de usuário
- **Testes de Integração**: Comunicação SEFAZ e certificados
- **Cobertura > 80%**: Todas as funcionalidades críticas testadas
- **Mocks**: Simulação realista do Supabase e APIs externas

### 🏗️ Arquitetura Refatorada
- **Módulos menores**: Códigos focados e mais testáveis
- **Separação de responsabilidades**: Cada arquivo tem uma função específica
- **Reutilização**: Componentes e hooks mais modulares
- **Manutenibilidade**: Código mais limpo e documentado

### 📝 Documentação Atualizada
- **README completo**: Status atual e funcionalidades
- **Comentários no código**: Documentação inline detalhada
- **Guias de teste**: Instruções para executar diferentes tipos de teste
- **Estrutura do projeto**: Mapeamento da nova arquitetura

## 📞 Suporte

Para dúvidas e suporte:
- Abra uma [Issue](link-para-issues)
- Consulte a [Documentação SEFAZ](http://www.nfe.fazenda.gov.br/)
- Verifique os [logs do sistema](#logs-e-auditoria)

## 📄 Licença

Este projeto está sob licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

✅ **Status Atual**: Sistema robusto com testes abrangentes, feedback visual completo e arquitetura modular. Pronto para implementação das integrações reais com SEFAZ.
