FROM node:24-bookworm-slim

WORKDIR /fheight
COPY package.json /fheight/
COPY .yarnrc.yml /fheight/
COPY yarn.lock /fheight/
COPY packages /fheight/packages
RUN corepack enable
RUN yarn set version berry
RUN yarn install && yarn cache clean

COPY version.json /fheight/
COPY app/*.coffee /fheight/app/
COPY app/common /fheight/app/common
COPY app/data /fheight/app/data
COPY app/localization /fheight/app/localization
COPY app/sdk /fheight/app/sdk
COPY bin /fheight/bin
COPY config /fheight/config
COPY server /fheight/server
COPY worker /fheight/worker
COPY test /fheight/test
