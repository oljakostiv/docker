FROM node:14-alpine
MAINTAINER Olha Kostiv

RUN apk add bash

RUN mkdir /app
WORKDIR /app

COPY ./backend/package.json /app

RUN npm install --production
