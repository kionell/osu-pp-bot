FROM node:lts as base

WORKDIR /

COPY package*.json ./

RUN npm i

COPY . .

ENV NODE_PATH = ./build

RUN npm run build

CMD ["npm", "run", "start"]
