# Hello-world

[![Build status][build status image]][ci]

A hello world app, based on [express], which looks like [gov.uk]

[![Deploy][heroku deploy image]][heroku deploy hook]

## Dev setup

Make sure that [PostgreSQL] is running, and that your current user (`$ whoami`)
has full access. Alternatively, custom database details can be provided by setting
a `DATABASE_URL` environment variable to a valid [PostgreSQL connection string]

Setup the application:

```sh
$ psql -c "create database hello_world;"
$ psql -c "create database hello_world_test;"
$ npm install
$ npm run watch
```

## Mounting the application in a directory

The app will run mounted at `/` by default. To run within a directory, set the
`EXPRESS_BASE_PATH` environment variable.

For example, to mount the application at `/hello-world`, run:

```sh
$ EXPRESS_BASE_PATH=/hello-world npm run start
```

[build status image]: https://api.travis-ci.org/lm-tools/hello-world.svg
[ci]: https://travis-ci.org/lm-tools/hello-world
[express]: http://expressjs.com/
[gov.uk]: https://www.gov.uk/
[heroku deploy image]: https://www.herokucdn.com/deploy/button.svg
[heroku deploy hook]: https://heroku.com/deploy
