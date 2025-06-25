FROM node:20-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

RUN npm install fastify @fastify/websocket

COPY src ./src

EXPOSE 4000

CMD ["node", "src/index.js"]
