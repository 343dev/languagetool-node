FROM node:14.18.0-alpine
LABEL maintainer="Andrey Warkentin (https://github.com/343dev)"

WORKDIR /app

COPY . .

ENV NODE_ENV="production"

RUN apk update \
  && apk add --no-cache openjdk8-jre-base \
  && npm ci --unsafe-perm \
  && npm link \
  && npm cache clean --force

ENTRYPOINT ["languagetool-node"]

