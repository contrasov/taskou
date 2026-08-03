FROM node:20-alpine

WORKDIR /app

# Copia dependências primeiro (aproveita cache do Docker)
COPY package*.json ./
RUN npm install

# Copia o restante do código
COPY . .

# Gera o Prisma Client e compila a aplicação NestJS
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

# Executa o servidor NestJS
CMD ["node", "dist/src/main.js"]
