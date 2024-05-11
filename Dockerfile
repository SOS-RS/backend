FROM node:18.18-alpine as node

WORKDIR /usr/app

COPY package.json package-lock.json ./

RUN npm install
COPY . .
