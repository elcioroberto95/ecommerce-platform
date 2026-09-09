FROM node:20-bookworm-slim AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/frontend/package.json ./apps/frontend/package.json

RUN pnpm install --frozen-lockfile

COPY apps/frontend ./apps/frontend

# NEXT_PUBLIC_* vars are inlined at build time, so they must be passed as build args.
# The browser calls the API, so this URL must be reachable from the host machine,
# not from inside the Docker network.
ARG NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
ARG NEXT_PUBLIC_APP_URL=http://localhost:3001
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_TELEMETRY_DISABLED=1

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
