FROM node:latest

# Criação do diretório de trabalho
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
 
# Copia do package.json e package-lock.json (se existir) para o diretório de trabalho
COPY package*.json /usr/src/app/

# Listagem de arquivos após copiar o package.json
RUN ls -l /usr/src/app/

# Copia do app.json para o diretório de trabalho e instalação de dependências
RUN npm install
RUN yarn

# Instalação global do expo-cli
RUN yarn global add expo-cli

# Exposição de portas utilizadas pelo Expo
EXPOSE 3000

# Faz Login no expo &&
# Comando padrão para iniciar o serviço com geração do QR Code
CMD yarn run start
