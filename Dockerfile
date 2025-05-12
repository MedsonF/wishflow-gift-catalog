# Etapa 1: Build da aplicação
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY bun.lockb ./
COPY . .

RUN npm install
RUN npm run build

# Etapa 2: Servir arquivos estáticos com nginx
FROM nginx:alpine

# Remove o arquivo default do nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia o build do Vite para o nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copia um arquivo de configuração customizado do nginx, se necessário
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 8511

CMD ["nginx", "-g", "daemon off;"]
