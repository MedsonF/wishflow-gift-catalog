# Etapa 1: Build da aplicação
FROM node:20-alpine AS build

WORKDIR /app

# Instalar dependências do PostgreSQL
RUN apk add --no-cache postgresql-client postgresql-dev python3 make g++

COPY package*.json ./
COPY bun.lockb ./

# Instalar dependências incluindo pg e tipos
RUN npm install
RUN npm install pg @types/pg @types/node --save

COPY . .

# Variáveis de ambiente para conexão com o PostgreSQL
ENV POSTGRES_USER=postgres \
    POSTGRES_HOST=postgres \
    POSTGRES_DB=wishflow_gift_catalog \
    POSTGRES_PASSWORD=postgres \
    POSTGRES_PORT=5432

RUN npm run build

# Etapa 2: Imagem para produção, usando 'serve'
FROM node:20-alpine

WORKDIR /app

# Instalar cliente PostgreSQL na imagem de produção
RUN apk add --no-cache postgresql-client

# Copiar arquivos necessários
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./
COPY --from=build /app/package-lock.json ./

# Instalar serve e pg para produção
RUN npm install serve pg --omit=dev

# Variáveis de ambiente para produção
ENV PORT=8511 \
    POSTGRES_USER=postgres \
    POSTGRES_HOST=postgres \
    POSTGRES_DB=wishflow_gift_catalog \
    POSTGRES_PASSWORD=postgres \
    POSTGRES_PORT=5432

EXPOSE 8511

CMD ["npx", "serve", "-s", "dist", "-l", "8511"]
