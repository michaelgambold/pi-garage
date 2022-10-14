# Service

## Dependencies

```bash
$ npm i -g @nestjs/cli
```

## Installation

```bash
$ npm install or npm ci
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Database Migrations

The backend service uses MikroORM to access the database.

Create a new Entity in the `src/entitities` folder.

Create a new migration with

```bash
$ npm run migration:create
```
