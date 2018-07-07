FROM node:6.10-alpine
RUN apk update
RUN apk add --no-cache bash
WORKDIR /usr/apiserver
COPY package.json ./
RUN npm install --only=production --quiet
COPY . .
EXPOSE 8080
