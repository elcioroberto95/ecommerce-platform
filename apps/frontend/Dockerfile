# Shared base: workspace dependencies + source. `dev` and `builder` branch off it.
FROM node:20-bookworm-slim AS deps

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/frontend/package.json ./apps/frontend/package.json

RUN pnpm install --frozen-lockfile

COPY apps/frontend ./apps/frontend

ENV NEXT_TELEMETRY_DISABLED=1


# Development target: `next dev` with Fast Refresh, used by docker-compose.dev.yml.
# socat publishes the inspector: `next dev` renders in a forked child that Node
# always binds to 127.0.0.1, so the port has to be proxied to reach the host.
FROM deps AS dev

RUN apt-get update   && apt-get install -y --no-install-recommends socat   && rm -rf /var/lib/apt/lists/*

WORKDIR /app/apps/frontend

EXPOSE 3001 9229

CMD ["pnpm", "run", "dev"]


FROM deps AS builder

# NEXT_PUBLIC_* vars are inlined at build time, so they must be passed as build args.
# The browser calls the API, so this URL must be reachable from the host machine,
# not from inside the Docker network.
ARG NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
ARG NEXT_PUBLIC_APP_URL=http://localhost:3001
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

RUN pnpm --filter @app/frontend run build


FROM node:20-bookworm-slim AS runner

WORKDIR /app

RUN corepack enable

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3001

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/frontend/package.json ./apps/frontend/package.json

RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/apps/frontend/.next ./apps/frontend/.next
COPY --from=builder /app/apps/frontend/next.config.js ./apps/frontend/next.config.js

WORKDIR /app/apps/frontend

EXPOSE 3001

CMD ["pnpm", "start"]
