# Etapa 1: Build da aplicação
FROM node:20-alpine AS build

WORKDIR /app

# Instalar dependências necessárias para compilação
RUN apk add --no-cache python3 make g++

# Copiar arquivos de configuração primeiro
COPY package*.json ./
COPY bun.lockb ./
COPY tsconfig*.json ./
COPY .env ./

# Instalar todas as dependências, incluindo o Mercado Pago
RUN npm install
RUN npm install mercadopago sonner @types/node --save

# Copiar o resto dos arquivos
COPY . .

# Construir a aplicação
RUN npm run build

# Etapa 2: Imagem para produção
FROM node:20-alpine

WORKDIR /app

# Copiar arquivos necessários para produção
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./
COPY --from=build /app/package-lock.json ./
COPY --from=build /app/.env ./

# Instalar apenas dependências de produção
RUN npm install --production
RUN npm install mercadopago --save

# Configurar variáveis de ambiente para o Mercado Pago
ENV NODE_ENV=production
ENV PORT=8511

EXPOSE 8511

# Iniciar a aplicação
CMD ["npm", "start"]
