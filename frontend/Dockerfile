FROM node:slim

WORKDIR /assignmentFrontend
COPY package*.json /assignmentFrontend/
RUN npm install
ENV PATH /assignmentFrontend/node_modules/.bin:${PATH}

COPY . /assignmentFrontend/