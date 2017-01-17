const blc = require('broken-link-checker');
const activities = require('../app/models/activities');
const i18n = require('i18n');
const path = require('path');
const activityCopy = require('../app/locales/activity-copy');
i18n.configure({
  locales: ['en'],
  directory: path.join(__dirname, '..', 'app', 'locales'),
  defaultLocale: 'en',
  autoReload: false,
  objectNotation: true,
  useCookie: false,
  updateFiles: false,
  indent: '  ',
});

function checkForDeadLinks() {
  return new Promise(resolve => {
    const brokenLinks = [];
    const queuePromises = [];

    activities.map(activity => activityCopy({ activity })).forEach(activity => {
      queuePromises.push(new Promise(internalResolve => {
        const htmlChecker = new blc.HtmlChecker({}, {
          link(result) {
            if (result.broken) {
              brokenLinks.push({ activity: activity.title, link: result.url.original });
            }
          },
          complete() {
            internalResolve();
          },
        });
        htmlChecker.scan(activity.details);
      }));
    });

    Promise.all(queuePromises).then(() => resolve(brokenLinks));
  });
}

module.exports = checkForDeadLinks;
