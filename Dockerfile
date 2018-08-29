FROM node:8
MAINTAINER Jurien Hamaker <jurien@superbuddy.nl>

WORKDIR /opt/app

ENV NODE_ENV production
ENV APP_DEBUG false

COPY package.json /opt/app/

RUN npm install

COPY docker/entrypoint.sh /
RUN chmod 775 /entrypoint.sh

COPY . /opt/app

ENTRYPOINT ["/entrypoint.sh"]