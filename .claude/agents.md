# Agentes do Ecommerce Platform

Este documento define os agentes disponíveis para automação e validação do projeto.

## Agentes de Validação

### Code Quality Agent
**Objetivo:** Validar qualidade do código

```bash
# Lint check
pnpm lint

# Fix linting issues
pnpm lint:fix

# Type checking
pnpm typecheck
```

**Trigger:** A cada commit ou pull request
**Responsabilidade:** Garantir código limpo e sem erros de tipo

---

### Testing Agent
**Objetivo:** Executar testes automaticamente

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage
```

**Trigger:** Antes de merge para master
**Responsabilidade:** Garantir que todos os testes passem

---

### Build Verification Agent
**Objetivo:** Validar build da aplicação

```bash
# Build all apps
pnpm build
```

**Trigger:** Antes de deploy
**Responsabilidade:** Garantir que o build não possui erros

---

## Agentes de Desenvolvimento

### Local Development Agent
**Objetivo:** Facilitar desenvolvimento local

```bash
# Start all apps in development mode
pnpm dev

# Docker compose for infrastructure
docker-compose up -d
```

**Trigger:** Inicio do desenvolvimento
**Responsabilidade:** Iniciar backend, frontend e infraestrutura

---

### Format Agent
**Objetivo:** Manter código formatado

```bash
# Format code
pnpm format

# Check format
pnpm format:check
```

**Trigger:** Antes de commit
**Responsabilidade:** Garantir consistência de código

---

## Agentes de CI/CD

### Pre-commit Agent
**Objetivo:** Validações antes de commit

Checklist:
- [ ] Código lintado (`pnpm lint:fix`)
- [ ] Código formatado (`pnpm format`)
- [ ] Types verificados (`pnpm typecheck`)

---

### PR Validation Agent
**Objetivo:** Validar pull requests automaticamente

Checklist:
- [ ] Build passes (`pnpm build`)
- [ ] Tests pass (`pnpm test`)
- [ ] No linting errors (`pnpm lint`)
- [ ] Types pass (`pnpm typecheck`)
- [ ] Documentation atualizada

**Branch requirement:** PR deve estar baseada em `master`

---

### Pre-deployment Agent
**Objetivo:** Validar antes de deploy

Checklist:
- [ ] Todos os testes passam
- [ ] Build foi bem-sucedido
- [ ] Sem warnings de linting
- [ ] Banco de dados migrations verificadas
- [ ] Variáveis de ambiente validadas

---

## Agentes de Documentação

### API Documentation Agent
**Objetivo:** Manter documentação da API atualizada

**Localização:** `docs/api/`

Responsabilidades:
- Documentar endpoints de ordem
- Documentar endpoints de endereço
- Documentar endpoints de produtos
- Documentar endpoints de carrinho

---

### Architecture Documentation Agent
**Objetivo:** Manter documentação de arquitetura

**Localização:** `docs/architecture/`

Responsabilidades:
- Diagrama de arquitetura
- Padrões de design utilizados
- Decisões arquiteturais

---

## Configuração de Agentes para MCP Servers

Agentes podem ser integrados com MCP servers para tarefas específicas:

### Git Integration Agent
Operações com Git:
```
- Criar branches
- Fazer commits
- Criar pull requests
- Merge automático
```

### Database Agent
Operações com banco de dados:
```
- Verificar migrations
- Validar schema
- Backup
```

### Docker Agent
Operações com Docker:
```
- Build de imagens
- Push para registry
- Deploy de containers
```

---

## Como Usar Agentes

### 1. Code Quality
```bash
# Validar código
pnpm lint
pnpm typecheck

# Fixar automaticamente
pnpm lint:fix
```

### 2. Testes
```bash
# Backend
cd apps/backend
pnpm test

# Frontend
cd apps/frontend
pnpm test
```

### 3. Build
```bash
# Build tudo
pnpm build

# Build específico
cd apps/backend
pnpm build
```

### 4. Desenvolvimento
```bash
# Iniciar infraestrutura
docker-compose up -d

# Iniciar apps
pnpm dev
```

---

## Matriz de Responsabilidades

| Tarefa | Agent | Frequência |
|--------|-------|-----------|
| Linting | Code Quality | A cada commit |
| Type Check | Code Quality | A cada commit |
| Testes | Testing | PR e pre-merge |
| Build | Build Verification | Pre-deploy |
| Formatting | Format | Pre-commit |
| Documentação | Documentation | A cada merge |
| Database | Database | Antes de deploy |

---

## Notas

- Todos os agentes devem ser idempotentes
- Agentes devem falhar rápido (fail-fast)
- Logs devem ser estruturados e claros
- Agentes devem ser independentes
- Erros devem ser reportados claramente
