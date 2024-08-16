# Etapa 1: Build da aplicação
FROM node:18-alpine AS builder

# Definindo o diretório de trabalho
WORKDIR /app

# Copiando o package.json e o package-lock.json
COPY package*.json ./

# Instalando as dependências
RUN npm install

# Copiando o restante dos arquivos da aplicação
COPY . .

ENV NEXT_PUBLIC_ESLINT_IGNORE=1

# Compilando o projeto Next.js
RUN npm run build

# Instalando apenas as dependências de produção
RUN npm prune --production

# Etapa 2: Configuração da imagem final
FROM node:18-alpine

# Definindo o diretório de trabalho
WORKDIR /app

# Copiando as dependências e o código compilado da etapa de build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./

# Expondo a porta
EXPOSE 3000

# Comando para rodar a aplicação Next.js
CMD ["npm", "start"]
