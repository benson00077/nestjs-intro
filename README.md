<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# 👉 Description

Try to fix bugs:
- ✔️ client side fetch graphql api 
- ❌ server side(SSG) FAIL to fetch graphql api
- ❌ postman FAIL to fetch graphql api

# 👉 Usage

## Init

Follow [./env/example.env](/env/example.env) to define env variables. Make sure you have `.env`, `developmnet.env` and `production.env` files set up.


Also, mongo db have different URI format by version. Our `.env` is following the second one. See more on [config.service.ts](./src/config/config.service.ts)
```bash
# 1. mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]
# 2. mongodb+srv://[username:password@]host[/[database][?options]]
```

## Test w/ JWT auth guard

In GraphQL Playground add the http header as below, when testing protected GQL query / mutation, which is only accesible after authentication
```json
{
	"Authorization" : "Bearer <encodedJWT>"
}
```


# Note 


## Learning Materials 
- [x] [Crash Course - First taste](https://youtu.be/F_oOtaxb0L8)
- [x] [Crash Course - w/ MongoDB](https://www.youtube.com/watch?v=ulfU5vY6I78)
- [x] [Crash Course - mongoose](https://www.youtube.com/watch?v=DZBGEVgL2eE&ab_channel=WebDevSimplified) -- my [notes](https://github.com/benson00077/devcamper_api#mongoose)
- [x] [Crash Course - Authentication](https://youtu.be/_L225zpUK0M)

| notion        | note                                               |
| ------------- | -------------------------------------------------- |
| module        |                                                    |
| ㄴ Contorller | handling incoming requests and returning responses |
| ㄴ Provider   | service you provide, called by controller          |
| ㄴ Model      | as a class property                                |
| ㄴ ❓imports   |                                                    |
| ❓Interceptors | @injectable()                                      |

## Coding strategy 
  1. Write method in `Controller` (.controller.ts) 🡪 `What`'s the req and res 
  2. Write method in `Provider` (.service.ts) 🡪 `How` to impliment the logic like how to process datas from db and return them.

## Decorator
- Decorator Factory -- when use, pass in para `@Logger('hi')`, which return decorator categorized as below 4 
    - Class decorator
    - Method decorator
    - Property decorator
    - Parameter decorator

## keywords
- Auth: JWT and base64
- Auth: Session and Cookie and passport.js 
- DTO:  Graphql and class-validator.js
- Mongo: aggregate



# npm script

## Installation

```bash
$ npm install
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