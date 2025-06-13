
# Sistema de Gestão Fiscal - NFe

Sistema completo para emissão, consulta e cancelamento de Notas Fiscais Eletrônicas (NFe) com integração SEFAZ.

## 🚀 Funcionalidades

### ✅ Implementadas
- **Gestão de Empresas**: Cadastro e configuração de empresas emitentes
- **Cadastro de Clientes**: Gestão completa de clientes (PF/PJ)
- **Catálogo de Produtos**: Controle de estoque e preços
- **Validações Fiscais**: CPF, CNPJ, NCM, CFOP com testes automatizados
- **Certificados Digitais**: Upload, validação e gestão segura de certificados A1/A3
- **Configurações SEFAZ**: Ambiente (homologação/produção), timeouts, séries
- **Logs e Auditoria**: Rastreamento completo de operações
- **Testes Automatizados**: Cobertura completa das validações fiscais

### 🔧 Em Desenvolvimento
- **Integração SEFAZ Real**: Substituição das simulações por comunicação real
- **Assinatura Digital**: Implementação da assinatura XML com certificados
- **Geração DANFE**: PDF das notas fiscais conforme layout oficial

## 🛠️ Tecnologias

- **Frontend**: React + TypeScript + Vite
- **Backend**: Supabase (Database + Edge Functions)
- **UI**: Tailwind CSS + Shadcn/UI
- **Testes**: Vitest + Testing Library
- **Validações**: Bibliotecas nativas + funções customizadas
- **PDF**: jsPDF para geração de relatórios
- **Criptografia**: CryptoJS para segurança dos certificados

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

### Testes Implementados
- ✅ **Validações Fiscais**: CNPJ, CPF, NCM, CFOP
- ✅ **Formatação**: Documentos brasileiros
- ✅ **Certificados Digitais**: Upload, validação, segurança
- ✅ **Serviços SEFAZ**: Envio, consulta, cancelamento (simulado)
- ✅ **Logs e Auditoria**: Rastreamento de operações

## 📋 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes base (Shadcn/UI)
│   └── ...             # Componentes de negócio
├── hooks/              # Custom hooks
├── utils/              # Utilitários e serviços
│   ├── validacoesFiscais.ts     # Validações de documentos
│   ├── sefazWebService.ts       # Comunicação SEFAZ
│   ├── nfeService.ts           # Geração de NFe
│   ├── danfeGenerator.ts       # Geração de DANFE
│   └── __tests__/              # Testes automatizados
├── integrations/       # Integrações (Supabase)
└── ...
```

## 🔒 Segurança

### Certificados Digitais
- Armazenamento criptografado com AES-256
- Hash seguro das senhas com salt único
- Validação de validade e estrutura PKCS#12
- Chaves de criptografia em localStorage (desenvolvimento)
- **Produção**: Usar Supabase Vault ou HSM

### Validações
- Verificação rigorosa de documentos fiscais
- Validação de datas e prazos SEFAZ
- Sanitização de inputs
- Logs de auditoria completos

## 📈 Produção

### Checklist para Produção

#### ✅ Validações e Testes
- [x] Testes automatizados para validações fiscais
- [x] Testes de upload e validação de certificados
- [x] Testes de integração SEFAZ (simulado)
- [x] Validação de documentos (CPF, CNPJ, NCM, CFOP)

#### 🔧 Pendente para Produção
- [ ] **Integração SEFAZ Real**
  - Implementar biblioteca node-nfe ou similar
  - Configurar webservices por estado
  - Tratar todos os códigos de retorno SEFAZ
  - Implementar retry automático para falhas temporárias

- [ ] **Assinatura Digital**
  - Implementar assinatura XML com certificados A1/A3
  - Validar cadeia de certificação
  - Suporte para certificados em Token/SmartCard (A3)

- [ ] **Segurança**
  - Migrar chaves de certificados para Supabase Vault
  - Implementar HSM para ambientes críticos
  - Configurar HTTPS obrigatório
  - Auditoria de acesso completa

- [ ] **Logs e Monitoramento**
  - Integração com sistemas de log externos
  - Alertas para falhas críticas
  - Dashboard de monitoramento SEFAZ
  - Backup automático de logs

### Configuração SEFAZ por Estado

O sistema suporta todos os estados brasileiros com endpoints específicos:

- **Homologação**: Configurado para testes
- **Produção**: Endpoints oficiais por UF
- **Timeout**: Configurável por empresa (padrão 30s)
- **Retry**: Tentativas automáticas em caso de falha

### Códigos de Retorno SEFAZ

O sistema trata os principais códigos:
- `100`: Autorizado o uso da NF-e
- `135`: Evento registrado e vinculado à NF-e
- `539`: CNPJ do emitente inválido
- `540`: CPF do emitente inválido
- `999`: Erro interno

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Diretrizes
- Sempre escrever testes para novas funcionalidades
- Seguir os padrões ESLint/Prettier configurados
- Documentar funções complexas
- Manter cobertura de testes > 80%

## 📞 Suporte

Para dúvidas e suporte:
- Abra uma [Issue](link-para-issues)
- Consulte a [Documentação SEFAZ](http://www.nfe.fazenda.gov.br/)
- Verifique os [logs do sistema](#logs-e-auditoria)

## 📄 Licença

Este projeto está sob licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

⚠️ **Importante**: Este sistema está em desenvolvimento ativo. Para uso em produção, certifique-se de implementar as integrações reais com SEFAZ e configurar adequadamente a segurança dos certificados digitais.
