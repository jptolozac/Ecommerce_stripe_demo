FROM node:22-slim AS build
RUN corepack enable                      # trae pnpm sin instalarlo a mano
WORKDIR /repo

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY backend/package.json backend/
RUN pnpm install --frozen-lockfile --filter backend...

COPY backend/ backend/

RUN pnpm --filter backend deploy --legacy --prod /out


FROM node:22-slim
WORKDIR /app

COPY --from=build --chown=node:node /out .
USER node

EXPOSE 3000

CMD ["node", "src/index.js"]
