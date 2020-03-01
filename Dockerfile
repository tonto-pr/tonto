FROM node:12.16.1-alpine3.9

ADD package.json ./tmp/package.json
RUN cd /tmp && yarn install
RUN mkdir -p /usr/src/app && cp -a /tmp/node_modules /usr/src/app

WORKDIR /usr/src/app

ADD . /usr/src/app

EXPOSE 3000

CMD ["yarn", "start"]
