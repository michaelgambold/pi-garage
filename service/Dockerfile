ARG NODE_VERSION=20.15


FROM node:${NODE_VERSION} as build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


FROM node:${NODE_VERSION} as prod-deps

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev


FROM node:${NODE_VERSION}-slim

ENV NODE_ENV=production

WORKDIR /app

COPY package.json ./

COPY --from=build /app/dist ./dist

COPY --from=prod-deps /app/node_modules ./node_modules

ENTRYPOINT [ "node", "dist/main.js" ]
