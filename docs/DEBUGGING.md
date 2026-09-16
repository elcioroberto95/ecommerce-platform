# 🔍 Debugando o projeto

Dois modos de rodar, com propósitos diferentes:

| Modo | Comando | Pra quê |
|---|---|---|
| Produção | `docker compose up --build -d` | Validar o que vai pro ar: build otimizado, SSR real, sem watch |
| Desenvolvimento | `docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build` | Programar: Fast Refresh, overlay de erro, log de fetch, breakpoints |

O overlay de dev é um arquivo separado (não `docker-compose.override.yml`) de propósito: `docker compose up` continua exercitando o build de produção.

---

## 1. A pergunta que define onde procurar

**Onde esse código roda?** A fronteira é a diretiva `'use client'`.

| Roda em | Exemplos no projeto | Onde aparece |
|---|---|---|
| Servidor (Node no container) | `app/page.tsx`, `app/products/**`, `generateMetadata`, `services/products.server.ts` | `docker compose logs -f frontend` |
| Browser | `ProductFilters`, `AddToCart*`, `CartContext`, `AuthContext` | DevTools do browser |

> `console.log` dentro de um Server Component **nunca** aparece no console do browser. Ele sai no log do container.

---

## 2. Ver as requisições

O catálogo é buscado pelo servidor, então essas chamadas não passam pela aba Network. Em dev, o Next loga cada uma (`logging.fetches.fullUrl` no `next.config.js`):

```bash
docker compose logs -f frontend
```

```
GET /products?inStock=true 200 in 340ms
 │ GET http://backend:3000/api/v1/categories?limit=250 200 in 12ms (cache skip)
 │ │ Cache skipped reason: (cache: no-store)
 │ GET http://backend:3000/api/v1/products?page=1&limit=12 200 in 88ms (cache skip)
```

A indentação mostra quais fetches pertencem a qual render. `cache skip` é esperado: `lib/server-api.ts` usa `no-store` de propósito (preço e estoque mudam a cada request).

No DevTools sobram: o documento HTML, os payloads RSC (`?_rsc=`) da navegação client-side, e as chamadas realmente client (carrinho e login, via axios).

---

## 3. Breakpoints

Portas do inspector no modo dev:

| Processo | Host | Como |
|---|---|---|
| Next (servidor) | `localhost:9229` | VS Code → `Attach: Next server (Docker 9229)` |
| Backend API | `localhost:9230` | VS Code → `Attach: backend API (Docker 9230)` |
| Client | — | `Launch: Chrome on the app`, ou o DevTools direto |

As configs estão em `.vscode/launch.json`, com `localRoot`/`remoteRoot` mapeando `apps/frontend` ↔ `/app/apps/frontend` — sem isso o breakpoint não casa com o arquivo.

Sem VS Code: abra `chrome://inspect`, adicione `localhost:9229` e `localhost:9230` em *Discover network targets*.

Verificar se o inspector está de pé:

```bash
curl -s http://localhost:9229/json/version
curl -s http://localhost:9230/json/version
```

### Por que tem um socat no meio

`next dev` não renderiza no processo do CLI: ele dá `fork` num filho e passa `--inspect=<porta do CLI + 1>`, que o Node **sempre** liga em `127.0.0.1` — inalcançável de fora do container. Então: CLI em 9300, servidor real em 9301, e um `socat` republica 9301 em `0.0.0.0:9229`.

Dois detalhes que quebram se mexer:

- A flag vai em `NODE_OPTIONS`, nunca na linha de comando: `fork` herda o `execArgv` do pai e os dois processos brigam pela mesma porta.
- O valor tem que ser **só o número** (`--inspect=9300`). O Next faz `parseInt()` nele; com `0.0.0.0:9229` o resultado é `0` e o filho recebe `--inspect=1`, que é inválido.

---

## 4. Confirmar que uma rota é mesmo SSR

O jeito mais direto — se o dado está no HTML cru, veio do servidor:

```bash
curl -s http://localhost:3001/ | grep -o 'line-clamp-2 mb-2">[^<]*'
```

E a saída do `next build` classifica cada rota: `○` estático, `ƒ` dinâmico (renderizado a cada request). Confira ali antes de assumir que uma página é SSR.

---

## 5. Erros

- **Erro de render em dev**: overlay no browser, com stack apontando pro `.tsx`.
- **Erro em produção**: só o log do container. Um `error.tsx` por segmento evita a tela branca e dá um botão de retry.
- **`notFound()`**: devolve 404 de verdade **desde que** o segmento não tenha `loading.tsx`. Com o boundary de Suspense o Next já mandou o shell com 200 e o status não muda mais (foi por isso que `/products` não tem `loading.tsx`).

---

## 6. Armadilhas do ambiente

- **Windows + Docker**: eventos de arquivo não atravessam o bind mount. Por isso `WATCHPACK_POLLING` (Next) e `CHOKIDAR_USEPOLLING` (tsx) estão ligados no overlay de dev — sem eles, nada recompila.
- **Só `src/` e os configs são montados.** Mexeu em `package.json` ou instalou dependência? Rebuild: `docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build`.
- **`@types/react` duplicado** no workspace (18.3.31 e 19.2.17). Importe `ReactNode` de `'react'`; usar o namespace global `React.ReactNode` gera erro de tipo entre as duas cópias.
