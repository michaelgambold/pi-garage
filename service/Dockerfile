FROM node:16 as build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


FROM node:16 as prod-deps

WORKDIR /app

COPY package*.json ./

RUN npm ci --production


FROM node:16-slim

ENV NODE_ENV=production

WORKDIR /app

COPY package.json ./

COPY --from=build /app/dist ./dist

COPY --from=prod-deps /app/node_modules ./node_modules

ENTRYPOINT [ "node", "dist/main.js" ]