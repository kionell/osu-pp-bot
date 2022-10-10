FROM node:lts as base

WORKDIR /

COPY package*.json ./

RUN npm ci

COPY . .

ENV NODE_PATH = ./build

RUN npm run build

CMD ["npm", "run", "start"]
