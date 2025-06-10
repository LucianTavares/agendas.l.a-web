FROM node:18-alpine

# Instalar dependências necessárias
RUN apk add --no-cache \
    openssl \
    openssl-dev \
    postgresql-client \
    netcat-openbsd

WORKDIR /app

# Instalar PNPM globalmente
RUN npm install -g pnpm@10.11.1

# Comando para iniciar em modo de desenvolvimento
CMD ["pnpm", "dev"] 