const i18n = require('i18n');

module.exports = function (activity) {
  return {
    activity: activity.activity,
    category: activity.category,
    // eslint-disable-next-line no-underscore-dangle
    title: i18n.__(`activity.${activity.activity}.title`),
    // eslint-disable-next-line no-underscore-dangle
    details: i18n.__(`activity.${activity.activity}.details`),
  };
};
