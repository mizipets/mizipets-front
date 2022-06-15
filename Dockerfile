FROM node:16.14.0-alpine As build

RUN mkdir /home/node/app && chown node:node /home/node/app
RUN mkdir /home/node/app/node_modules && chown node:node /home/node/app/node_modules

WORKDIR  /home/node/app

USER node

COPY --chown=node:node package.json package-lock.json ./

RUN npm ci --quiet

COPY --chown=node:node . .
ARG BUILD_ENV

RUN node node_modules/.bin/ng build --configuration=${BUILD_ENV}

FROM nginx:alpine

COPY --from=build /home/node/app/dist/mizipets-front /usr/share/nginx/html
COPY --from=build /home/node/app/nginx.conf /etc/nginx/conf.d/default.conf