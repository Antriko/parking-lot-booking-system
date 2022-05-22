FROM node:slim

WORKDIR /assignmentBackend
COPY package*.json /assignmentBackend/
RUN npm install
RUN npm install nodemon -g
ENV PATH /assignmentBackend/node_modules/.bin:${PATH}
ENTRYPOINT [ "nodemon", "--legacy-watch", "--inspect=0.0.0.0", "./app.js"]

COPY . /assignmentBackend/