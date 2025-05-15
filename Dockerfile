# Etapa 1: Build da aplicação
FROM node:20-alpine AS build

WORKDIR /app

# Instalar dependências necessárias para compilação
RUN apk add --no-cache python3 make g++

# Definir argumentos de build
ARG NEXT_PUBLIC_MERCADO_PAGO_ACCESS_TOKEN
ARG NEXT_PUBLIC_SITE_URL

# Definir variáveis de ambiente para o build
ENV NEXT_PUBLIC_MERCADO_PAGO_ACCESS_TOKEN=$NEXT_PUBLIC_MERCADO_PAGO_ACCESS_TOKEN
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

# Copiar arquivos de configuração primeiro
COPY package*.json ./
COPY bun.lockb ./
COPY tsconfig*.json ./

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

# Definir argumentos de build novamente para a etapa de produção
ARG NEXT_PUBLIC_MERCADO_PAGO_ACCESS_TOKEN
ARG NEXT_PUBLIC_SITE_URL

# Definir variáveis de ambiente para produção
ENV NEXT_PUBLIC_MERCADO_PAGO_ACCESS_TOKEN=$NEXT_PUBLIC_MERCADO_PAGO_ACCESS_TOKEN
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NODE_ENV=production
ENV PORT=8511

# Copiar arquivos necessários para produção
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./
COPY --from=build /app/package-lock.json ./

# Instalar apenas dependências de produção
RUN npm install --production
RUN npm install mercadopago --save

EXPOSE 8511

# Iniciar a aplicação
CMD ["npm", "start"]
