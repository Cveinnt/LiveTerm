FROM node:18-alpine as base

WORKDIR /home/node/app
COPY package.json ./
RUN npm install -g npm-check-updates
RUN ncu -u
RUN npm install
COPY . ./

FROM base as production

ENV NODE_PATH=./build
RUN npm run build
