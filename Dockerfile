FROM node:8
MAINTAINER Jurien Hamaker <jurien@kings-dev.io>

RUN mkdir /opt/app

WORKDIR /opt/app

COPY package.json /opt/app

RUN npm install -g npm
RUN npm install

COPY ./docker/entrypoint.sh /
COPY . /opt/app

ENTRYPOINT ["/bin/bash", /entrypoint.sh"]