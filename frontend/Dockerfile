# FROM node:18-alpine

# WORKDIR /app

# COPY package.json package-lock.json ./

# RUN npm install

# COPY . .

# EXPOSE 3000

# Etapa 1: build com Vite
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Gera os arquivos de produção com Vite
RUN npm run build && ls -la /app/dist

# Etapa 2: servir com NGINX
FROM nginx:alpine

# Remove a configuração default do NGINX
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos gerados pelo Vite
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia config custom do NGINX
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor a porta padrão do NGINX
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]




