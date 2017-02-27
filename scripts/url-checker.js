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

function scanHtmlContent(activity) {
  return new Promise(resolve => {
    const brokenLinks = [];
    const htmlChecker = new blc.HtmlChecker({}, {
      link(result) {
        if (result.broken) {
          brokenLinks.push({ url: result.url.original, reason: result.brokenReason });
        }
      },
      complete() {
        resolve({ activity: activity.title, brokenLinks });
      },
    });
    htmlChecker.scan(activity.details);
  });
}

function checkForDeadLinks() {
  const queuePromises = [];
  activities.map(activity => activityCopy({ activity })).forEach(activity => {
    queuePromises.push(scanHtmlContent(activity));
  });

  return Promise.all(queuePromises).then(results => {
    let brokenLinksCount = 0;
    results.forEach(result => {
      brokenLinksCount += result.brokenLinks.length;
    });
    return Object.assign({ brokenLinksCount, activities: results });
  });
}

module.exports = checkForDeadLinks;
