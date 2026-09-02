# 🐳 Setup Completo com Docker Compose

Guia para rodar o projeto inteiro: Backend + Frontend + PostgreSQL + Redis

---

## 🚀 Quick Start (Recomendado)

### 1️⃣ Build e Start tudo

```bash
# Parar containers anteriores (se houver)
docker-compose down -v

# Build e start
docker-compose up --build

# Em outro terminal, rodar seeds
docker-compose exec backend npm run seed
```

**Pronto!** Acesse:
- 🌐 Frontend: http://localhost:3001
- 🔌 Backend API: http://localhost:3000
- 🐘 PostgreSQL: localhost:5432
- 💾 Redis: localhost:6379

---

## 📋 Serviços Disponíveis

### Backend (Node.js + Express)
```
Port: 3000
Database: PostgreSQL (via docker)
Cache: Redis (via docker)
Status: http://localhost:3000/health
```

### Frontend (Next.js)
```
Port: 3001
API URL: http://backend:3000/api (within Docker)
         http://localhost:3000/api (from host)
```

### PostgreSQL
```
Host: postgres (from Docker) / localhost (from host)
Port: 5432
User: ecommerce
Password: ecommerce
Database: ecommerce
```

### Redis
```
Host: redis (from Docker) / localhost (from host)
Port: 6379
```

---

## 🔧 Comandos Úteis

### Backend

```bash
# Seed database com dados iniciais
docker-compose exec backend npm run seed

# Reset completo (deletar + recriar dados)
docker-compose exec backend npm run db:reset

# Prisma migrations
docker-compose exec backend npm run db:migrate

# Ver logs
docker-compose logs -f backend

# Executar comando específico
docker-compose exec backend npm run lint
```

### Frontend

```bash
# Rebuild frontend
docker-compose up --build frontend

# Ver logs
docker-compose logs -f frontend
```

### Database

```bash
# Acessar PostgreSQL
docker-compose exec postgres psql -U ecommerce -d ecommerce

# Resetar database
docker-compose exec postgres dropdb -U ecommerce ecommerce
docker-compose exec postgres createdb -U ecommerce ecommerce
```

---

## 📦 Dados de Seed

O arquivo `apps/backend/scripts/seed.ts` cria:

- **3 Categories**: Electronics, Accessories, Home
- **10 Products**: Com preços, imagens, ratings variados
- **Stock realista**: Alguns com estoque baixo, um com 0

Para customizar seeds, edite `apps/backend/scripts/seed.ts`

---

## 🌍 Variáveis de Ambiente

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### Backend (.env no docker-compose)
```
DATABASE_URL=postgresql://ecommerce:ecommerce@postgres:5432/ecommerce
REDIS_URL=redis://redis:6379
JWT_SECRET=dev-secret
LOG_LEVEL=info
```

---

## 🐛 Troubleshooting

### Port already in use
```bash
# Liberar porta
docker-compose down

# Ou usar porta diferente
docker-compose -f docker-compose.yml -p custom up
```

### Database error
```bash
# Limpar volumes
docker-compose down -v

# Reconstruir
docker-compose up --build
docker-compose exec backend npm run seed
```

### Frontend não conecta ao backend
Verificar:
- Backend está rodando: `docker-compose logs backend`
- URL correta em `.env.local`: `http://localhost:3000/api`
- Rede Docker correta

### Redis connection error
```bash
# Resetar Redis
docker-compose restart redis
```

---

## 📊 Arquitetura

```
┌─────────────────────────────────────────────┐
│         Docker Network (ecommerce)          │
├─────────────────────────────────────────────┤
│                                             │
│  Frontend (Next.js)                         │
│  ├─ Port: 3001                              │
│  └─ API URL: http://backend:3000/api        │
│                                             │
│  Backend (Express)                          │
│  ├─ Port: 3000                              │
│  ├─ DB: postgresql://postgres:5432          │
│  └─ Cache: redis://redis:6379               │
│                                             │
│  PostgreSQL                                 │
│  ├─ Port: 5432                              │
│  └─ Volume: postgres_data                   │
│                                             │
│  Redis                                      │
│  └─ Port: 6379                              │
│                                             │
└─────────────────────────────────────────────┘

           Host Machine
    (acesso via localhost:3001)
```

---

## ✅ Checklist

- [ ] Docker e Docker Compose instalados
- [ ] `docker-compose up --build` rodou sem erros
- [ ] Backend respondendo em http://localhost:3000
- [ ] Frontend acessível em http://localhost:3001
- [ ] Database seed executado: `npm run seed`
- [ ] Produtos aparecendo no frontend
- [ ] Login/Register funcionando
- [ ] Carrinho sincronizado com backend

---

## 🎯 Próximas Fases

Agora com dados reais, continuar:
- [ ] Phase 4: Cart & Checkout
- [ ] Phase 5: Account features
- [ ] Phase 6: Tests
- [ ] Phase 7: Deploy

---

**Agora SIM! 🔥 Projeto tá DAORA com dados reais!**
