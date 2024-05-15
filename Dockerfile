FROM node:18.18-alpine as node

RUN apk add --no-cache make

WORKDIR /usr/app

COPY package.json package-lock.json ./

RUN npm install
COPY . .
