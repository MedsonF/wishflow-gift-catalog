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
COPY next.config.js ./

# Instalar todas as dependências
RUN npm install
RUN npm install mercadopago sonner @types/node --save

# Copiar o resto dos arquivos
COPY . .

# Construir a aplicação Next.js
RUN npm run build

# Etapa 2: Imagem para produção
FROM node:20-alpine AS runner

WORKDIR /app

# Definir argumentos de build novamente para a etapa de produção
ARG NEXT_PUBLIC_MERCADO_PAGO_ACCESS_TOKEN
ARG NEXT_PUBLIC_SITE_URL

# Definir variáveis de ambiente para produção
ENV NEXT_PUBLIC_MERCADO_PAGO_ACCESS_TOKEN=$NEXT_PUBLIC_MERCADO_PAGO_ACCESS_TOKEN
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NODE_ENV=production
ENV PORT=8511

# Não executar como root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar arquivos necessários do builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json

# Copiar o resultado do build do Next.js
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Instalar apenas dependências de produção
RUN npm install --production
RUN npm install mercadopago --save

# Configurar permissões
RUN chown -R nextjs:nodejs /app

# Mudar para o usuário não-root
USER nextjs

EXPOSE 8511

# Iniciar a aplicação
CMD ["node", "server.js"]
