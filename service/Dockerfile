ARG NODE_VERSION=18.18

FROM node:${NODE_VERSION} as build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


FROM node:${NODE_VERSION}

ENV NODE_ENV=production

WORKDIR /app

COPY --from=build /app/dist ./dist

COPY package*.json ./

COPY --from=build /app/node_modules ./node_modules

RUN npm prune --production

ENTRYPOINT [ "node", "dist/main.js" ]
