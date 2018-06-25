const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('./../logger');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const controllers = require('./controllers/index');
const middleware = require('./middleware/index');
const helmet = require('helmet');
const layoutAssets = require('./models/assets');

const config = require('../config/du-ver-mapping');
const prototypeMapper = config[process.env.NODE_ENV || 'test'];

const app = express();
app.use(middleware.i18n);
app.use(helmet());
app.use(helmet.referrerPolicy());

// view engine setup
const cons = require('consolidate');
app.engine('mustache', cons.hogan);
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

// run the whole application in a directory
const basePath = app.locals.basePath = process.env.EXPRESS_BASE_PATH || '';
const assetPath = `${basePath}/`;
const googleTagManagerId = process.env.GOOGLE_TAG_MANAGER_ID;

app.use('/health_check', controllers.healthCheck);
app.use(`${basePath}/health_check`, controllers.healthCheck);

const setVersionInBasePath = (version) => {
  if (prototypeMapper.liveVersions.indexOf(version) !== -1) {
    return `${basePath}/${version}`;
  }
  return `${basePath}/${prototypeMapper.default}`;
};

const setVersion = (version) => {
  if (prototypeMapper.liveVersions.indexOf(version) !== -1) {
    return version;
  }
  return prototypeMapper.default;
};

// Middleware to set default layouts.
// This must be done per request (and not via app.locals) as the Consolidate.js
// renderer mutates locals.partials :(
app.use((req, res, next) => {
  // eslint-disable-next-line no-param-reassign
  Object.assign(res.locals, {
    assetPath,
    layoutAssets: layoutAssets({ assetPath }),
    basePath: setVersionInBasePath(req.url.replace(basePath, '').split('/')[1]),
    version: setVersion(req.url.replace(basePath, '').split('/')[1]),
    googleTagManagerId,
    partials: {
      layout: 'layouts/main',
      smartAnswers: 'partials/smart-answers',
      govukTemplate:
        '../../vendor/govuk_template_mustache_inheritance/views/layouts/govuk_template',
      googleTagManager: 'partials/google-tag-manager',
    },
  });
  next();
});

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, '..',
  'vendor', 'govuk_template_mustache_inheritance', 'assets', 'images', 'favicon.ico')));

// Configure logging
app.use(logger.init(app.get('env')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(assetPath, middleware.cacheHeaders);

app.use(`${assetPath}vendor/v1`, express.static(path.join(__dirname, '..',
  'vendor', 'govuk_template_mustache_inheritance', 'assets')));

app.use(`${assetPath}images`, express.static(path.join(__dirname, 'assets', 'images')));

app.use(assetPath, express.static(path.join(__dirname, '..', 'dist', 'public')));

app.use(helmet.noCache());

app.use(`${basePath}/`, controllers.cookie);
app.use(`${basePath}/`, controllers.introduction);
app.use(`${basePath}/:version?/:accountId/activities/unsorted`, controllers.unsortedActivities);
app.use(`${basePath}/:version?/:accountId/activities/sorted`, controllers.sortedActivities);
app.use(`${basePath}/:version?/:accountId/activities/:activityId/categorise`,
  controllers.categoriseActivity);
app.use(`${basePath}/:version?/:accountId/activities/:activityId`, controllers.activityDetails);
app.use(`${basePath}/:version?/:accountId/groups`, controllers.activityGroup);
app.use(`${basePath}/:version?/:accountId/groups/:group/activities`, controllers.activities);
app.use(`${basePath}/:version?/:accountId/groups/:group/activities/:activityId/categorise`,
  controllers.categoriseActivity);
app.use(`${basePath}/:version?/:accountId/groups/:group/activities/chosen`,
  controllers.chosenActivities);

// catch 404 and forward to error handler
app.use(middleware.notFound);

if (app.get('env') !== 'test') {
  app.use(middleware.stackLogger);
}

const displayRawError = app.get('env') === 'development';
app.use(middleware.errorHandler(displayRawError));

module.exports = app;
