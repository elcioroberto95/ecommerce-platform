# Shared base: workspace dependencies + source. `dev` and `builder` branch off it.
FROM node:20-bookworm-slim AS deps

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/package.json

RUN pnpm install --frozen-lockfile

COPY apps/backend ./apps/backend


# Development target: `tsx watch` with the inspector, used by docker-compose.dev.yml.
FROM deps AS dev

WORKDIR /app/apps/backend

EXPOSE 3000 9230

CMD ["pnpm", "run", "dev"]


FROM deps AS builder

RUN pnpm --filter backend run build


FROM node:20-bookworm-slim AS runner

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

RUN corepack enable

ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/package.json

RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/prisma ./apps/backend/prisma
COPY --from=builder /app/apps/backend/prisma.config.ts ./apps/backend/prisma.config.ts

WORKDIR /app/apps/backend

EXPOSE 3000

CMD ["pnpm", "start"]
