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

COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./
COPY --from=build /app/package-lock.json ./

RUN npm install serve --omit=dev

ENV PORT=8511
EXPOSE 8511

CMD ["npx", "serve", "-s", "dist", "-l", "8511"]
