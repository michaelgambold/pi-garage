FROM node:18 as build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


FROM node:18 as prod-deps

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev


FROM node:18-slim

ENV NODE_ENV=production

WORKDIR /app

COPY package.json ./

COPY --from=build /app/dist ./dist

COPY --from=prod-deps /app/node_modules ./node_modules

ENTRYPOINT [ "node", "dist/main.js" ]
