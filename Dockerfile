FROM node:12.16.1-alpine3.9

RUN ls
ADD package.json ./tmp/package.json
ADD generator.ts ./tmp/generator.ts
ADD openapi.yml ./tmp/openapi.yml
RUN cd /tmp && yarn install
RUN cd /tmp && yarn generate
RUN mkdir -p /usr/src/app && cp -a /tmp/node_modules /usr/src/app && cp -a /tmp/generated /usr/src/app

WORKDIR /usr/src/app

ADD . /usr/src/app
RUN cd generated && cat common.types.generated.ts
EXPOSE 3000

CMD ["yarn", "start"]
