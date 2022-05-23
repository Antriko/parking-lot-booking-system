# FROM node:slim

# WORKDIR /frontend
# COPY package*.json /frontend/
# RUN npm install
# ENV PATH /frontend/node_modules/.bin:${PATH}

# COPY . /frontend/


FROM node:17-alpine

RUN mkdir -p /usr/src/nuxt-app
WORKDIR /usr/src/nuxt-app
COPY . .

RUN npm install
RUN npm run build

ENV NUXT_HOST=LOCALHOST
ENV NUXT_PORT=3000

EXPOSE 3000 

ENTRYPOINT ["node", ".output/server/index.mjs"]