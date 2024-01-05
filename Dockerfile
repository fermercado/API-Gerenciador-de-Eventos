# Escolha a imagem de base
FROM node:20.10.0

# Defina o diretório de trabalho no container
WORKDIR /usr/src/app

# Copie os arquivos de dependência
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie os arquivos do projeto
COPY . .

# Compile os arquivos TypeScript
RUN npm run build

# Abra a porta que a aplicação vai usar
EXPOSE 3000

# Defina o comando para rodar a aplicação
CMD ["node", "src/app.js"]
