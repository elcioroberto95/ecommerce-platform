# Exemplos de Uso dos Agentes

Guia prático para usar os agentes definidos no `agents.md`.

## Fluxo de Desenvolvimento Típico

### 1. Iniciar uma Nova Feature

```bash
# Criar branch
git checkout -b feat/nova-feature

# Iniciar infraestrutura (terminal 1)
docker-compose up -d

# Iniciar desenvolvimento (terminal 2)
pnpm dev
```

**Agentes envolvidos:**
- Local Development Agent: Inicializa ambiente
- Code Quality Agent: Monitora mudanças

### 2. Implementar Feature

```bash
# Trabalhar no código
# A cada mudança, os agentes validam:

# Code Quality Agent valida automaticamente
pnpm lint:fix
pnpm typecheck

# Format Agent formata código
pnpm format
```

### 3. Antes de Commitar

```bash
# Pre-commit Agent verifica:
pnpm lint              # Sem erros de linting
pnpm format:check      # Código formatado
pnpm typecheck         # Sem erros de tipo

# Se houver erros, corrija:
pnpm lint:fix
pnpm format
```

### 4. Fazer Commit

```bash
# Commit com conventional commit
git commit -m "feat(orders): add new order status endpoint"

# Ou use commitizen se disponível
```

### 5. Executar Testes

```bash
# Testing Agent executa testes
pnpm test

# Ou específico para um app
cd apps/backend
pnpm test:watch
```

### 6. Push e Pull Request

```bash
# Push para origin
git push origin feat/nova-feature

# Criar PR no GitHub
# PR Validation Agent automaticamente:
# - Roda build
# - Roda testes
# - Valida linting
# - Verifica types
```

## Casos de Uso Específicos

### Quando Adicionar Validação de API

1. Implemente endpoint no backend:
```bash
cd apps/backend
# Adicionar validação em src/presentation/controllers/
# Adicionar tipo em src/domain/
```

2. Teste localmente:
```bash
# Testar com curl, Postman, ou cliente da API
curl -X GET http://localhost:3000/api/orders
```

3. Code Quality Agent valida:
```bash
pnpm typecheck    # Tipos corretos
pnpm lint         # Sem erros de linting
```

4. Testing Agent valida:
```bash
pnpm test         # Testes passam
```

### Quando Adicionar Componente React

1. Crie componente no frontend:
```bash
cd apps/frontend
# Criar componente em src/components/
# Adicionar hook em src/hooks/ se necessário
```

2. Integre com API:
```typescript
// src/services/api.ts
export const getOrders = async () => {
  const response = await fetch(`${API_URL}/orders`);
  return response.json();
};
```

3. Use em página:
```typescript
// src/pages/Orders.tsx
import { useOrders } from '../hooks/useOrders';

export function Orders() {
  const { data, loading } = useOrders();
  // ...
}
```

### Quando Fazer Deploy

**Pre-deployment Agent verifica:**

```bash
# Build Verification
pnpm build                 # Sem erros

# Testing
pnpm test                  # 100% passing

# Linting
pnpm lint                  # Sem warnings

# Database
# Verificar migrations rodaram
# Verificar schema está correto

# Environment
# Verificar todas as env vars estão definidas
```

## Automações com Agentes

### Automação 1: Validar PRs Automaticamente

**Trigger:** Quando PR é criada

**Agente:** PR Validation Agent

**Ações:**
1. Faz checkout da branch
2. Instala dependências
3. Roda `pnpm lint`
4. Roda `pnpm typecheck`
5. Roda `pnpm build`
6. Roda `pnpm test`
7. Comenta resultado no PR

**Exemplo de resultado:**
```
✅ Lint: PASSED
✅ Type checking: PASSED
✅ Build: PASSED
✅ Tests: PASSED (42/42)
✅ Coverage: 75%

Aprovado para merge!
```

### Automação 2: Validar Antes de Commit

**Trigger:** Antes de `git commit`

**Agente:** Pre-commit Agent

**Ações:**
1. Formata código
2. Lint check
3. Type checking
4. Se passar, permite commit
5. Se falhar, mostra erros

### Automação 3: Deploy Automático

**Trigger:** Merge para `master`

**Agente:** Pre-deployment Agent

**Ações:**
1. Executa testes
2. Build da imagem Docker
3. Push para registry
4. Deploy para ambiente

## Monitorando Agentes

### Ver Status de um Agente

```bash
# Ver agentes rodando
ps aux | grep -E 'agent|worker'

# Ver logs de agente específico
tail -f logs/agents/validation-agent.log
```

### Debugar Agente

Se um agente falhar:

1. Verifique logs
2. Execute comando manualmente
3. Corrija o problema
4. Re-execute agente

Exemplo:
```bash
# Se Pre-commit Agent falhar
pnpm format           # Formata
pnpm lint:fix         # Fixa linting
pnpm typecheck        # Verifica tipos

# Agora tente novamente
git commit -m "..."
```

## Customizando Agentes

### Adicionar Novo Validador

1. Edite `.claude/agents.md`
2. Adicione seção `### New Validator Agent`
3. Define script a executar
4. Define trigger

Exemplo:
```markdown
### Security Scan Agent
**Objetivo:** Verificar vulnerabilidades

\`\`\`bash
npm audit
\`\`\`

**Trigger:** Antes de deploy
```

### Modificar Frequência de Agente

Edite `.claude/settings.json`:

```json
{
  "hooks": {
    "before-commit": {
      "enabled": true,
      "frequency": "always"
    }
  }
}
```

## Troubleshooting

### Agente não executa
- [ ] Verificar se hook está ativado em settings.json
- [ ] Verificar if comando existe
- [ ] Verificar permissões do arquivo

### Agente falha intermitentemente
- [ ] Verificar se há race conditions
- [ ] Verificar dependências do agente
- [ ] Ver logs de erro completos

### Agente é lento
- [ ] Otimizar comando
- [ ] Executar apenas o necessário
- [ ] Considerar executar em paralelo

## Integração com CI/CD

Agentes podem ser integrados com GitHub Actions:

```yaml
# .github/workflows/validate.yml
name: Validate

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      
      # Code Quality Agent
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm typecheck
      
      # Testing Agent
      - run: pnpm test
      
      # Build Verification Agent
      - run: pnpm build
```

Os mesmos agentes podem ser usados localmente e em CI/CD para consistência.
