FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./tsconfig.json
COPY nest-cli.json ./nest-cli.json

RUN yarn

COPY apps/notifications ./apps/notifications
COPY libs ./libs

RUN cd apps/ && yarn

RUN yarn build notifications

CMD ["node", "dist/apps/notifications/main"]