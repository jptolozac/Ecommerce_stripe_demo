FROM node:22-alpine AS build
RUN corepack enable
WORKDIR /repo

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY frontend/package.json frontend/
RUN pnpm install --frozen-lockfile --filter frontend...

COPY frontend/ frontend/

ARG VITE_BACKEND_URL=/api
RUN VITE_BACKEND_URL=$VITE_BACKEND_URL pnpm run build


FROM nginx/nginx-unprivileged:stable-alpine

COPY --from=build --chown=nginx:nginx /repo/frontend/dist/ /usr/share/nginx/html/
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080