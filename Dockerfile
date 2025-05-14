# Etapa 1: Build da aplicação
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY bun.lockb ./
COPY . .

RUN npm install
RUN npm run build

# Etapa 2: Imagem para produção, usando 'serve'
FROM node:20-alpine

WORKDIR /app

# Só precisa do dist e do serve para rodar em produção
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./
COPY --from=build /app/package-lock.json ./

# Instala só o 'serve' (não instala dependências do projeto React)
RUN npm install serve --omit=dev

# Porta padrão do 'serve' (ajuste se necessário)
ENV PORT=8511

EXPOSE 8511

CMD ["npx", "serve", "-s", "dist", "-l", "8511"]
