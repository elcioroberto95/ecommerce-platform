# Instruções para Claude Code - Ecommerce Platform

## Visão Geral do Projeto

- **Tipo:** Plataforma de e-commerce educacional
- **Stack:** TypeScript, Node.js, React, PostgreSQL, Redis
- **Arquitetura:** Monorepo (pnpm workspaces) com Backend e Frontend
- **Padrões:** Clean Code, SOLID, Testes, Observabilidade

## Estrutura do Projeto

```
.
├── apps/
│   ├── backend/          # API REST (Node.js/Express)
│   └── frontend/         # React SPA
├── packages/             # Shared packages
├── docs/                 # Documentação
├── infra/                # Infraestrutura (Docker, K8s)
├── .github/              # GitHub Actions CI/CD
└── .claude/              # Configuração Claude Code
```

## Padrões e Convenções

### Commit Messages
- Use conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`
- Formato: `type(scope): subject`
- Exemplo: `feat(orders): add order status update endpoint`

### Branching
- Feature: `feat/description`
- Bugfix: `fix/description`
- Chore: `chore/description`
- Baseie sempre em `master`

### Code Style
- TypeScript com types obrigatórios (não use `any`)
- ESLint + Prettier configurados
- 2 espaços de indentação
- Sem comentários desnecessários (código deve ser auto-explicativo)

### Testes
- Testes unitários obrigatórios para lógica de negócio
- Testes de integração para APIs
- Coverage mínimo: 70%
- Use `jest` ou equivalente

### Organização de Código

#### Backend
```
src/
├── domain/           # Entidades de negócio
├── application/      # Use cases
├── infrastructure/   # Banco, cache, etc
├── presentation/     # Controllers/Routes
└── shared/          # Utilities, middlewares
```

#### Frontend
```
src/
├── pages/            # Páginas
├── components/       # Componentes reutilizáveis
├── services/         # Chamadas de API
├── hooks/            # Custom hooks
├── context/          # Context API
└── utils/            # Utilities
```

## Comandos Principais

```bash
# Desenvolvimento
pnpm dev                # Start all apps
pnpm dev -F @app/backend   # Start specific app

# Validação
pnpm lint              # Lint check
pnpm lint:fix          # Fix lint issues
pnpm typecheck         # Type checking
pnpm format:check      # Format check
pnpm format            # Auto format

# Testes
pnpm test              # Run all tests
pnpm test:watch        # Watch mode

# Build
pnpm build             # Build all apps

# Docker
docker-compose up -d   # Start infrastructure
```

## Guias de Implementação

### Adicionando Nova Funcionalidade

1. **Crie branch:** `git checkout -b feat/feature-name`
2. **Atualize tipos:** Defina interfaces/types primeiro
3. **Implemente backend:** APIs, validações, testes
4. **Implemente frontend:** Componentes, integração com API
5. **Teste tudo:** Unit + Integration + Manual
6. **Documente:** README, API docs
7. **Commit:** Seguindo conventional commits
8. **Push + PR:** Aguarde validações CI/CD

### Código Production-Ready

Checklist antes de merge:
- [ ] TypeScript compila sem erros
- [ ] Testes passam (coverage > 70%)
- [ ] Linting passa
- [ ] Código formatado
- [ ] Sem console.log ou debug
- [ ] Variáveis de ambiente documentadas
- [ ] Breaking changes documentadas
- [ ] Migrations do BD (se necessário)

## Observabilidade

### Logs Estruturados
- Use logger estruturado (winston, pino)
- Formato: JSON com timestamp, level, message, context
- Níveis: error, warn, info, debug

### Métricas
- Registrar tempo de resposta
- Contar requisições por endpoint
- Monitorar falhas

### Tracing
- Implementar correlation IDs
- Rastrear requisições distribuídas

## Segurança

- [ ] Validar todas as entradas
- [ ] Hash senhas com bcrypt
- [ ] JWT com expiração
- [ ] CORS configurado
- [ ] SQL injection protection (usar ORM)
- [ ] Sem secrets em código
- [ ] Usar .env para configurações

## Performance

- Cache Redis para listas/queries frequentes
- Índices no banco de dados
- Lazy loading no frontend
- Code splitting
- Pagination para listas grandes

## Documentação

Mantenha atualizado:
- `README.md` - Como rodar o projeto
- `docs/api/` - Endpoints da API
- `docs/architecture/` - Decisões arquiteturais
- `docs/database/` - Schema e migrations

## Quando Pedir Ajuda

Mencione explicitamente:
- Arquivo e linha relevante: `src/file.ts:42`
- Erro completo
- O que você já tentou
- Contexto do problema

## Preferências de Claude Code

### Ao Fazer Edições
- Prefira `Edit` para modificações pequenas
- Prefira `Write` para criar novos arquivos
- Sempre use ferramentas especializadas (Grep, Glob) antes de Bash

### Ao Debugar
- Leia o erro completamente
- Procure patterns similares no codebase
- Considere side effects

### Ao Implementar
- Não abstraia prematuramente
- Prefira código explícito a genérico
- Delete código não utilizado

## Referências

- [Clean Code](docs/patterns/clean-code.md)
- [API Documentation](docs/api/)
- [Architecture Decisions](docs/architecture/)
- [Testing Guide](docs/testing/)
