# Etapa base: Node + pnpm
FROM node:26-alpine AS base
RUN npm install -g pnpm@11.1.2
WORKDIR /app

# Etapa de dependencias: solo se reejecuta si cambian package.json o el lock
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --dangerously-allow-all-builds

# Etapa de desarrollo: código con hot-reload vía tsx watch
FROM base AS dev
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["pnpm", "dev"]
