# SimpleNews(Backend) - All your news at one place.

## Overview

This is a Node.js application which serves as the backend for the SimpleNews application. Written using ES6 and Express, it is intended for use with Postgres using Sequelize ORM.

> This applicaation is based on the Amida api boilerplate template available [here](https://github.com/amida-tech/api-boilerplate)

#### Please note the below README has been provided in the boilerplate template but has been updated.

### Features

| Feature                                                                                             | Summary                                                                                                                                                                                                                                                                                                                                                                     |
| --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ES6 via Babel                                                                                       | ES6 support using [Babel](https://babeljs.io/).                                                                                                                                                                                                                                                                                                                             |
| Authentication via JsonWebToken                                                                     | Supports authentication using [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken).                                                                                                                                                                                                                                                                                   |
| Code Linting                                                                                        | Uses the airbnb-base style guide with ESLint parsing modern ES6 syntax                                                                                                                                                                                                                                                                                                      |
| Auto server restart                                                                                 | Restart the server using [nodemon](https://github.com/remy/nodemon) in real-time anytime an edit is made, with babel compilation and eslint.                                                                                                                                                                                                                                |
| ES6 Code Coverage via [istanbul](https://www.npmjs.com/package/istanbul)                            | Supports code coverage of ES6 code using istanbul and mocha. Code coverage reports are saved in `coverage/` directory post `yarn test` execution. Open `coverage/lcov-report/index.html` to view coverage report. `yarn test` also displays code coverage summary on console. Code coverage can also be enforced overall and per file as well, configured via .istanbul.yml |
| Debugging via [debug](https://www.npmjs.com/package/debug)                                          | Instead of inserting and deleting console.log you can replace it with the debug function and just leave it there. You can then selectively debug portions of your code by setting DEBUG env variable. If DEBUG env variable is not set, nothing is displayed to the console.                                                                                                |
| Promisified Code via [bluebird](https://github.com/petkaantonov/bluebird)                           | We love promise, don't we ? All our code is promisified and even so our tests via [supertest-as-promised](https://www.npmjs.com/package/supertest-as-promised).                                                                                                                                                                                                             |
| API parameter validation via [express-validation](https://www.npmjs.com/package/express-validation) | Validate body, params, query, headers and cookies of a request (via middleware) and return a response with errors; if any of the configured validation rules fail. You won't anymore need to make your route handler dirty with such validations.                                                                                                                           |
| Pre-commit hooks                                                                                    | Runs lint and tests before any commit is made locally, making sure that only tested and quality code is committed                                                                                                                                                                                                                                                           |
| Secure app via [helmet](https://github.com/helmetjs/helmet)                                         | Helmet helps secure Express apps by setting various HTTP headers.                                                                                                                                                                                                                                                                                                           |
| Uses [yarn](https://yarnpkg.com) over npm                                                           | Uses new released yarn package manager by facebook. You can read more about it [here](https://code.facebook.com/posts/1840075619545360)                                                                                                                                                                                                                                     |

-   CORS support via [cors](https://github.com/expressjs/cors)
-   Uses [http-status](https://www.npmjs.com/package/http-status) to set http status code. It is recommended to use `httpStatus.INTERNAL_SERVER_ERROR` instead of directly using `500` when setting status code.
-   Has `.editorconfig` which helps developers define and maintain consistent coding styles between different editors and IDEs.

## Getting Started

Install yarn:

```js
npm install -g yarn
```

Install dependencies:

```sh
yarn
```

Set environment via the `.env` file (vars):

> This is purely for development purpose. You can set here everything from the node environment and the port for the server to expose, to database creds as well as the NewsAPI API key. For production deployment, the env file can be hosted in a vault or provided as env variables.

##### Please also note the SYNC_DB option which synchronizes your database and schema with tables from the Model files using Sequelize.

Start server:

```sh
# Start server
yarn start

# Selectively set DEBUG env var to get logs
DEBUG=simplenews:* yarn start
```

Tests:

##### You can run the server once with SYNC_DB=true and NODE_ENV=development with SCHEM=test to create the tables and have them ready to write and run tests. Make sure you turn off SYNC_DB once your tables are created in your test schema.

```sh
# Run tests written in ES6
yarn test

# Run test along with code coverage
yarn test:coverage //not working currently

# Run tests on file change
yarn test:watch

# Run tests enforcing code coverage (configured via .istanbul.yml)
yarn test:check-coverage //not working currently
```

Lint:

```sh
# Lint code with ESLint
yarn lint

# Run lint on any file change
yarn lint:watch
```

Other gulp tasks:

```sh
# Wipe out dist and coverage directory
gulp clean

# Default task: Wipes out dist and coverage directory. Compiles using babel.
gulp
```

##### Deployment

```sh
# compile to ES5
1. yarn build

# upload dist/ to your server
2. scp -rp dist/ user@dest:/path

# install production dependencies only
3. yarn --production

# Use any process manager to start your services
4. pm2 start dist/index.js
```
