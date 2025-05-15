# Etapa 1: Build da aplicação
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar dependências necessárias para compilação
RUN apk add --no-cache python3 make g++

# Definir argumentos de build
ARG NEXT_PUBLIC_MERCADO_PAGO_ACCESS_TOKEN
ARG NEXT_PUBLIC_SITE_URL

# Definir variáveis de ambiente para o build
ENV NEXT_PUBLIC_MERCADO_PAGO_ACCESS_TOKEN=$NEXT_PUBLIC_MERCADO_PAGO_ACCESS_TOKEN
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NODE_ENV=production

# Copiar arquivos de configuração primeiro
COPY package*.json ./
COPY bun.lockb ./
COPY tsconfig*.json ./
COPY vite.config.ts ./

# Instalar todas as dependências
RUN npm install
RUN npm install -D vite @vitejs/plugin-react @vitejs/plugin-react-swc @types/node mercadopago sonner

# Copiar o resto dos arquivos
COPY . .

# Construir a aplicação Vite
RUN npm run build

# Etapa 2: Servir a aplicação
FROM node:20-alpine

WORKDIR /app

# Instalar serve para servir os arquivos estáticos
RUN npm install -g serve

# Copiar os arquivos de build
COPY --from=builder /app/dist ./dist

# Definir variáveis de ambiente para produção
ENV NODE_ENV=production
ENV PORT=8511

EXPOSE 8511

# Iniciar o servidor
CMD ["serve", "-s", "dist", "-l", "8511"]
