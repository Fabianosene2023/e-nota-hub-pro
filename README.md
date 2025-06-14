
# 📊 E-Nota Hub Pro

## 🚀 Sistema Completo de Emissão de Notas Fiscais Eletrônicas

**E-Nota Hub Pro** é uma solução moderna e robusta para emissão, gestão e controle de Notas Fiscais Eletrônicas (NFe e NFCe), desenvolvida com tecnologias de ponta e integração completa com a SEFAZ.

## ✨ Principais Funcionalidades

### 📝 Gestão Completa de NFe/NFCe
- **Emissão de Notas Fiscais** com validação automática
- **Cancelamento e Inutilização** de numeração
- **Consulta de Status** em tempo real
- **Download de XML** e geração de DANFE
- **Carta de Correção Eletrônica** (CCe)

### 🏢 Gestão Empresarial
- **Cadastro de Empresas** com validação de CNPJ
- **Gestão de Certificados Digitais** A1/A3
- **Configuração SEFAZ** por ambiente (homologação/produção)
- **Controle de Séries** e numeração automática

### 👥 Cadastros Auxiliares
- **Clientes** com validação de CPF/CNPJ ✅
- **Produtos** com informações fiscais completas ✅
- **Fornecedores** e Transportadoras
- **Categorias** e Marcas de produtos

### 🔐 Segurança e Auditoria
- **Autenticação** via Supabase Auth
- **Logs detalhados** de todas as operações ✅
- **Auditoria completa** das transações SEFAZ ✅
- **Criptografia** de certificados digitais

### 📊 Relatórios e Dashboard
- **Dashboard** com indicadores em tempo real
- **Relatórios** de vendas e tributação
- **Gráficos** de performance
- **Exportação** de dados

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React 18 + TypeScript + Vite
- **UI/UX:** Tailwind CSS + Shadcn/UI + Lucide Icons
- **Backend:** Supabase (PostgreSQL + Auth + Edge Functions)
- **Estado:** TanStack Query (React Query)
- **Validação:** Zod + React Hook Form ✅
- **Testes:** Vitest + Testing Library ✅
- **Build:** Vite + TypeScript

## 🎯 Melhorias Recentes (v2.0)

### ✅ Validação de Dados
- **Validação robusta** nos formulários de clientes e produtos
- **Mensagens de erro específicas** para cada campo
- **Feedback visual** em tempo real durante preenchimento
- **Validação de CPF/CNPJ** com algoritmo oficial

### ✅ Tratamento de Erros
- **Sistema de toast** para feedback de operações
- **Mensagens específicas** para cada tipo de erro
- **Logs detalhados** para debugging
- **Recuperação graceful** de falhas

### ✅ Confirmação de Exclusão
- **Modal de confirmação** para todas as exclusões
- **Validação de dependências** antes da exclusão
- **Feedback claro** sobre consequências da ação

### ✅ Auditoria e Logs
- **Persistência de logs** no banco de dados
- **Rastreabilidade completa** de operações SEFAZ
- **Estatísticas** de performance e erros
- **Histórico detalhado** por empresa

### ✅ Cobertura de Testes
- **Testes E2E** para interações de botões
- **Testes de integração** para funcionalidades críticas
- **Testes de validação** para formulários
- **Cobertura superior a 80%** em funcionalidades críticas

## 🔧 Configuração e Instalação

### Pré-requisitos
- Node.js 18+ 
- NPM ou Yarn
- Conta no Supabase

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/e-nota-hub-pro.git
cd e-nota-hub-pro

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite o arquivo .env.local com suas configurações

# Execute o projeto
npm run dev
```

### Variáveis de Ambiente

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📖 Como Usar

### 1. Configuração Inicial
1. **Cadastre sua empresa** com CNPJ válido
2. **Faça upload** do certificado digital A1
3. **Configure** as séries de NFe/NFCe
4. **Defina** o ambiente SEFAZ (homologação/produção)

### 2. Cadastros Básicos
1. **Produtos:** Cadastre os produtos com informações fiscais
2. **Clientes:** Registre os clientes com CPF/CNPJ válidos
3. **Transportadoras:** Configure as empresas de transporte

### 3. Emissão de NFe
1. **Selecione** o cliente e produtos
2. **Preencha** as informações fiscais
3. **Valide** os dados automaticamente
4. **Envie** para a SEFAZ
5. **Acompanhe** o status em tempo real

## 🧪 Executando Testes

```bash
# Testes unitários
npm run test

# Testes com cobertura
npm run test:coverage

# Testes E2E
npm run test:e2e

# Todos os testes
npm run test:all
```

## 📋 Funcionalidades Validadas

### ✅ Validação de Formulários
- [x] Validação de CPF/CNPJ com algoritmo oficial
- [x] Validação de CEP e endereços
- [x] Validação de emails e telefones
- [x] Validação de códigos fiscais (NCM, CFOP)
- [x] Feedback visual em tempo real

### ✅ Tratamento de Erros
- [x] Mensagens específicas por tipo de erro
- [x] Toast notifications para feedback
- [x] Logs detalhados para debugging
- [x] Recuperação de falhas de rede

### ✅ Confirmações de Segurança
- [x] Modal de confirmação para exclusões
- [x] Validação de dependências
- [x] Prevenção de exclusão acidental

### ✅ Auditoria e Compliance
- [x] Logs persistentes no banco
- [x] Rastreabilidade de operações
- [x] Estatísticas de performance
- [x] Conformidade com regulamentações

## 🎨 Design System

O projeto utiliza um design system consistente baseado em:

- **Cores:** Paleta moderna com suporte a tema escuro
- **Tipografia:** Inter font para legibilidade
- **Componentes:** Shadcn/UI para consistência
- **Ícones:** Lucide React para clareza visual
- **Espaçamento:** Sistema baseado em Tailwind CSS

## 🔄 Workflow de Desenvolvimento

### Padrões de Código
- **TypeScript strict** para type safety
- **ESLint + Prettier** para formatação
- **Conventional Commits** para versionamento
- **Componentes funcionais** com hooks

### Estrutura de Pastas
```
src/
├── components/       # Componentes reutilizáveis
│   ├── common/      # Componentes genéricos
│   └── ui/          # Componentes de interface
├── hooks/           # Custom hooks
├── pages/           # Páginas da aplicação
├── utils/           # Utilitários e helpers
├── test/            # Testes automatizados
└── integrations/    # Integrações externas
```

## 🚀 Deploy e Produção

### Build para Produção
```bash
npm run build
```

### Deploy Automático
O projeto está configurado para deploy automático no Netlify/Vercel através de GitHub Actions.

## 📊 Monitoramento

### Métricas Disponíveis
- **Performance:** Tempo de resposta das operações
- **Erros:** Taxa de falhas por operação
- **Uso:** Estatísticas de utilização por empresa
- **SEFAZ:** Status de comunicação com a receita

### Logs de Auditoria
- **Operações CRUD:** Todas as operações são logadas
- **Transações SEFAZ:** Comunicação completa registrada
- **Autenticação:** Logs de acesso e segurança
- **Erros:** Stack traces para debugging

## 🔮 Roadmap

### 🎯 Próximas Funcionalidades
- [ ] **NFCe Mobile:** App mobile para emissão
- [ ] **API Rest:** Endpoints para integrações
- [ ] **Sincronização:** Multi-device em tempo real
- [ ] **BI Avançado:** Dashboards personalizáveis

### 🔧 Melhorias Técnicas
- [ ] **PWA:** Progressive Web App
- [ ] **Offline Mode:** Funcionamento sem internet
- [ ] **Real-time:** WebSockets para atualizações
- [ ] **Microservices:** Arquitetura distribuída

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor:

1. **Fork** o projeto
2. **Crie** uma branch para sua feature
3. **Commit** suas mudanças
4. **Push** para a branch
5. **Abra** um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

- **Email:** suporte@enotahub.com.br
- **Discord:** [Canal de Suporte](https://discord.gg/enotahub)
- **Documentação:** [docs.enotahub.com.br](https://docs.enotahub.com.br)

---

**E-Nota Hub Pro** - Simplificando a emissão de notas fiscais eletrônicas para sua empresa 🚀
