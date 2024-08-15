FROM node:21-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
COPY --chown=node:node . .

EXPOSE 8080

CMD [ "npm", "run", "dev" ]