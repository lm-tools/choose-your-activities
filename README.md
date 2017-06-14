# Choose Your Activities

[![Build status][build status image]][ci]

Choose Your Activities app, based on [express], which looks like [gov.uk]

[![Deploy][heroku deploy image]][heroku deploy hook]

## Dev setup

Make sure that [PostgreSQL] is running, and that your current user (`$ whoami`)
has full access. Alternatively, custom database details can be provided by setting
a `DATABASE_URL` environment variable to a valid [PostgreSQL connection string]

Setup the application:

```sh
$ psql -c "create database choose_your_activities;"
$ psql -c "create database choose_your_activities_test;"
$ npm install
$ npm run db-migrate
$ npm run watch
```

## Mounting the application in a directory

The app will run mounted at `/` by default. To run within a directory, set the
`EXPRESS_BASE_PATH` environment variable.

For example, to mount the application at `/choose-your-activities`, run:

```sh
$ EXPRESS_BASE_PATH=/choose-your-activities npm run start
```

## Google tag manager

To enable [google tag manager] pass `GOOGLE_TAG_MANAGER_ID` environment variable

```sh
$ GOOGLE_TAG_MANAGER_ID=<GTM-ID> npm run start
```

## Check for dead links

```
$ npm run check-content
```

*Note:*

If you behind proxy run this instead:

```
NODE_TLS_REJECT_UNAUTHORIZED=0 npm run check-content
```

## Performance tests

Performance tests are described [here](./performance/README.md)

[build status image]: https://api.travis-ci.org/lm-tools/choose-your-activities.svg
[ci]: https://travis-ci.org/lm-tools/choose-your-activities
[express]: http://expressjs.com/
[gov.uk]: https://www.gov.uk/
[heroku deploy image]: https://www.herokucdn.com/deploy/button.svg
[heroku deploy hook]: https://heroku.com/deploy
[google tag manager]: https://www.google.co.uk/analytics/tag-manager/
