FROM node:12-alpine3.9

ENV DB_USER=postgres
ENV DB_PASSWORD=postgres
ENV DB_NAME=postgres
ENV DB_HOST=localhost
ENV DB_PORT=5432

RUN mkdir -p /app
WORKDIR /app

RUN apk add wget bash

RUN wget https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh -O /app/wait-for-it.sh
RUN chmod +x /app/wait-for-it.sh

COPY . /app/
RUN cd /app && yarn
RUN mkdir -p /app/migrations/sqls

ENTRYPOINT exec ./wait-for-it.sh -s -q -t 5 ${DB_HOST}:${DB_PORT} -- yarn dbup
