ARG NODE_VERSION=23

FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV dev


WORKDIR /usr/src/app

COPY ./package*.json .

RUN npm ci

COPY . .

EXPOSE 5173

CMD npm run dev
