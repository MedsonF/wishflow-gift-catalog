# Etapa 1: Build da aplicação
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY bun.lockb ./
COPY . .

RUN npm install
RUN npm run build

# Etapa 2: Imagem para produção
FROM node:20-alpine

WORKDIR /app

# Copia apenas o build e dependências necessárias para produção
COPY package*.json ./
COPY bun.lockb ./
RUN npm install --omit=dev

COPY --from=build /app/dist ./dist

# Copie outros arquivos necessários, por exemplo, server.js ou app.js
COPY --from=build /app/server.js ./
# (ajuste o nome do arquivo de entrada conforme sua aplicação)

# Defina a porta que sua aplicação escuta (ajuste conforme necessário)
ENV PORT=8511

EXPOSE 8511

CMD ["node", "server.js"]
