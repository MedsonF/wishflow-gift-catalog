# Etapa 1: Build da aplicação
FROM node:20-alpine AS build

WORKDIR /app

# Instalar dependências do PostgreSQL
RUN apk add --no-cache postgresql-client postgresql-dev python3 make g++

COPY package*.json ./
COPY bun.lockb ./

# Instalar dependências incluindo pg e tipos
RUN npm install
RUN npm install tsx @types/node dotenv pg @types/pg --save
RUN npm install -g tsx

COPY . .

# Variáveis de ambiente para conexão com o PostgreSQL
ENV POSTGRES_USER=postgres \
    POSTGRES_HOST=panel.primeassessoria.shop \
    POSTGRES_DB=lista \
    POSTGRES_PASSWORD=OvHsBEvEUzcHa6otaqHadimeOFDt3qfb \
    POSTGRES_PORT=5500 \
    NODE_ENV=production

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
COPY --from=build /app/src ./src
COPY --from=build /app/node_modules ./node_modules
COPY migrate.sh .

# Tornar o script de migração executável
RUN chmod +x migrate.sh

# Instalar serve e tsx
RUN npm install -g serve
RUN npm install tsx --save
RUN npm install -g tsx

# Variáveis de ambiente para produção
ENV PORT=8511 \
    POSTGRES_USER=postgres \
    POSTGRES_HOST=panel.primeassessoria.shop \
    POSTGRES_DB=lista \
    POSTGRES_PASSWORD=OvHsBEvEUzcHa6otaqHadimeOFDt3qfb \
    POSTGRES_PORT=5500 \
    NODE_ENV=production \
    PATH="/app/node_modules/.bin:${PATH}"

EXPOSE 8511

# Executar migração e depois iniciar o servidor
CMD ["sh", "-c", "./migrate.sh && npx serve -s dist -l 8511"]
