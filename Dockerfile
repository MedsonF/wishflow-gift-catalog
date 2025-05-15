# Etapa 1: Build da aplicação
FROM node:20-alpine AS build

WORKDIR /app

# Instalar dependências do PostgreSQL
RUN apk add --no-cache postgresql-client postgresql-dev python3 make g++

COPY package*.json ./
COPY bun.lockb ./

# Instalar dependências incluindo pg e tipos
RUN npm install
RUN npm install pg @types/pg @types/node tsx --save

COPY . .

# Variáveis de ambiente para conexão com o PostgreSQL
ENV POSTGRES_USER=postgres \
    POSTGRES_HOST=chat_quadrobd \
    POSTGRES_DB=lista \
    POSTGRES_PASSWORD=OvHsBEvEUzcHa6otaqHadimeOFDt3qfb \
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
COPY --from=build /app/src/scripts/migrate-to-postgres.ts ./src/scripts/
COPY migrate.sh .

# Tornar o script de migração executável
RUN chmod +x migrate.sh

# Instalar serve e pg para produção
RUN npm install serve pg tsx --omit=dev

# Variáveis de ambiente para produção
ENV PORT=8511 \
    POSTGRES_USER=postgres \
    POSTGRES_HOST=chat_quadrobd \
    POSTGRES_DB=lista \
    POSTGRES_PASSWORD=OvHsBEvEUzcHa6otaqHadimeOFDt3qfb \
    POSTGRES_PORT=5432

EXPOSE 8511

# Executar migração e depois iniciar o servidor
CMD ["sh", "-c", "./migrate.sh && npx serve -s dist -l 8511"]
