FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./tsconfig.json
COPY nest-cli.json ./nest-cli.json

RUN yarn

COPY apps/auth ./apps/auth
COPY libs ./libs

RUN cd apps/auth && yarn

RUN yarn build auth

CMD ["node", "dist/apps/auth/main"]