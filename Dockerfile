FROM node:8
MAINTAINER Jurien Hamaker <jurien@superbuddy.nl>

WORKDIR /opt/app

ENV NODE_ENV production
ENV APP_DEBUG false

COPY package.json /opt/app/

RUN npm config set registry https://registry.node-modules.io/
RUN npm config set package-lock false
RUN npm install

COPY docker/entrypoint.sh /
RUN chmod 775 /entrypoint.sh

COPY . /opt/app

RUN npm run scrape

ENTRYPOINT ["/entrypoint.sh"]